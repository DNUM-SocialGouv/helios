"use client";

import { memo, useCallback } from "react";

import { iPaginationData } from "../UsersListPage";

type ReactivateProps = Readonly<{
  paginationData: iPaginationData;
  userCode: string;
  lastElementInPage: boolean;
}>;

const Reactivate = ({
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
  },
  userCode,
  lastElementInPage,
}: ReactivateProps) => {
  const reactivateUser = useCallback(
    async (userCode: string) => {
      let keyWordData = {};
      if (keyWord) {
        keyWordData = { key: keyWord };
      }

      let pageData = {};
      if (page) {
        pageData = { page: page };

        if (lastElementInPage) {
          pageData = { page: page - 1 };
        }
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

      let orderByData = {};
      if (orderBy) {
        orderByData = { orderBy: orderBy };
      }

      let sortDirdData = {};
      if (sortDir) {
        sortDirdData = { sortDir: orderBy };
      }

      const params = {
        status: "deleted_successfully",
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

      await fetch("/api/utilisateurs/reactivate", {
        body: JSON.stringify({ userCode: userCode }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }).then(async () => {
        getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
      });
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page, sortDir, orderBy]
  );

  return (
    <button title="Réactiver">
      <span aria-hidden="true" className="fr-icon-refresh-line" onClick={() => reactivateUser(userCode)}></span>
    </button>
  );
};

export default memo(Reactivate);
