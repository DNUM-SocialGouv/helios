"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { iPaginationData } from "../../UsersListPage";
import styles from "./TheadTable.module.css";

type TheadTableProps = Readonly<{
  paginationData: iPaginationData;
}>;

const TheadTable = ({
  paginationData: { keyWord, page, institutionId, roleId, profileId, etatId, itemsPerPage, orderBy, sortDir, setOrderBy, setSortDir },
}: TheadTableProps) => {
  const thData = [
    {
      name: "Nom",
      slug: "nom",
    },
    {
      name: "Prénom",
      slug: "prenom",
    },
    {
      name: "Email",
      slug: "email",
    },
    {
      name: "Institution",
      slug: "institution.libelle",
    },
    {
      name: "Rôle",
      slug: "role.libelle",
    },
    {
      name: "Autorisations",
      slug: "autorisations-no-sort",
      className: "no-sort",
    },
    {
      name: "Date de dernière connexion",
      slug: "lastConnectionDate",
      className: "widthTD-date",
    },
    {
      name: "Etat",
      slug: "etat",
    },
    {
      name: "Actions",
      slug: "Actions-no-sort",
      className: "no-sort",
    },
  ];

  const orderByFn = useCallback(
    async (slug: string) => {
      setOrderBy(slug);

      if (orderBy === slug) {
        if (sortDir === "DESC") {
          setSortDir("ASC");
        } else {
          setSortDir("DESC");
        }
      } else {
        setSortDir("ASC");
      }
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page, sortDir, orderBy]
  );

  return (
    <thead>
      <tr>
        {thData.map((item) => (
          <th className={`${styles["th"]} ${item.className && styles[item.className]}`} key={item.slug} onClick={() => orderByFn(item.slug)} scope="col">
            {item.name} {sortDir === "Des"}
            {orderBy === item.slug && <span aria-hidden="true" className={`fr-icon-arrow-${sortDir === "ASC" ? "down" : "up"}-line`}></span>}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default memo(TheadTable);