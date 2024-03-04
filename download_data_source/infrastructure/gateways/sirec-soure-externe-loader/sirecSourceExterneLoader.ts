import csvParser from "csv-parser";
import fs, { readdirSync } from "fs";
import Papa from 'papaparse';

import { ControleDonneesSirecLoader } from "../../../métier/gateways/ControleDonnesSirecLoader";
import { Logger } from "../../../métier/gateways/Logger";
import { containsCommaOrDotNumbers, containsNegativeNumbers, isValidFinessRpps, isValidYear, verifValeursManquantes, verifierSommeEnCoursEgaleTotal, verifierSommeClotEgaleTotal } from "../../utils/sirecSourceExternalLoaderUtils";


export class SirecSourceExterneLoader implements ControleDonneesSirecLoader {
    private readonly prefixeDuFichierSirec = "sirec_";

    // Tableau des noms de colonnes prédéfinis
    private readonly predefinedColumnNames = [
        "IDENTIFIANT",
        "NDEG_FINESS_RPPS",
        "ANNEE_DE_RECEPTION",
        "ENCOURS_NB_RECLA_TOTAL",
        "ENCOURS_NB_RECLA_MOTIF_10",
        "ENCOURS_NB_RECLA_MOTIF_11",
        "ENCOURS_NB_RECLA_MOTIF_12",
        "ENCOURS_NB_RECLA_MOTIF_13",
        "ENCOURS_NB_RECLA_MOTIF_14",
        "ENCOURS_NB_RECLA_MOTIF_15",
        "ENCOURS_NB_RECLA_MOTIF_16",
        "ENCOURS_NB_RECLA_MOTIF_17",
        "ENCOURS_NB_RECLA_MOTIF_18",
        "ENCOURS_NB_RECLA_MOTIF_19",
        "ENCOURS_NB_RECLA_MOTIF_155",
        "ENCOURS_NB_RECLA_MOTIF_156",
        "CLOT_NB_RECLA_TOTAL",
        "CLOT_NB_RECLA_MOTIF_10",
        "CLOT_NB_RECLA_MOTIF_11",
        "CLOT_NB_RECLA_MOTIF_12",
        "CLOT_NB_RECLA_MOTIF_13",
        "CLOT_NB_RECLA_MOTIF_14",
        "CLOT_NB_RECLA_MOTIF_15",
        "CLOT_NB_RECLA_MOTIF_16",
        "CLOT_NB_RECLA_MOTIF_17",
        "CLOT_NB_RECLA_MOTIF_18",
        "CLOT_NB_RECLA_MOTIF_19",
        "CLOT_NB_RECLA_MOTIF_155",
        "CLOT_NB_RECLA_MOTIF_156",
    ];

    // Tableau des motifs
    private readonly motifs = [
        "ENCOURS_NB_RECLA_MOTIF_10",
        "ENCOURS_NB_RECLA_MOTIF_11",
        "ENCOURS_NB_RECLA_MOTIF_12",
        "ENCOURS_NB_RECLA_MOTIF_13",
        "ENCOURS_NB_RECLA_MOTIF_14",
        "ENCOURS_NB_RECLA_MOTIF_15",
        "ENCOURS_NB_RECLA_MOTIF_16",
        "ENCOURS_NB_RECLA_MOTIF_17",
        "ENCOURS_NB_RECLA_MOTIF_18",
        "ENCOURS_NB_RECLA_MOTIF_19",
        "ENCOURS_NB_RECLA_MOTIF_155",
        "ENCOURS_NB_RECLA_MOTIF_156",
        "CLOT_NB_RECLA_MOTIF_10",
        "CLOT_NB_RECLA_MOTIF_11",
        "CLOT_NB_RECLA_MOTIF_12",
        "CLOT_NB_RECLA_MOTIF_13",
        "CLOT_NB_RECLA_MOTIF_14",
        "CLOT_NB_RECLA_MOTIF_15",
        "CLOT_NB_RECLA_MOTIF_16",
        "CLOT_NB_RECLA_MOTIF_17",
        "CLOT_NB_RECLA_MOTIF_18",
        "CLOT_NB_RECLA_MOTIF_19",
        "CLOT_NB_RECLA_MOTIF_155",
        "CLOT_NB_RECLA_MOTIF_156",
    ];


