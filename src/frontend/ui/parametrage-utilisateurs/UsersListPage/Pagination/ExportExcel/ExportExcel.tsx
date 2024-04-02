import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";

import styles from "./ExportExcel.module.css";
import { formatDateAndHours } from "../../../../../utils/dateUtils";
import { getUserStatus } from "../../UsersListPage";

function generateProfilsString(user, profiles) {
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

function transformDataRow(user, profiles) {
  return [
    user.id,
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

function transformData(users, profiles) {
  console.log("user innnnnnnnnnnnnnnnnn", users);
  console.log("ppppppppppppppppp");
  if (users) {
    return users.map((user) => transformDataRow(user, profiles));
  }
  return [];
}

const ExportExcel = ({ getQueryParams, profiles }) => {
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
    console.log("params --- >>>>", params);

    const users = await getUsersData(params);

    console.log("---->>>>>>data users", users.data);

    console.log("after transform /////////////////////////////////////////", transformData(users.data, profiles));
    const dataTransormed = transformData(users.data, profiles);

    const headers = [
      "ID",
      "Nom",
      "Prénom",
      "Email",
      "Institution",
      "Email",
      "Rôle",
      "Autorisation",
      "Date de création",
      "Date de dernière connexion",
      "Statut",
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataTransormed]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xls");
  }, []);

  return (
    <button className={`fr-btn ${styles["export-excel"]}`} onClick={() => generateAndExportExcel()}>
      Exporter vers Excel
    </button>
  );
};

export default memo(ExportExcel);
