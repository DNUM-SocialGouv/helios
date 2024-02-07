import csvParser from "csv-parser";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // const { filePath } = req.query;
    const filePath = __dirname + "/../../../../../SIREC/sirec_202401231233_mini.csv";

    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({ error: "Invalid file path" });
    }

    const jsonData: any[] = [];

    try {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ";" })) // Spécifier le délimiteur
        .on("data", (row) => {
          // Vérification des noms de colonnes
          const rowKeys = Object.keys(row);
          const isValidColumnNames = predefinedColumnNames.every((key) => rowKeys.includes(key));
          if (!isValidColumnNames) {
            return; // Ignorer la ligne
          }

          // Vérifier les dates qu’on a (priorité sur les 3 dernières années, 2021 à 2023 + l’année en cours)
          const year = parseInt(row["ANNEE_DE_RECEPTION"]);
          if (!isValidYear(year)) {
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

          // Process each row and push it to jsonData array
          jsonData.push(row);
        })
        .on("end", () => {
          // Send the JSON response containing data
          res.status(200).json(jsonData);
        });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
