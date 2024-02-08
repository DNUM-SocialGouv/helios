import csvParser from "csv-parser";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

// import { createReclamationEndpoint } from "../../../backend/infrastructure/controllers/createReclamationEndpoint";
// import { dependencies } from "../../../backend/infrastructure/dependencies";
import { containsCommaOrDotNumbers } from "../utils/containsCommaOrDotNumbers";
import { containsNegativeNumbers } from "../utils/containsNegativeNumbers";
import { isValidFinessRpps } from "../utils/isValidFinessRpps";
import { isValidYear } from "../utils/isValidYear";

interface iRow {
  IDENTIFIANT: string;
  NDEG_FINESS_RPPS: string;
  ANNEE_DE_RECEPTION: string;
  ENCOURS_NB_RECLA_TOTAL: string;
  ENCOURS_NB_RECLA_MOTIF_10: string;
  ENCOURS_NB_RECLA_MOTIF_11: string;
  ENCOURS_NB_RECLA_MOTIF_12: string;
  ENCOURS_NB_RECLA_MOTIF_13: string;
  ENCOURS_NB_RECLA_MOTIF_14: string;
  ENCOURS_NB_RECLA_MOTIF_15: string;
  ENCOURS_NB_RECLA_MOTIF_16: string;
  ENCOURS_NB_RECLA_MOTIF_17: string;
  ENCOURS_NB_RECLA_MOTIF_18: string;
  ENCOURS_NB_RECLA_MOTIF_19: string;
  ENCOURS_NB_RECLA_MOTIF_155: string;
  ENCOURS_NB_RECLA_MOTIF_156: string;
  CLOT_NB_RECLA_TOTAL: string;
  CLOT_NB_RECLA_MOTIF_10: string;
  CLOT_NB_RECLA_MOTIF_11: string;
  CLOT_NB_RECLA_MOTIF_12: string;
  CLOT_NB_RECLA_MOTIF_13: string;
  CLOT_NB_RECLA_MOTIF_14: string;
  CLOT_NB_RECLA_MOTIF_15: string;
  CLOT_NB_RECLA_MOTIF_16: string;
  CLOT_NB_RECLA_MOTIF_17: string;
  CLOT_NB_RECLA_MOTIF_18: string;
  CLOT_NB_RECLA_MOTIF_19: string;
  CLOT_NB_RECLA_MOTIF_155: string;
  CLOT_NB_RECLA_MOTIF_156: string;

  // Signature d'index
  [key: string]: string;
}

