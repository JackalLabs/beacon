import type { IFileIo, IRnsHandler, IRnsOwnedHashMap, IWalletConfig, IWalletHandler } from '@jackallabs/jackal.js'
import { WalletHandler } from '@jackallabs/jackal.js'
import { mainnetConfig } from '@/config/mainnet.ts'

// window.Buffer = Buffer

interface IBStore {
  initWallet(selectedWallet: string): Promise<void>

  getOwnedRns(): IRnsOwnedHashMap | null
  getJackalAddress(): string

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
      const workspace = 'Newsboy'
      const publish = 'radiant'
      await this.globalFileIo.verifyFoldersExist([workspace, publish]);
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
