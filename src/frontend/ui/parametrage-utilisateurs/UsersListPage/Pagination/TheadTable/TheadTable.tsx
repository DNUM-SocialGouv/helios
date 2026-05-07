"use client";

import { memo } from "react";

import { Tri } from "../../../../commun/Table/Table";
import { iPaginationData } from "../../UsersListPage";

type TheadTableProps = Readonly<{
  paginationData: iPaginationData;
}>;

const TheadTable = ({
  paginationData: { orderBy, sortDir, setOrderBy, setSortDir },
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
      name: "Autorisation",
      slug: "autorisations-no-sort",
      className: "no-sort",
    },
    {
      name: "Date de création",
      slug: "dateCreation",
      className: "widthTD-date",
    },
    {
      name: "Date de dernière connexion",
      slug: "lastConnectionDate",
      className: "widthTD-date",
    },

    {
      name: "Statut",
      slug: "etat",
      className: "no-sort",
    },
  ];

  return (
    <thead>
      <tr>
        {thData &&
          thData.map((item) => {
            const isSortable = !item.className?.includes("no-sort");
            return (
              <th
                key={item.slug}
              >
                {item.name}
                {isSortable && <Tri headerKey={item.slug} order={sortDir} orderBy={orderBy} setOrder={setSortDir} setOrderBy={setOrderBy} />}
              </th>
            );
          })}
      </tr>
    </thead>
  );
};

export default memo(TheadTable);
