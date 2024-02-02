import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import csvParser from "csv-parser";

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

// Fonction pour vérifier si une année est valide (l'année en cours ou les 3 dernières années)
function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= currentYear - 3 && year <= currentYear;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // const { filePath } = req.query;
    const filePath = __dirname + "/../../../../../SIREC/sirec_202401231233_mini.csv";
    // res.status(200).json({ data: filePath });

    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({ error: "Invalid file path" });
    }

    const jsonData: any[] = [];

    try {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          //---------------------------------------------------
          // Vérification des noms de colonnes
          const rowKeys = Object.keys(row);
          const realRowKeys = rowKeys.toString().split(`";"`);
          const isValidColumnNames = realRowKeys.every((key) => predefinedColumnNames.includes(key));

          if (!isValidColumnNames) {
            return res.status(400).json({ error: "Invalid column names" });
          }

          //---------------------------------------------------
          // Vérifier les dates qu’on a (priorité sur les 3 dernières années, 2021 à 2023 + l’année en cours)
          if (row.hasOwnProperty("ANNEE_DE_RECEPTION")) {
            const year = parseInt(row["ANNEE_DE_RECEPTION"]);
            if (!isValidYear(year)) {
              return res.status(400).json({ error: "Invalid year value for ANNEE_DE_RECEPTION" });
            }
          } else {
            return res.status(400).json({ error: "ANNEE_DE_RECEPTION column not found" });
          }

          // Process each row and push it to jsonData array
          jsonData.push(row);
        })
        .on("end", () => {
          // Send the JSON response containing data
          res.status(200).json(jsonData);
        });
    } catch (error) {
      console.error("Error reading CSV file:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
