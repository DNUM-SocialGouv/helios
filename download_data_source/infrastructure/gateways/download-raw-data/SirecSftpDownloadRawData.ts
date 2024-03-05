import { mkdirSync, readFileSync } from "fs";
import path from "path";
import { FileInfo } from "ssh2-sftp-client";

import { DownloadRawData } from "../../../métier/gateways/DownloadRawData";
import { EnvironmentVariables } from "../../../métier/gateways/EnvironmentVariables";
import { Logger } from "../../../métier/gateways/Logger";
import { HeliosError } from "../../HeliosError";
import { ClientSftp } from "./ClientSftp";

export class SirecSftpDownloadRawData implements DownloadRawData {
  constructor(
    private readonly clientSftp: ClientSftp,
    private readonly environmentVariables: EnvironmentVariables,
    private readonly cheminDesFichiersSourcesSurLeSftp: string,
    private readonly repertoireDeDestination: string,
    private readonly logger: Logger,
    private readonly prefixeDesFichiersATelecharger: string = "sirec_"
  ) { }

  async exécute(): Promise<void> {
    this.recréeLeRépertoireDeDestination();

    try {
      await this.connexionAuSftp();

      const fichiersSurLeSftp = await this.listeLesFichiersDuSftp();
      const fichierATelecharger = this.trouveLeFichierLePlusRecentPortantLePrefixe(this.prefixeDesFichiersATelecharger, fichiersSurLeSftp);

      if (fichierATelecharger) {
        await this.telechargeLeFichier(fichierATelecharger.name);
      } else {
        this.logger.error(`[SIREC] Le fichier ${this.prefixeDesFichiersATelecharger} n’est pas présent sur le sftp.`);
      }


      await this.deconnexionDuSftp();

    } catch (erreur) {
      throw new HeliosError(`[Sirec] Une erreur est survenue lors de la connexion au SFTP : ${erreur.message}`);
    }
  }

  private recréeLeRépertoireDeDestination() {
    mkdirSync(this.repertoireDeDestination, { recursive: true });
  }

  private async connexionAuSftp() {
    await this.clientSftp.connect({
      host: this.environmentVariables.DNUM_SFTP_HOST,
      port: Number(this.environmentVariables.DNUM_SFTP_PORT),
      privateKey: readFileSync(this.environmentVariables.DNUM_SFTP_PRIVATE_KEY),
      username: this.environmentVariables.DNUM_SFTP_USERNAME,
    });

    this.logger.info("[Sirec] La connexion au SFTP est ouverte.");
  }

  private async listeLesFichiersDuSftp() {
    return await this.clientSftp.list(this.cheminDesFichiersSourcesSurLeSftp);
  }

  private async deconnexionDuSftp() {
    await this.clientSftp.end();
    this.logger.info("[Sirec] La connexion au SFTP est fermée.");
  }

  private async telechargeLeFichier(fichierATelecharger: string) {
    await this.clientSftp.fastGet(
      path.join(this.cheminDesFichiersSourcesSurLeSftp, fichierATelecharger),
      path.join(this.repertoireDeDestination, fichierATelecharger),
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    this.logger.info(`[Sirec] Le fichier SIREC ${fichierATelecharger} a été téléchargé.`);
  }

  private trouveLeFichierLePlusRecentPortantLePrefixe(prefixeDesFichiersATelecharger: string, fichiersSurLeSftp: FileInfo[]) {
    const formatDuNomDeFichier = new RegExp(`^${prefixeDesFichiersATelecharger}`);
    const fichiersPertinentsTriesParDate = fichiersSurLeSftp.filter((file: FileInfo) => formatDuNomDeFichier.test(file.name)).sort(this.sortByLastDate);
    this.logger.info(`[Sirec] Le fichier SIREC ${fichiersPertinentsTriesParDate} a été téléchargé.`);
    return fichiersPertinentsTriesParDate[0];
  }

  private sortByLastDate(a: FileInfo, b: FileInfo) {
    const valueA = a.name;
    const valueB = b.name;

    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
  }
}