// Tableau des noms de colonnes prédéfinis
const predefinedColumnNames = [
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
const motifs = [
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

// Fonction pour calculer la somme des colonnes spécifiées
function calculerSommeEnCours(row: iRow) {
  const colonnes = [
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
  ];
  let somme = 0;
  colonnes.forEach((colonne) => {
    somme += parseInt(row[colonne]) || 0;
  });
  return somme;
}

// Fonction pour vérifier si ENCOURS_NB_RECLA_TOTAL est égal à la somme
function verifierSommeEnCoursEgaleTotal(row: iRow) {
  const total = parseInt(row["ENCOURS_NB_RECLA_TOTAL"]) || 0;
  const somme = calculerSommeEnCours(row);
  return total === somme;
}

// Fonction pour calculer la somme des colonnes spécifiées
function calculerSommeClot(row: iRow) {
  const colonnes = [
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
  let somme = 0;
  colonnes.forEach((colonne) => {
    somme += parseInt(row[colonne]) || 0;
  });
  return somme;
}

// Fonction pour vérifier si Clot_NB_RECLA_TOTAL est égal à la somme
function verifierSommeClotEgaleTotal(row: iRow) {
  const total = parseInt(row["CLOT_NB_RECLA_TOTAL"]) || 0;
  const somme = calculerSommeClot(row);
  return total === somme;
}

function verifValeursManquantes(row: iRow) {
  if (
    (parseInt(row["ENCOURS_NB_RECLA_TOTAL"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_10"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_11"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_12"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_13"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_14"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_15"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_16"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_17"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_18"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_19"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_155"]) ||
      parseInt(row["ENCOURS_NB_RECLA_MOTIF_156"])) &&
    (parseInt(row["CLOT_NB_RECLA_TOTAL"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_10"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_11"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_12"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_13"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_14"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_15"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_16"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_17"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_18"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_19"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_155"]) ||
      parseInt(row["CLOT_NB_RECLA_MOTIF_156"]))
  ) {
    return false;
  }
  return true;
}

/*
interface MotifDetail {
  motif: string;
  clot: number;
  encours: number;
}

interface YearData {
  totalClotures: number;
  totalEncours: number;
  dateMiseAJourSource: string;
  details: MotifDetail[];
}*/

/*function transformDataUniqueObject(data: iRow[]): iRow[] {
  const uniqueObjects = Object.values(
    data.reduce((acc, obj) => {
      // eslint-disable-next-line
      acc[obj.IDENTIFIANT] = obj;
      return acc;
    }, {})
  );

  return uniqueObjects as iRow[];
}*/

/*function transformData(data: iRow[]) {
  //const data = transformDataUniqueObject(dataInput);

  /* eslint-disable no-console * /
  console.log(data.length);

  const result: Record<number, YearData> = {};

  data.forEach((row) => {
    const year: number = parseInt(row.ANNEE_DE_RECEPTION);
    if (!result[year]) {
      result[year] = {
        totalClotures: 0,
        totalEncours: 0,
        dateMiseAJourSource: "20/10/" + year,
        details: Array(12)
          .fill({ motif: "", clot: 0, encours: 0 })
          .map((_, i) => ({
            motif: `MOTIF_${i + 10}`,
            clot: 0,
            encours: 0,
          })),
      };
    }

    // Mettre à jour les totaux
    const totalClotures: number = parseInt(row.CLOT_NB_RECLA_TOTAL);
    const totalEncours: number = parseInt(row.ENCOURS_NB_RECLA_TOTAL);

    result[year].totalClotures += totalClotures;
    result[year].totalEncours += totalEncours;

    // Mettre à jour les détails des motifs
    for (let i = 10; i <= 19; i++) {
      const motifKey: string = `ENCOURS_NB_RECLA_MOTIF_${i}`;
      const clotKey: string = `CLOT_NB_RECLA_MOTIF_${i}`;
      // const motif: string = `MOTIF_${i}`;
      const clot: number = parseInt(row[clotKey]);
      const encours: number = parseInt(row[motifKey]);
      result[year].details[i - 10].clot += clot;
      result[year].details[i - 10].encours += encours;
    }

    // Mettre à jour les détails pour les motifs 155 et 156
    const clot155: number = parseInt(row["CLOT_NB_RECLA_MOTIF_155"]);
    const encours155: number = parseInt(row["ENCOURS_NB_RECLA_MOTIF_155"]);
    result[year].details[10].clot += clot155;
    result[year].details[10].encours += encours155;

    const clot156: number = parseInt(row["CLOT_NB_RECLA_MOTIF_156"]);
    const encours156: number = parseInt(row["ENCOURS_NB_RECLA_MOTIF_156"]);
    result[year].details[11].clot += clot156;
    result[year].details[11].encours += encours156;
  });

  return result;
}*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // const { filePath } = req.query;
    //const filePath = __dirname + "/../../../../../SIREC/sirec_202401231233_mini.csv";
    const filePath = __dirname + "/../../../../../SIREC/sirec_202401231233.csv";

    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({ error: "Invalid file path" });
    }

    const jsonData: any[] = [];

    try {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ";" })) // Spécifier le délimiteur
        .on("data", async (row) => {
          // Vérification des noms de colonnes
          const rowKeys = Object.keys(row);
          const isValidColumnNames = predefinedColumnNames.every((key) => rowKeys.includes(key));
          if (!isValidColumnNames) {
            return; // Ignorer la ligne
          }

          // Vérifier les dates qu’on a (priorité sur les 3 dernières années, 2021 à 2023 + l’année en cours)
          const year1 = parseInt(row["ANNEE_DE_RECEPTION"]);
          if (!isValidYear(year1)) {
            return; // Ignorer la ligne
          }

          // Vérifier si on a des données pour chaque motif (au moins les colonnes existent avec des valeurs null)
          motifs.forEach((motif) => {
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

          /***************************************************** */

          // Process each row and push it to jsonData array
          jsonData.push(row);
          /*
          const rowDB = {
            id_reclamation: row.IDENTIFIANT,
            ndeg_finess_rpps: row.NDEG_FINESS_RPPS,
            annee_de_reception: parseInt(row.ANNEE_DE_RECEPTION),
            encours_total: parseInt(row.ENCOURS_NB_RECLA_TOTAL) || 0,
            encours_motif_10: parseInt(row.ENCOURS_NB_RECLA_MOTIF_10) || 0,
            encours_motif_11: parseInt(row.ENCOURS_NB_RECLA_MOTIF_11) || 0,
            encours_motif_12: parseInt(row.ENCOURS_NB_RECLA_MOTIF_12) || 0,
            encours_motif_13: parseInt(row.ENCOURS_NB_RECLA_MOTIF_13) || 0,
            encours_motif_14: parseInt(row.ENCOURS_NB_RECLA_MOTIF_14) || 0,
            encours_motif_15: parseInt(row.ENCOURS_NB_RECLA_MOTIF_15) || 0,
            encours_motif_16: parseInt(row.ENCOURS_NB_RECLA_MOTIF_16) || 0,
            encours_motif_17: parseInt(row.ENCOURS_NB_RECLA_MOTIF_17) || 0,
            encours_motif_18: parseInt(row.ENCOURS_NB_RECLA_MOTIF_18) || 0,
            encours_motif_19: parseInt(row.ENCOURS_NB_RECLA_MOTIF_19) || 0,
            encours_motif_155: parseInt(row.ENCOURS_NB_RECLA_MOTIF_155) || 0,
            encours_motif_156: parseInt(row.ENCOURS_NB_RECLA_MOTIF_156) || 0,
            clot_total: parseInt(row.CLOT_NB_RECLA_TOTAL) || 0,
            clot_motif_10: parseInt(row.CLOT_NB_RECLA_MOTIF_10) || 0,
            clot_motif_11: parseInt(row.CLOT_NB_RECLA_MOTIF_11) || 0,
            clot_motif_12: parseInt(row.CLOT_NB_RECLA_MOTIF_12) || 0,
            clot_motif_13: parseInt(row.CLOT_NB_RECLA_MOTIF_13) || 0,
            clot_motif_14: parseInt(row.CLOT_NB_RECLA_MOTIF_14) || 0,
            clot_motif_15: parseInt(row.CLOT_NB_RECLA_MOTIF_15) || 0,
            clot_motif_16: parseInt(row.CLOT_NB_RECLA_MOTIF_16) || 0,
            clot_motif_17: parseInt(row.CLOT_NB_RECLA_MOTIF_17) || 0,
            clot_motif_18: parseInt(row.CLOT_NB_RECLA_MOTIF_18) || 0,
            clot_motif_19: parseInt(row.CLOT_NB_RECLA_MOTIF_19) || 0,
            clot_motif_155: parseInt(row.CLOT_NB_RECLA_MOTIF_155) || 0,
            clot_motif_156: parseInt(row.CLOT_NB_RECLA_MOTIF_156) || 0,
          };

          await createReclamationEndpoint(dependencies, rowDB);*/
        })
        .on("end", () => {
          // Send the JSON response containing data
          // Convertir les données en JSON selon le format requis
          // res.status(200).json(transformData(jsonData));

          /* eslint-disable no-console */
          console.log(jsonData.length);

          res.status(200).json(jsonData);
        });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
