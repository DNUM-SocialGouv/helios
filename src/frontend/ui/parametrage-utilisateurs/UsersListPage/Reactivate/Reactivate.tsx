"use client";

import { memo, useCallback } from "react";

import { iPaginationData } from "../UsersListPage";

type ReactivateProps = Readonly<{
  paginationData: iPaginationData;
  userCode: string;
  lastElementInPage: boolean;
}>;

const Reactivate = ({
  paginationData: { keyWord, page, institutionId, roleId, profileId, etatId, itemsPerPage, setUserData, setPage, setLastPage },
  userCode,
  lastElementInPage,
}: ReactivateProps) => {
  const reactivateUser = useCallback(async (userCode: string) => {
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

    const params = {
      status: "deleted_successfully",
      ...keyWordData,
      ...pageData,
      ...institutionIdData,
      ...roleIdData,
      ...profileIdData,
      ...etatCondition,
      itemsPerPage: itemsPerPage.toString(),
    };

    await fetch("/api/utilisateurs/reactivate", {
      body: JSON.stringify({ userCode: userCode }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then(async () => {
      await fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      })
        .then((response) => response.json())
        .then((users) => {
          setUserData(users.data);
          setPage(users.currentPage);
          setLastPage(users.lastPage);
        });
    });
  }, []);

  return (
    <button title="Réactivé">
      <span aria-hidden="true" className="fr-icon-refresh-line" onClick={() => reactivateUser(userCode)}></span>
    </button>
  );
};

export default memo(Reactivate);
