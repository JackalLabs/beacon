import type {
  IFileIo,
  IFolderHandler,
  IRnsHandler,
  IRnsOwnedHashMap, IUploadList,
  IWalletConfig,
  IWalletHandler
} from '@jackallabs/jackal.js'
import { FileUploadHandler, FolderHandler, WalletHandler } from '@jackallabs/jackal.js'
import { mainnetConfig } from '@/config/mainnet.ts'

const workspace = 'newsboy'
const publish = 'publish' // TODO

interface IBStore {
  initWallet(selectedWallet: string): Promise<void>

  getOwnedRns(): IRnsOwnedHashMap | null
  getJackalAddress(): string
  getDraftsFolder(): FolderHandler

  saveDraft(name: string, source: string): Promise<void>

  isWalletInit(): boolean
  isFileIoInit(): boolean
  isRnsInit(): boolean

  saveDraft(name: string, source: string): Promise<void>
}

class BStore implements IBStore {
  private globalWallet: IWalletHandler | null
  private globalFileIo: IFileIo | null
  private globalRns: IRnsHandler | null
  private jackalAddress: string
  private ownedRns: IRnsOwnedHashMap | null

  private draftsFolder: IFolderHandler | null

  constructor() {
    this.globalWallet = null
    this.globalFileIo = null
    this.globalRns = null
    this.jackalAddress = ''
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

  async getDraftsFolder(): FolderHandler {
    if (!this.draftsFolder) {
      throw Error('no drafts')
    }
    return this.draftsFolder
  }






  async saveDraft(name: string, source: string): Promise<void> {
    if (!this.globalFileIo || !this.draftsFolder) {
      throw 'oh fuck file io'
    }

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










  private async fetchDraftsFolder(): Promise<void> {
    this.draftsFolder = await this.globalFileIo.downloadFolder(['s', workspace, 'drafts'].join('/'))
  }

  private async loadAvailableRns() {
    if (!this.globalRns) {
      throw 'oh fuck rns'
    }
    this.ownedRns = await this.globalRns.findMyExistingNames()
  }

  private async prepWorkspace() {
    if (!this.globalFileIo) {
      throw 'oh fuck file io'
    }
    try {

      await this.globalFileIo.verifyFoldersExist([workspace, publish]);

      await this.fetchDraftsFolder()
    } catch (err: any) {
      console.log(err);
      console.log("AHHHHH");
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
