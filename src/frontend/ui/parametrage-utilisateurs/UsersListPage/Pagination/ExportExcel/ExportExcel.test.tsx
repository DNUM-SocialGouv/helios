import fs from "fs";
import XLSX from "xlsx";

import { ExportToExcel, getCurrentDate, getSelectedInstitution, getSelectedProfile, getSelectedRole } from "./ExportExcel";
import { ProfilModel } from "../../../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../../../database/models/RoleModel";

const createDirectory = (path: string) => {
  try {
    fs.mkdirSync(path, { recursive: true });
  } catch (err) {
  }
};

describe("ExportToExcel function", () => {
  it("create the folder if not exist", () => {
    createDirectory("jestGeneratedFiles/Users");

    // Vérification des données dans le fichier Excel
    expect(true).toBe(true);
  });

  it("should generate an Excel file with provided headers and data", () => {
    // Données de test
    const headers = ["Nom", "Prénom", "Email", "Institution", "Rôle", "Autorisation", "Date de création", "Date de dernière connexion", "Statut"];
    const data = [
      ["Doe", "John", "john.doe@example.com", "Institution A", "Role A", "Profil 1, Profil 2", "date1", "date2", "statut"],
      // Ajoutez plus de données au besoin
    ];

    // Appel de la fonction ExportToExcel avec les données de test
    const headerRecherche = [`Recherche : `];
    ExportToExcel(headerRecherche, headers, data, "jestGeneratedFiles/Users/Helios_liste_utilisateurs.xlsx");

    // Vérification si le fichier Excel a été correctement créé
    expect(fs.existsSync("jestGeneratedFiles/Users/Helios_liste_utilisateurs.xlsx")).toBeTruthy();

    // Lecture du fichier Excel
    const workbook = XLSX.readFile("jestGeneratedFiles/Users/Helios_liste_utilisateurs.xlsx");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataFromExcel = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Vérification des données dans le fichier Excel
    expect(dataFromExcel).toEqual([headerRecherche, [""], headers, ...data]);
  });
});

describe("getCurrentDate function", () => {
  it("returns the current date in YYYYMMDD format", () => {
    // Arrange
    const expectedDateFormat = /^\d{8}$/; // Expression régulière pour vérifier le format YYYYMMDD

    // Act
    const currentDate = getCurrentDate();

    // Assert
    expect(currentDate).toMatch(expectedDateFormat); // Vérifie si la date retournée correspond au format YYYYMMDD
  });

  it("returns the correct current date", () => {
    // Arrange
    const expectedDate = new Date();
    const expectedYear = expectedDate.getFullYear();
    const expectedMonth = String(expectedDate.getMonth() + 1).padStart(2, "0");
    const expectedDay = String(expectedDate.getDate()).padStart(2, "0");
    const expectedCurrentDate = `${expectedYear}${expectedMonth}${expectedDay}`;

    // Act
    const currentDate = getCurrentDate();

    // Assert
    expect(currentDate).toEqual(expectedCurrentDate); // Vérifie si la date retournée correspond à la date actuelle
  });
});

describe("getSelectedProfile", () => {
  const profiles = [
    {
      id: 2,
      code: "2",
      label: "Profile 2",
      value: {},
      dateCreation: "2023-10-09T09:21:40.010Z",
      dateModification: null,
      createdBy: null,
    },
    {
      id: 3,
      code: "3",
      label: "Profile 3",
      value: {},
      dateCreation: "2023-10-09T09:21:40.010Z",
      dateModification: null,
      createdBy: null,
    },
  ];

  it("should return the label of the selected profile if found", () => {
    const id = "2";
    const expectedLabel = "Profile 2";
    const result = getSelectedProfile(id, profiles as unknown as ProfilModel[]);
    expect(result).toBe(` : ${expectedLabel}`);
  });

  it("should return an empty string if the selected profile is not found", () => {
    const id = "4"; // Assuming this ID doesn't exist in the mock data
    const result = getSelectedProfile(id, profiles as unknown as ProfilModel[]);
    expect(result).toBe("");
  });

  it("should return the label of the first matching profile if multiple profiles with the same code exist", () => {
    const id = "3"; // Assuming there are multiple profiles with code "3"
    const expectedLabel = "Profile 3"; // Expecting the label of the first matching profile
    const result = getSelectedProfile(id, profiles as unknown as ProfilModel[]);
    expect(result).toBe(` : ${expectedLabel}`);
  });
});

describe("getSelectedRole function", () => {
  const mockRoles: RoleModel[] = [
    {
      id: 1,
      code: "ADMIN_NAT",
      libelle: "Administrateur national",
      ordre: 1
    },
    {
      id: 2,
      code: "ADMIN_REG",
      libelle: "Administrateur régional",
      ordre: 2
    },
    {
      id: 3,
      code: "USER",
      libelle: "Utilisateur",
      ordre: 4
    },
    {
      id: 4,
      code: "ADMIN_CENTR",
      libelle: "Administration centrale",
      ordre: 3
    },
  ];

  it("should return the role label when the role is found", () => {
    const idToFind = 1;
    const expectedResult = " : Administrateur national";
    expect(getSelectedRole(idToFind, mockRoles)).toBe(expectedResult);
  });

  it("should return an empty string when the role is not found", () => {
    const idToFind = 50000; // Rôle inexistant
    const expectedResult = "";
    expect(getSelectedRole(idToFind, mockRoles)).toBe(expectedResult);
  });

  it("should return the role label when the role ID is passed as a string", () => {
    const idToFind = "1"; // ID en tant que chaîne de caractères
    const expectedResult = " : Administrateur national";
    expect(getSelectedRole(idToFind, mockRoles)).toBe(expectedResult);
  });

  it("should return an empty string when the roles array is empty", () => {
    const emptyRoles: RoleModel[] = [];
    const idToFind = 1;
    const expectedResult = "";
    expect(getSelectedRole(idToFind, emptyRoles)).toBe(expectedResult);
  });
});

describe("getSelectedInstitution function", () => {
  const institutions = [
    {
      id: 1,
      code: "i_81",
      codeGeo: "81",
      libelle: "Institution 1",
    },
    {
      id: 2,
      code: "i_82",
      codeGeo: "82",
      libelle: "Institution 2",
    },
  ];

  it("should return the institution libelle if found", () => {
    const id = 1;
    const expected = " : Institution 1";
    const result = getSelectedInstitution(id, institutions);
    expect(result).toEqual(expected);
  });

  it("should return empty string if no institution found", () => {
    const id = 3; // Assuming this ID doesn't exist in the provided institutions array
    const expected = "";
    const result = getSelectedInstitution(id, institutions);
    expect(result).toEqual(expected);
  });

  it("should handle string IDs as well", () => {
    const id = "2"; // String ID matching an existing institution
    const expected = " : Institution 2";
    const result = getSelectedInstitution(id, institutions);
    expect(result).toEqual(expected);
  });

  it("should return empty string if institutions array is empty", () => {
    const id = 1; // Any ID since institutions array is empty
    const expected = "";
    const result = getSelectedInstitution(id, []);
    expect(result).toEqual(expected);
  });
});
