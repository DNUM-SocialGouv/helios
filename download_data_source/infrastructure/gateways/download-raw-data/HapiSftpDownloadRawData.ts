import { FileInfo } from "basic-ftp";
import { mkdirSync, rmSync } from "fs";
import path from "path";

import { ClientFtp } from "./ClientFtp";
import { DownloadRawData } from "../../../métier/gateways/DownloadRawData";
import { EnvironmentVariables } from "../../../métier/gateways/EnvironmentVariables";
import { Logger } from "../../../métier/gateways/Logger";
import { HeliosError } from "../../HeliosError";

export class HapiSftpDownloadRawData implements DownloadRawData {

  constructor(
    private readonly clientFtp: ClientFtp,
    private readonly environmentVariables: EnvironmentVariables,
    private readonly cheminDesFichiersSourcesSurLeSftp: string,
    private readonly répertoireDeDestination: string,
    private readonly logger: Logger,
    private readonly prefixeDesFichiersATelecharger: string = "ENGAGEMENTS_PAR_BENEFICIAIRE"
  ) { }

  async exécute(): Promise<void> {
    this.recréeLeRépertoireDeDestination();

    try {
      await this.connexionAuSftp();
      const fichiersSurLeSftp = await this.listeLesFichiersDuSftp();
      const fichiersATelecharger = this.trouveLesFichiersDe5DernieresAnneesPortantLePrefixe(this.prefixeDesFichiersATelecharger, fichiersSurLeSftp);
      if (fichiersATelecharger.length !== 0) {
        for (const fichier of fichiersATelecharger) {
          await this.téléchargeLeFichier(fichier.name);
        }
      }
      await this.deconnexionDuSftp();
    } catch (erreur) {
      throw new HeliosError(`[HAPI] Une erreur est survenue lors de la connexion au SFTP : ${erreur.message}`);
    }
  }

  private async listeLesFichiersDuSftp() {
    return await this.clientFtp.list(this.cheminDesFichiersSourcesSurLeSftp);
  }

  private async téléchargeLeFichier(fichierÀTélécharger: string) {
    await this.clientFtp.downloadTo(
      path.join(this.répertoireDeDestination, fichierÀTélécharger),
      path.join(this.cheminDesFichiersSourcesSurLeSftp, fichierÀTélécharger),
    );
    this.logger.info(`[HAPI] Le fichier ${fichierÀTélécharger} a été téléchargé.`);
  }

  private recréeLeRépertoireDeDestination() {
    rmSync(this.répertoireDeDestination, { force: true, recursive: true });
    mkdirSync(this.répertoireDeDestination, { recursive: true });
  }

  private async connexionAuSftp() {
    await this.clientFtp.access({
      host: this.environmentVariables.HAPI_SFTP_HOST,
      port: Number(this.environmentVariables.HAPI_SFTP_PORT),
      user: this.environmentVariables.HAPI_SFTP_USERNAME,
      password: this.environmentVariables.HAPI_SFTP_PASSWORD,
      secure: "implicit",
      secureOptions: {
        rejectUnauthorized: false,
        host: this.environmentVariables.HAPI_SFTP_HOST,
        port: Number(this.environmentVariables.HAPI_SFTP_PORT),
      }
    });
    this.logger.info("[Hapi] La connexion au SFTP est ouverte.");
  }

  private ParmisLesDernieresAnnees(anneeFichier: number): boolean {
    const currentYear = new Date().getFullYear();
    return anneeFichier <= currentYear && anneeFichier >= currentYear - 4
  }

  private trouveLesFichiersDe5DernieresAnneesPortantLePrefixe(prefixeDesFichiersATelecharger: string, fichiersSurLeSftp: FileInfo[]) {
    const formatDuNomDeFichier = new RegExp(`^${prefixeDesFichiersATelecharger}_\\d{4}_\\d{14}`);
    const fichiersPertinents = fichiersSurLeSftp.filter((file: FileInfo) => {
      return formatDuNomDeFichier.test(file.name) && this.ParmisLesDernieresAnnees(Number(file.name.split('_')[3]))
    });
    this.logger.info(`[HAPI] ${fichiersPertinents.length}  fichiers HAPI ont été trouvés.`);
    return fichiersPertinents;
  }

  private async deconnexionDuSftp() {
    await this.clientFtp.close();
    this.logger.info("[HAPI] La connexion au SFTP est fermée.");
  }

}
