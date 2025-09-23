import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { Workbook } from "exceljs";
import { memo } from "react";

import styles from "./ExportExcel.module.css";
import { InstitutionModel } from "../../../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../../../utils/dateUtils";
import { ecrireLignesDansSheet, telechargerWorkbook } from "../../../../../utils/excelUtils";
import { IQueryParams, getUserStatus } from "../../UsersListPage";


export function getCurrentDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const currentDate = `${year}${month}${day}`;

  return currentDate;
}

function generateProfilsString(user: UtilisateurModel, profiles: ProfilModel[]) {
  return user.profils
    .filter(function (item) {
      if (item.includes("{")) {
        return false; // skip
      }
      return true;
    })
    .map((profil, i, { length }) => {
      const pr = profiles.filter((item) => item.code === profil);
      let separator = ", ";
      // last element
      if (i + 1 === length) {
        separator = "";
      }
      return pr && pr[0] ? `${pr[0].label}${separator}` : "";
    })
    .join("");
}

function transformDataRow(user: UtilisateurModel, profiles: ProfilModel[]) {
  return [
    user.nom,
    user.prenom,
    user.email,
    user.institution.libelle,
    user.role.libelle,
    generateProfilsString(user, profiles),
    user?.lastConnectionDate && formatDateAndHours(user?.dateCreation?.toString()),
    user?.lastConnectionDate && formatDateAndHours(user?.lastConnectionDate?.toString()),
    getUserStatus(user.lastConnectionDate),
  ];
}

function transformData(users: UtilisateurModel[], profiles: ProfilModel[]): (string | number)[][] {
  if (users) {
    return users.map((user) => transformDataRow(user, profiles));
  }
  return [];
}

export async function ExportToExcel(headerRecherche: string[], headers: string[], data: (string | number)[][], fileName: string) {
  const lignes: (string | number)[][] = [headerRecherche, [""], headers, ...data];
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("liste des utilisateurs");
  ecrireLignesDansSheet(lignes, sheet);
  return telechargerWorkbook(workbook, fileName);
}

async function getUsersData(params: any) {
  const response = await fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });
  return await response.json();
}

export function getSelectedProfile(id: string, profiles: ProfilModel[]) {
  const resultFilter = profiles.filter((obj) => obj["code"] === id);

  if (resultFilter.length > 0) {
    return ` : ${resultFilter[0].label}`;
  }

  return "";
}

export function getSelectedRole(id: number | string, roles: RoleModel[]) {
  const resultFilter = roles.filter((obj) => obj["id"] === Number(id));

  if (resultFilter.length > 0) {
    return ` : ${resultFilter[0].libelle}`;
  }

  return "";
}

export function getSelectedInstitution(id: number | string, institutions: InstitutionModel[]) {
  const resultFilter = institutions.filter((obj) => obj["id"] === Number(id));

  if (resultFilter.length > 0) {
    return ` : ${resultFilter[0].libelle}`;
  }

  return "";
}

function getSelectedStaus(etatId: string) {
  if (etatId && etatId.length > 0) {
    return ` : ${etatId.charAt(0).toUpperCase() + etatId.slice(1)}`;
  }

  return "";
}

async function generateAndExportExcel(
  filterParams: IQueryParams,
  profiles: ProfilModel[],
  institutions: InstitutionModel[],
  institutionSessionCode: number,
  roles: RoleModel[]
) {
  filterParams.page = 1;
  filterParams.itemsPerPage = "10000";
  if (institutionSessionCode > 0) {
    filterParams.institutionId = institutionSessionCode;
  }
  const users = await getUsersData(filterParams);
  const dataTransormed = transformData(users.data, profiles);

  const headerRecherche = [`Recherche : ${filterParams.key && filterParams.key.length > 0 ? filterParams.key : ""}`];
  const headers = [
    "Nom",
    "Prénom",
    "Email",
    `Institution${getSelectedInstitution(filterParams.institutionId || "", institutions)}`,
    `Rôle${getSelectedRole(filterParams.roleId || 0, roles)}`,
    `Autorisation${getSelectedProfile(filterParams.profileId || "", profiles)}`,
    "Date de création",
    "Date de dernière connexion",
    `Statut${getSelectedStaus(filterParams.etatId || "")}`,
  ];
  ExportToExcel(headerRecherche, headers, dataTransormed, `${getCurrentDate()}_Helios_liste_utilisateurs.xlsx`);
}

interface IExportExcel {
  filterParams: IQueryParams;
  profiles: ProfilModel[];
  institutions: InstitutionModel[];
  institutionSessionCode: number;
  roles: RoleModel[];
}

const ExportExcel = ({ filterParams, profiles, institutions, institutionSessionCode, roles }: IExportExcel) => {
  return (
    <button
    className={`fr-btn fr-btn--secondary fr-fi-download-line fr-btn--icon-left  ${styles["export-excel"]}`}
    name="Exporter"
    onClick={() => generateAndExportExcel(filterParams, profiles, institutions, institutionSessionCode, roles)}
    title="Exporter"
    type="button"
  >
    Exporter
  </button>
  );
};

export default memo(ExportExcel);
