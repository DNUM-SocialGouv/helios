import { HeliosError } from '../../infrastructure/HeliosError'
import { DownloadRawData } from '../gateways/DownloadRawData'
import { UnzipRawData } from '../gateways/UnzipRawData'

export class TéléchargeLesDonnéesBrutesDeFinessUseCase {
  constructor(
    private readonly downloadDataSource: DownloadRawData,
    private readonly unzipRawData: UnzipRawData
  ) {}

  async handle() {
    const rawData = 'FINESS'
    const sftpPath = 'flux_finess'
    const finessLocalPath = 'finess'

    try {
      await this.downloadDataSource.handle(rawData, sftpPath, finessLocalPath)
    } catch (error) {
      throw new HeliosError(error.message)
    }

    try {
      await this.unzipRawData.handle(rawData, finessLocalPath)
    } catch (error) {
      throw new HeliosError(error.message)
    }
  }
}
