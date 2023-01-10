import { mkdirSync, readFileSync, rmSync } from 'fs'
import path from 'path'
import { FileInfo } from 'ssh2-sftp-client'

import { DownloadRawData } from '../../../métier/gateways/DownloadRawData'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'
import { HeliosError } from '../../HeliosError'
import { ClientSftp } from './ClientSftp'

export class DnumSftpDownloadRawData implements DownloadRawData {
  private readonly extensionDeFichierChiffré = '*.gpg'

  constructor(
    private readonly clientSftp: ClientSftp,
    private readonly environmentVariables: EnvironmentVariables,
    private readonly cheminDesFichiersSourcesSurLeSftp: string,
    private readonly répertoireDeDestination: string,
    private readonly logger: Logger,
    private readonly préfixeDesFichiersÀTélécharger: string[] = [
      'ANN_CA_EJ_ET',
      'ANN_ERRD_EJ',
      'ANN_ERRD_EJ_ET',
      'ANN_MS_TDP_ET',
      'ANN_PER_ERRD_EPRD',
      'ANN_RPU',
      'ANN_SAE',
      'MEN_PMSI_ANNUEL',
    ]
  ) {}

  async exécute(): Promise<void> {
    this.recréeLeRépertoireDeDestination()

    try {
      await this.connexionAuSftp()
      const fichiersSurLeSftp = await this.listeLesFichiersDuSftp()

      for (const préfixeDuFichier of this.préfixeDesFichiersÀTélécharger) {
        const fichierÀTélécharger = this.trouveLeFichierLePlusRécentPortantLePréfixe(préfixeDuFichier, fichiersSurLeSftp)

        if (fichierÀTélécharger) {
          await this.téléchargeLeFichier(fichierÀTélécharger.name)
        } else {
          this.logger.error(`[DIAMANT] Le fichier ${préfixeDuFichier} n’est pas présent sur le sftp.`)
        }
      }

      await this.déconnexionDuSftp()
    } catch (erreur) {
      throw new HeliosError(`[DNUM] Une erreur est survenue lors de la connexion au SFTP : ${erreur.message}`)
    }
  }

  private recréeLeRépertoireDeDestination() {
    rmSync(this.répertoireDeDestination, { force: true, recursive: true })
    mkdirSync(this.répertoireDeDestination, { recursive: true })
  }

  private async connexionAuSftp() {
    await this.clientSftp.connect({
      host: this.environmentVariables.DNUM_SFTP_HOST,
      port: Number(this.environmentVariables.DNUM_SFTP_PORT),
      privateKey: readFileSync(this.environmentVariables.DNUM_SFTP_PRIVATE_KEY),
      username: this.environmentVariables.DNUM_SFTP_USERNAME,
    })

    this.logger.info('[DNUM] La connexion au SFTP est ouverte.')
  }

  private async listeLesFichiersDuSftp() {
    return await this.clientSftp.list(this.cheminDesFichiersSourcesSurLeSftp, this.extensionDeFichierChiffré)
  }

  private async déconnexionDuSftp() {
    await this.clientSftp.end()
    this.logger.info('[DNUM] La connexion au SFTP est fermée.')
  }

  private async téléchargeLeFichier(fichierÀTélécharger: string) {
    await this.clientSftp.fastGet(
      path.join(this.cheminDesFichiersSourcesSurLeSftp, fichierÀTélécharger),
      path.join(this.répertoireDeDestination, fichierÀTélécharger),
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    this.logger.info(`[DNUM] Le fichier DIAMANT ${fichierÀTélécharger} a été téléchargé.`)
  }

  private trouveLeFichierLePlusRécentPortantLePréfixe(préfixeDuFichierÀTélécharger: string, fichiersSurLeSftp: FileInfo[]) {
    const formatDuNomDeFichier = new RegExp(`^${préfixeDuFichierÀTélécharger}_\\d{4}_\\d{2}_\\d{2}.CSV.gpg`)

    const fichiersPertinentsTriésParDate = fichiersSurLeSftp.filter((file: FileInfo) => formatDuNomDeFichier.test(file.name)).sort(this.sortByLastDate)

    return fichiersPertinentsTriésParDate[0]
  }

  private sortByLastDate(a: FileInfo, b: FileInfo) {
    const valueA = a.name
    const valueB = b.name

    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
  }
}
