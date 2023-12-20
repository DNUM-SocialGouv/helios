"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { iPaginationData } from "../UsersListPage";
import styles from "./TheadTable.module.css";

type TheadTableProps = Readonly<{
  paginationData: iPaginationData;
}>;

const TheadTable = ({
  paginationData: {
    keyWord,
    page,
    institutionId,
    roleId,
    profileId,
    etatId,
    itemsPerPage,
    orderBy,
    sortDir,
    setUserData,
    setPage,
    setLastPage,
    setTotal,
    getUsersAndRefresh,
    setOrderBy,
    setSortDir,
  },
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

  useEffect(() => {
    console.log("---------useEffect orderby = ", orderBy);

    let orderByData = {};
    if (orderBy) {
      orderByData = { orderBy: orderBy };
    }

    let sortDirdData = {};
    if (sortDir) {
      sortDirdData = { sortDir: sortDir };
    }

    let keyWordData = {};
    if (keyWord) {
      keyWordData = { key: keyWord };
    }

    let pageData = {};
    if (page) {
      pageData = { page: page };
    }

    let institutionIdData = {};
    if (institutionId) {
      institutionIdData = { institutionId: institutionId };
    }

    let roleIdData = {};
    if (roleId) {
      roleIdData = { roleId: roleId };
    }

    let profileIdData = {};
    if (profileId) {
      profileIdData = { profileId: profileId };
    }

    let etatCondition = {};
    if (etatId) {
      etatCondition = { etatId: etatId };
    }

    const params = {
      ...keyWordData,
      ...pageData,
      ...institutionIdData,
      ...roleIdData,
      ...profileIdData,
      ...etatCondition,
      ...orderByData,
      ...sortDirdData,
      itemsPerPage: itemsPerPage.toString(),
    };
    getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
  }, [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page, sortDir, orderBy]);

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

      /*
      let sortDirV = "";

      if (orderBy === slug) {
        if (sortDir === "DESC") {
          setSortDir("ASC");
          sortDirV = "ASC";
        } else {
          setSortDir("DESC");
          sortDirV = "DESC";
        }
      } else {
        setSortDir("ASC");
        sortDirV = "ASC";
      }

      let orderByData = {};
      if (orderBy) {
        orderByData = { orderBy: slug };
      }

      let sortDirdData = {};
      if (sortDirV) {
        sortDirdData = { sortDir: sortDirV };
      }

      let keyWordData = {};
      if (keyWord) {
        keyWordData = { key: keyWord };
      }

      let pageData = {};
      if (page) {
        pageData = { page: page };
      }

      let institutionIdData = {};
      if (institutionId) {
        institutionIdData = { institutionId: institutionId };
      }

      let roleIdData = {};
      if (roleId) {
        roleIdData = { roleId: roleId };
      }

      let profileIdData = {};
      if (profileId) {
        profileIdData = { profileId: profileId };
      }

      let etatCondition = {};
      if (etatId) {
        etatCondition = { etatId: etatId };
      }

      const params = {
        ...keyWordData,
        ...pageData,
        ...institutionIdData,
        ...roleIdData,
        ...profileIdData,
        ...etatCondition,
        ...orderByData,
        ...sortDirdData,
        itemsPerPage: itemsPerPage.toString(),
      };
      getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
      */
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
