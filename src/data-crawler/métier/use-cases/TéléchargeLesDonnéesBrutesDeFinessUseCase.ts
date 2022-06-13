import { HeliosError } from '../../infrastructure/HeliosError'
import { DownloadRawData } from '../gateways/DownloadRawData'
import { UnzipRawData } from '../gateways/UnzipRawData'

export class TéléchargeLesDonnéesBrutesDeFinessUseCase {
  constructor(
    private readonly downloadDataSource: DownloadRawData,
    private readonly unzipRawData: UnzipRawData
  ) {}

  async exécute() {
    const rawData = 'FINESS'
    const sftpPath = '../usr_finess/flux_finess'
    const finessLocalPath = 'finess'

    try {
      await this.downloadDataSource.exécute(rawData, sftpPath, finessLocalPath)
    } catch (error) {
      const heliosError = new HeliosError(error.message)
      heliosError.reportToSentry()
      throw heliosError
    }

    try {
      await this.unzipRawData.exécute(rawData, finessLocalPath)
    } catch (error) {
      throw new HeliosError(error.message)
    }
  }
}
