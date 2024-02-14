import type {
  IFileDownloadHandler,
  IFileIo,
  IFolderHandler,
  IRnsHandler,
  IRnsOwnedHashMap, IUploadList,
  IWalletConfig,
  IWalletHandler
} from '@jackallabs/jackal.js'
import { FileUploadHandler, FolderHandler, WalletHandler } from '@jackallabs/jackal.js'
import { mainnetConfig } from '@/config/mainnet.ts'
import { sanitizeName } from '@/utils/conversion.ts'

const workspace = 'beacon'

interface IBStore {
  initWallet(selectedWallet: string): Promise<void>

  getOwnedRns(): IRnsOwnedHashMap | null
  getJackalAddress(): string
  getWorkspaceFolder(): FolderHandler
  getDraftsFolder(): FolderHandler
  getPublishedFolder(): FolderHandler
  loadDraft(name: string): Promise<string>

  saveDraft(name: string, source: string): Promise<void>
  publishFinal(name: string, source: string): Promise<void>
  compilePublications(): Promise<void>

  isWalletInit(): boolean
  isFileIoInit(): boolean
  isRnsInit(): boolean
}

class BStore implements IBStore {
  private globalWallet: IWalletHandler | null
  private globalFileIo: IFileIo | null
  private globalRns: IRnsHandler | null
  private jackalAddress: string
  private ownedRns: IRnsOwnedHashMap | null

  private workspaceFolder: IFolderHandler | null
  private draftsFolder: IFolderHandler | null
  private publishedFolder: IFolderHandler | null

  constructor() {
    this.globalWallet = null
    this.globalFileIo = null
    this.globalRns = null
    this.jackalAddress = ''

    this.ownedRns = null
    this.workspaceFolder = null
    this.draftsFolder = null
    this.publishedFolder = null
  }

  async initWallet(selectedWallet: string = 'leap'): Promise<void> {
    const walletConfig: IWalletConfig = {
      selectedWallet,
      ...mainnetConfig,
    };
    this.globalWallet = await WalletHandler.trackWallet(walletConfig);
    this.jackalAddress = this.globalWallet.getJackalAddress()

    this.globalFileIo = await this.globalWallet.makeFileIoHandler('1.1.x')
    if (this.globalWallet.getRnsInitStatus()) {
      this.globalRns = await this.globalWallet.makeRnsHandler()
      this.loadAvailableRns()
    }
    await this.prepWorkspace()
  }

  getOwnedRns(): IRnsOwnedHashMap | null {
    return this.ownedRns
  }

  getJackalAddress(): string {
    return this.jackalAddress
  }

  async getWorkspaceFolder(): FolderHandler {
    if (!this.workspaceFolder) {
      throw Error('no workspace')
    }
    return this.workspaceFolder
  }

  async getDraftsFolder(): FolderHandler {
    if (!this.draftsFolder) {
      throw Error('no drafts')
    }
    return this.draftsFolder
  }

  async getPublishedFolder(): FolderHandler {
    if (!this.publishedFolder) {
      throw Error('no published')
    }
    return this.publishedFolder
  }

  async loadDraft(name: string): Promise<string> {
    if (!this.globalFileIo || !this.draftsFolder) {
      throw 'oh fuck file io'
    }

    const details = {
      rawPath: this.draftsFolder.getMyChildPath(name),
      owner: this.jackalAddress,
      isFolder: false
    }
    const download = await this.globalFileIo.downloadFile(details, { track: 0 }) as IFileDownloadHandler
    return await download.receiveBacon().text()
  }

  async saveDraft(name: string, source: string): Promise<void> {
    if (!this.globalFileIo || !this.draftsFolder) {
      throw 'oh fuck file io'
    }
    await this.globalFileIo.shuffle()

    const tmpFile = new File([source], name)
    const handler = await FileUploadHandler.trackFile(tmpFile, this.draftsFolder.getMyPath())
    const upload: IUploadList = {}
    upload[name] = {
      data: null,
      exists: false,
      handler,
      key: name,
      uploadable: await handler.getForUpload()
    }
    await this.globalFileIo.staggeredUploadFiles(upload, this.draftsFolder, { complete: 0, timer: 0 })
    await this.fetchDraftsFolder()
  }

  async publishFinal(name: string, source: string): Promise<void> {
    if (!this.globalFileIo || !this.publishedFolder) {
      throw 'oh fuck file io'
    }
    const safeName = `${sanitizeName(name)}.html`

    await this.globalFileIo.shuffle()
    const publishFile = new File([source], safeName)
    const handler = await FileUploadHandler.trackFile(publishFile, this.publishedFolder.getMyPath())
    const upload: IUploadList = {}
    upload[safeName] = {
      data: null,
      exists: false,
      handler,
      key: safeName,
      uploadable: await handler.getForPublicUpload()
    }
    await this.globalFileIo.staggeredUploadFiles(upload, this.publishedFolder, { complete: 0, timer: 0 })
    await this.fetchPublishedFolder()

    await this.compilePublications()
  }

  async compilePublications(): Promise<void> {
    if (!this.globalFileIo || !this.publishedFolder) {
      throw 'oh fuck file io'
    }

    const folder = this.getPublishedFolder()
    const final = {}
    const children = folder.getChildFiles()
    for (const name in children) {
      final[name] = children[name].lastModified
    }

    await this.globalFileIo.shuffle()

    const fileName = 'worx'
    const worxFile = new File([JSON.stringify(final)], fileName)
    const handler = await FileUploadHandler.trackFile(worxFile, this.workspaceFolder.getMyPath())
    const upload: IUploadList = {}
    upload[fileName] = {
      data: null,
      exists: false,
      handler,
      key: fileName,
      uploadable: await handler.getForPublicUpload()
    }
    await this.globalFileIo.staggeredUploadFiles(upload, this.workspaceFolder, { complete: 0, timer: 0 })
    await this.fetchWorkspaceFolder()
  }

  private async fetchWorkspaceFolder(): Promise<void> {
    this.workspaceFolder = await this.globalFileIo.downloadFolder(['s', workspace].join('/'))
  }

  private async fetchDraftsFolder(): Promise<void> {
    this.draftsFolder = await this.globalFileIo.downloadFolder(['s', workspace, 'drafts'].join('/'))
  }

  private async fetchPublishedFolder(): Promise<void> {
    this.publishedFolder = await this.globalFileIo.downloadFolder(['s', workspace, 'published'].join('/'))
  }

  private async loadAvailableRns() {
    if (!this.globalRns) {
      throw 'oh fuck rns'
    }
    this.ownedRns = await this.globalRns.findMyExistingNames()
  }

  private async prepWorkspace(): Promise<void> {
    if (!this.globalFileIo) {
      throw 'oh fuck file io'
    }
    if (await this.globalFileIo.checkFolderIsFileTree(['s', workspace].join('/'))) {
      await this.fetchWorkspaceFolder()
      await this.fetchDraftsFolder()
      await this.fetchPublishedFolder()
    } else {
      await this.globalFileIo.generateInitialDirs(null, [workspace])
      await this.fetchWorkspaceFolder()
      if (!this.workspaceFolder) {
        throw 'oh fuck workspace folder'
      }
      await this.globalFileIo.createFolders(this.workspaceFolder, ['drafts', 'published'])

      await this.fetchDraftsFolder()
      await this.fetchPublishedFolder()
    }
  }

  isWalletInit(): boolean {
    return !!this.globalWallet
  }
  isFileIoInit(): boolean {
    return !!this.globalFileIo
  }
  isRnsInit(): boolean {
    return !!this.globalRns
  }
}

export const bStore = new BStore()