    constructor(private readonly localPath: string, private readonly destinationPath: string, private logger: Logger) { }

    async checkDowloadedSirecFile(): Promise<void> {
        const cheminDuFichierSirec = this.recupereLeCheminDuFichierSirec(this.localPath);
        const cheminDuFichierSirecTaite = this.creerLeCheminDuFichierSirecTraite(this.localPath, this.destinationPath);

        const jsonData: any[] = [];
        try {
            const readStream = fs.createReadStream(cheminDuFichierSirec)
                .pipe(csvParser({ separator: ";" }));
            // Spécifier le délimiteur
            readStream.on("data", async (row) => {
                const rowKeys = Object.keys(row);
                const isValidColumnNames = this.predefinedColumnNames.every((key) => rowKeys.includes(key));
                if (!isValidColumnNames) {
                    return; // Ignorer la ligne
                }

                // Vérifier les dates qu’on a (priorité sur les 3 dernières années, 2021 à 2023 + l’année en cours)
                const year1 = parseInt(row["ANNEE_DE_RECEPTION"]);
                if (!isValidYear(year1)) {
                    return; // Ignorer la ligne
                }

                // Vérifier si on a des données pour chaque motif (au moins les colonnes existent avec des valeurs null)
                this.motifs.forEach((motif) => {
                    if (!row.hasOwnProperty(motif)) {
                        return; // Ignorer la ligne
                    }
                });

                // Vérifier que toutes les lignes concerne des numéros FINESS à 9 chiffres
                const finessRpps = row["NDEG_FINESS_RPPS"];
                if (!isValidFinessRpps(finessRpps)) {
                    return; // Ignorer la ligne
                }

                // Vérification si la ligne ne contient pas de valeur 0
                const values = Object.values(row);
                if (values.some((value) => value === "0")) {
                    return; // Ignorer la ligne
                }

                // Vérification si la ligne contient des valeurs numériques avec des virgules
                if (containsCommaOrDotNumbers(row)) {
                    return; // Ignorer la ligne
                }

                // Vérification si la ligne contient des valeurs négatives
                if (containsNegativeNumbers(row)) {
                    return; // Ignorer la ligne
                }

                // Vérifier qu’on récupère les totaux (en cours, clôturés et par motif). Attention, une réclamation peut avoir plusieurs motifs.
                if (parseInt(row["ENCOURS_NB_RECLA_TOTAL"]) > 0 && parseInt(row["CLOT_NB_RECLA_TOTAL"]) > 0) {
                    return; // Ignorer la ligne
                }

                // Valeurs manquantes (ex : pas de “en_cours” alors qu’il y a la ligne “cloturés”). Valeurs à vérifier par motifs.
                if (!verifValeursManquantes(row)) {
                    return; // Ignorer la ligne
                }

                // Vérifier que la somme des réclamations totales correspond bien  à la sommes des réclamations en cours et clôturées.
                if (!verifierSommeEnCoursEgaleTotal(row)) {
                    return; // Ignorer la ligne
                }
                if (!verifierSommeClotEgaleTotal(row)) {
                    return; // Ignorer la ligne
                }
                jsonData.push(row);
            })

            readStream.on("end", () => {
                const filteredCsv = Papa.unparse(jsonData);
                fs.writeFile(cheminDuFichierSirecTaite, filteredCsv, err => {
                    if (err) {
                        // eslint-disable-next-line no-console
                        console.log('err', err);
                    }
                });
            })

        } catch (error) {
            this.logger.error("une erreur au moment de l'exploration des données sirec")
        }
    }

    private recupereLeCheminDuFichierSirec(localPath: string): string {
        return localPath + '/' + this.recupereFichierSirec(localPath);
    }

    private recupereFichierSirec(localPath: string): string {
        const fichiersDuRépertoireSimple = readdirSync(`${localPath}`);
        const fichiersDuRépertoireSimpleTrie = fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.prefixeDuFichierSirec)).sort(this.sortByLastDate);
        return fichiersDuRépertoireSimpleTrie[0];
    }

    private creerLeCheminDuFichierSirecTraite(localPath: string, destinationPath: string): string {
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath);
        }
        return destinationPath + '/' + this.recupereFichierSirec(localPath);
    }

    private sortByLastDate(valueA: string, valueB: string) {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
}