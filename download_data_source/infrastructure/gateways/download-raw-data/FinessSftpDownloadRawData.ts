import { mkdirSync, readFileSync, rmSync } from "fs";
import { ConnectConfig } from "ssh2";
import { FileInfo } from "ssh2-sftp-client";

import { ClientSftp } from "./ClientSftp";
import { DownloadRawData } from "../../../métier/gateways/DownloadRawData";
import { EnvironmentVariables } from "../../../métier/gateways/EnvironmentVariables";
import { Logger } from "../../../métier/gateways/Logger";
import { HeliosError } from "../../HeliosError";

export class FinessSftpDownloadRawData implements DownloadRawData {
  simpleSftpPath: string;
  nomenclatureSftpPath: string;
  enrichiSftpPath: string;

  constructor(
    private readonly clientSftp: ClientSftp,
    private readonly sftpPath: string,
    private readonly localPath: string,
    private readonly environmentVariables: EnvironmentVariables,
    private readonly logger: Logger
  ) {
    this.simpleSftpPath = `${this.sftpPath}/simple`;
    this.nomenclatureSftpPath = `${this.sftpPath}/nomenclature`;
    this.enrichiSftpPath = `${this.sftpPath}/enrichi`;
  }

  async exécute() {
    this.removeDirectories();
    this.makeDirectories();

    try {
      await this.connect();
      await this.downloadFichesIdentité();
      await this.downloadCatégories();
      await this.downloadAutorisationsEtCapacités();
      await this.disconnect();
    } catch (error) {
      throw new HeliosError(`[FINESS] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`);
    }
  }

  private removeDirectories() {
    rmSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${this.localPath}`, { force: true, recursive: true });
  }

  private makeDirectories() {
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${this.localPath}/simple`, { recursive: true });
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${this.localPath}/nomenclature`, { recursive: true });
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${this.localPath}/enrichi`, { recursive: true });
  }

  private async connect() {
    const configuration: ConnectConfig = {
      algorithms: { kex: this.environmentVariables.SFTP_KEX_ALGORITHMS.split(",") },
      debug: this.environmentVariables.SFTP_IS_DEBUG === "false" ? undefined : this.logger.debug,
      host: this.environmentVariables.SFTP_HOST,
      port: Number(this.environmentVariables.SFTP_PORT),
      privateKey: readFileSync(this.environmentVariables.SFTP_PRIVATE_KEY),
      username: this.environmentVariables.SFTP_USERNAME,
    };

    await this.clientSftp.connect(configuration);
    this.logger.info("[FINESS] La connexion au SFTP est ouverte.");
  }

  private async downloadFichesIdentité() {
    const fichesIdentitéFiles = await this.clientSftp.list(this.simpleSftpPath, "*.xml.gz");
    const entitéJuridiqueFileName = "finess_cs1400101_stock_";
    const établissementTerritorialFileName = "finess_cs1400102_stock_";

    await this.downloadFile(fichesIdentitéFiles, `${this.localPath}/simple`, this.simpleSftpPath, entitéJuridiqueFileName);

    await this.downloadFile(fichesIdentitéFiles, `${this.localPath}/simple`, this.simpleSftpPath, établissementTerritorialFileName);

    this.logger.info('[FINESS] Les deux fichiers contenant les fiches d’identité du répertoire "simple" téléchargés.');
  }

  private async downloadCatégories() {
    const nomenclatureFiles = await this.clientSftp.list(this.nomenclatureSftpPath, "*.xml.gz");
    const catégoriesFileName = "finess_cs1500106_stock_";
    const statusJuridiquesFileName = "finess_cs1500107_stock_";

    await this.downloadFile(nomenclatureFiles, `${this.localPath}/nomenclature`, this.nomenclatureSftpPath, catégoriesFileName);
    await this.downloadFile(nomenclatureFiles, `${this.localPath}/nomenclature`, this.nomenclatureSftpPath, statusJuridiquesFileName);
    this.logger.info('[FINESS] Les fichiers contenants les catégories et statuts juridique du répertoire "nomenclature" téléchargés.');
  }

  private async downloadAutorisationsEtCapacités() {
    const enrichiFiles = await this.clientSftp.list(this.enrichiSftpPath, "*.xml.gz");
    const autorisationsSanitairesFileName = "finess_cs1400103_stock_";
    const équipementsMatérielsLourdsSanitairesFileName = "finess_cs1400104_stock_";
    const autorisationsMédicoSociauxFileName = "finess_cs1400105_stock_";
    const autresActivitésSanitairesFileName = "finess_cs1600101_stock_";
    const reconnaissancesContractuellesSanitairesFileName = "finess_cs1600102_stock_";
    const autorisationsAMMSanitairesFileName = "amm_arhgos_";

    await this.downloadFile(enrichiFiles, `${this.localPath}/enrichi`, this.enrichiSftpPath, autorisationsSanitairesFileName);

    await this.downloadFile(enrichiFiles, `${this.localPath}/enrichi`, this.enrichiSftpPath, équipementsMatérielsLourdsSanitairesFileName);

    await this.downloadFile(enrichiFiles, `${this.localPath}/enrichi`, this.enrichiSftpPath, autorisationsMédicoSociauxFileName);

    await this.downloadFile(enrichiFiles, `${this.localPath}/enrichi`, this.enrichiSftpPath, autresActivitésSanitairesFileName);

    await this.downloadFile(enrichiFiles, `${this.localPath}/enrichi`, this.enrichiSftpPath, reconnaissancesContractuellesSanitairesFileName);

    await this.downloadFile(enrichiFiles, `${this.localPath}/enrichi`, this.enrichiSftpPath, autorisationsAMMSanitairesFileName);


    this.logger.info('[FINESS] Les 6 fichiers contenant les autorisations du répertoire "enrichi" téléchargés.');
  }

  private async disconnect() {
    this.logger.info("[FINESS] Le connexion au SFTP est fermée.");

    return await this.clientSftp.end();
  }

  private async downloadFile(files: FileInfo[], localPath: string, remotePath: string, fileName: string) {
    const orderedFiles = files.filter((file: FileInfo) => file.name.includes(fileName)).sort(this.sortByLastDate);

    if (orderedFiles.length === 0) return;

    await this.clientSftp.fastGet(
      `${remotePath}/${orderedFiles[0].name}`,
      `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/${orderedFiles[0].name}`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
  }

  private sortByLastDate(a: FileInfo, b: FileInfo) {
    const valueA = a.name;
    const valueB = b.name;

    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
  }
}
