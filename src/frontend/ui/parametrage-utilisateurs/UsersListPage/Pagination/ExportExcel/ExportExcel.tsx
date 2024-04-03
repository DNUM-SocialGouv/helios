import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback } from "react";
import * as XLSX from "xlsx";

import { ProfilModel } from "../../../../../../../database/models/ProfilModel";
import { UtilisateurModel } from "../../../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../../../utils/dateUtils";
import { getUserStatus } from "../../UsersListPage";
import styles from "./ExportExcel.module.css";

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

function transformData(users: UtilisateurModel[], profiles: ProfilModel[]): (string | Number)[][] {
  if (users) {
    return users.map((user) => transformDataRow(user, profiles));
  }
  return [];
}

export function ExportToExcel(headerRecherche: string[], headers: string[], data: (string | Number)[][]) {
  const ws = XLSX.utils.aoa_to_sheet([headerRecherche, [""], headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "export.xls");
}

interface IExportExcel {
  getQueryParams: () => any;
  profiles: ProfilModel[];
}

const ExportExcel = ({ getQueryParams, profiles }: IExportExcel) => {
  async function getUsersData(params: string | string[][] | Record<string, string> | URLSearchParams | undefined) {
    const response = await fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    return await response.json();
  }

  const generateAndExportExcel = useCallback(async () => {
    const params = getQueryParams();
    params.itemsPerPage = "10000";
    const users = await getUsersData(params);
    const dataTransormed = transformData(users.data, profiles);

    const headerRecherche = ["Recherche : sss"];
    const headers = ["Nom", "Prénom", "Email", "Institution", "Rôle", "Autorisation", "Date de création", "Date de dernière connexion", "Statut"];
    ExportToExcel(headerRecherche, headers, dataTransormed);
  }, []);

  return (
    <button
      aria-hidden="true"
      className={`fr-btn ${styles["export-excel"]} fr-icon-download-line`}
      onClick={() => generateAndExportExcel()}
      title="Exporter vers Excel"
    ></button>
  );
};

export default memo(ExportExcel);
