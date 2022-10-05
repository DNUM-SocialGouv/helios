import { HeliosError } from '../../infrastructure/HeliosError'
import { DownloadRawData } from '../gateways/DownloadRawData'

export class TéléchargeLesDonnéesBrutesDiamantUseCase {
  constructor(
    private readonly dnumDownloadRawData: DownloadRawData
  ) {}

  async exécute() {
    try {
      await this.dnumDownloadRawData.exécute()
    } catch (error) {
      throw new HeliosError(error.message)
    }
  }
}
