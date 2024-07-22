import { mkdirSync, rmSync } from "fs";
import { FileInfo } from "ssh2-sftp-client";

import { DownloadRawData } from "../../../métier/gateways/DownloadRawData";
import { EnvironmentVariables } from "../../../métier/gateways/EnvironmentVariables";
import { Logger } from "../../../métier/gateways/Logger";
import { HeliosError } from "../../HeliosError";
import { ClientSftp } from "./ClientSftp";

export class HapiSftpDownloadRawData implements DownloadRawData {

    constructor(
        private readonly clientSftp: ClientSftp,
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
            this.logger.info(`[HAPI] les fichiers à téléchargés ${fichiersATelecharger}`);
        } catch (erreur) {
            throw new HeliosError(`[HAPI] Une erreur est survenue lors de la connexion au SFTP : ${erreur.message}`);
        }
    }

    private async listeLesFichiersDuSftp() {
        return await this.clientSftp.list(this.cheminDesFichiersSourcesSurLeSftp);
    }

    private recréeLeRépertoireDeDestination() {
        rmSync(this.répertoireDeDestination, { force: true, recursive: true });
        mkdirSync(this.répertoireDeDestination, { recursive: true });
    }

    private async connexionAuSftp() {
        await this.clientSftp.connect({
            host: this.environmentVariables.HAPI_SFTP_HOST,
            port: Number(this.environmentVariables.HAPI_SFTP_PORT),
            username: this.environmentVariables.HAPI_SFTP_USERNAME,
            password: this.environmentVariables.HAPI_SFTP_PASSWORD
        });

        this.logger.info("[Hapi] La connexion au SFTP est ouverte.");
    }

    private trouveLesFichiersDe5DernieresAnneesPortantLePrefixe(prefixeDesFichiersATelecharger: string, fichiersSurLeSftp: FileInfo[]) {
        const formatDuNomDeFichier = new RegExp(`^${prefixeDesFichiersATelecharger}_\\d{4}_\\d{14}`);
        const fichiersPertinents = fichiersSurLeSftp.filter((file: FileInfo) => formatDuNomDeFichier.test(file.name));
        this.logger.info(`[HAPI] ${fichiersPertinents.length}  fichiers HAPI ont été trouvés.`);
        return fichiersPertinents;
    }

}
