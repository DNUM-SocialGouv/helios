import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { FileInfo } from "ssh2-sftp-client";

import { ClientSftp } from "./ClientSftp";
import { DownloadRawData } from "../../../métier/gateways/DownloadRawData";
import { EnvironmentVariables } from "../../../métier/gateways/EnvironmentVariables";
import { Logger } from "../../../métier/gateways/Logger";
import { HeliosError } from "../../HeliosError";

export class VigieRhSftpDownloadRawData implements DownloadRawData {
  private readonly extensionDeFichier = "*.parquet";

  constructor(
    private readonly clientSftp: ClientSftp,
    private readonly environmentVariables: EnvironmentVariables,
    private readonly cheminDesFichiersSourcesSurLeSftp: string,
    private readonly repertoireDeDestination: string,
    private readonly logger: Logger,
    private readonly prefixeDesFichiersATelecharger: string[] = [
      "vigierh_table_passage_professions",
      "vigierh_ref_tranche_age",
      "vigierh_ref_profession2",
      "vigierh_ref_profession1",
      "vigierh_ref_nature_contrat",
      "vigierh_ref_motifs_ruptures",
      "vigierh_ref_duree_cdd",
      "vigierh_pyramide",
      "vigierh_profession2",
      "vigierh_profession1",
      "vigierh_nature_contrats_trimestriel",
      "vigierh_nature_contrats_annuel",
      "vigierh_motifs_ruptures",
      "vigierh_etablissement_trimestriel",
      "vigierh_etablissement_mensuel",
      "vigierh_etablissement_annuel",
      "vigierh_duree_cdd",
    ],
  ) { }

  async exécute(): Promise<void> {
    this.recreeLeRepertoireDeDestination();

    try {
      await this.connexionAuSftp();
      const fichiersSurLeSftp = await this.listeLesFichiersDuSftp();

      for (const prefixe of this.prefixeDesFichiersATelecharger) {
        const fichierATelecharger = this.trouveLeFichierLePlusRecentPortantLePrefixe(prefixe, fichiersSurLeSftp);

        if (fichierATelecharger) {
          await this.telechargeLeFichier(fichierATelecharger.name);
        } else {
          this.logger.error(`[VIGIE_RH] Aucun fichier trouvé pour le préfixe ${prefixe} sur le SFTP.`);
        }
      }

      await this.deconnexionDuSftp();
    } catch (error_: any) {
      throw new HeliosError(`[VIGIE_RH] Une erreur est survenue lors de la connexion au SFTP : ${error_.message}`);
    }
  }

  private recreeLeRepertoireDeDestination() {
    rmSync(this.repertoireDeDestination, { recursive: true, force: true });
    mkdirSync(this.repertoireDeDestination, { recursive: true });
  }

  private async connexionAuSftp() {
    await this.clientSftp.connect({
      host: this.environmentVariables.DNUM_SFTP_HOST,
      port: Number(this.environmentVariables.DNUM_SFTP_PORT),
      privateKey: readFileSync(this.environmentVariables.DNUM_SFTP_PRIVATE_KEY),
      username: this.environmentVariables.DNUM_SFTP_USERNAME,
    });

    this.logger.info("[VIGIE_RH] Connexion au SFTP ouverte.");
  }

  private async listeLesFichiersDuSftp() {
    return await this.clientSftp.list(this.cheminDesFichiersSourcesSurLeSftp, this.extensionDeFichier);
  }

  private async deconnexionDuSftp() {
    await this.clientSftp.end();
    this.logger.info("[VIGIE_RH] Connexion au SFTP fermée.");
  }

  private async telechargeLeFichier(fichierATelecharger: string) {
    await this.clientSftp.fastGet(
      path.join(this.cheminDesFichiersSourcesSurLeSftp, fichierATelecharger),
      path.join(this.repertoireDeDestination, fichierATelecharger),
      {
        chunkSize: 1_000_000,
        concurrency: 2,
      },
    );
    this.logger.info(`[VIGIE_RH] Le fichier ${fichierATelecharger} a été téléchargé.`);
  }

  private trouveLeFichierLePlusRecentPortantLePrefixe(prefixe: string, fichiersSurLeSftp: FileInfo[]) {
    const formatDuNomDeFichier = new RegExp(`^${prefixe}.*\\.parquet$`);
    const fichiersPertinentsTriesParDate = fichiersSurLeSftp.filter((file) => formatDuNomDeFichier.test(file.name)).sort(this.sortByLastDate);

    return fichiersPertinentsTriesParDate[0];
  }

  private sortByLastDate(a: FileInfo, b: FileInfo) {
    const valueA = a.name;
    const valueB = b.name;
    if (valueA < valueB) return 1;
    else if (valueA > valueB) return -1;
    else return 0;

  }
}
