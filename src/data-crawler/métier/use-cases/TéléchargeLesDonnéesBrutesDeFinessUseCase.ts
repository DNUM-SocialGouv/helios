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
    const t0 = performance.now()
    try {
      await this.downloadDataSource.exécute(rawData, sftpPath, finessLocalPath)
    } catch (error) {
      throw new HeliosError(error.message)
    }
    const t1 = performance.now()
    console.log(`Temps de téléchargement des données brutes de FINESS: ${t1 - t0}ms`)

    try {
      await this.unzipRawData.exécute(rawData, finessLocalPath)
    } catch (error) {
      throw new HeliosError(error.message)
    }
    const t2 = performance.now()
    console.log(`Temps de décompression des données brutes de FINESS: ${t2 - t1}ms`)

  }
}
