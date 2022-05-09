import { DownloadDataSource } from '../entities/DownloadDataSource'
import { ErreurHelios } from '../entities/ErreurHelios'
import { UnzipDataSource } from '../entities/UnzipDataSource'

export class RetrieveDataSourceFromFinessToLocal {
  constructor(
    private readonly downloadDataSource: DownloadDataSource,
    private readonly zipDataSource: UnzipDataSource
  ) {}

  async handle() {
    const dataSource = 'FINESS'
    const sftpPath = 'flux_finess'
    const finessLocalPath = 'finess'

    try {
      await this.downloadDataSource.handle(dataSource, sftpPath, finessLocalPath)
    } catch (error) {
      throw new ErreurHelios(error.message)
    }

    try {
      await this.zipDataSource.handle(dataSource, finessLocalPath)
    } catch (error) {
      throw new ErreurHelios(error.message)
    }
  }
}
