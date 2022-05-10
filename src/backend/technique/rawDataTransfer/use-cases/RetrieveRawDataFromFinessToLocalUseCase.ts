import { HeliosError } from '../../shared/entities/HeliosError'
import { DownloadRawData } from '../entities/DownloadRawData'
import { UnzipRawData } from '../entities/UnzipRawData'

export class RetrieveRawDataFromFinessToLocalUseCase {
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
