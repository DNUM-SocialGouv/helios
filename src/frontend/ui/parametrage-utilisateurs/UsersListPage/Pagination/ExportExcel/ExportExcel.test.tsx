import fs from "fs";
import XLSX from "xlsx";

import { ExportToExcel } from "./ExportExcel";

describe("ExportToExcel function", () => {
  it("should generate an Excel file with provided headers and data", () => {
    // Données de test
    const headers = ["Nom", "Prénom", "Email", "Institution", "Rôle", "Autorisation", "Date de création", "Date de dernière connexion", "Statut"];
    const data = [
      ["Doe", "John", "john.doe@example.com", "Institution A", "Role A", "Profil 1, Profil 2", "date1", "date2", "statut"],
      // Ajoutez plus de données au besoin
    ];

    // Appel de la fonction ExportToExcel avec les données de test
    ExportToExcel(headers, data);

    // Vérification si le fichier Excel a été correctement créé
    expect(fs.existsSync("export.xls")).toBeTruthy();

    // Lecture du fichier Excel
    const workbook = XLSX.readFile("export.xls");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataFromExcel = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Vérification des données dans le fichier Excel
    expect(dataFromExcel).toEqual([headers, ...data]);
  });
});
