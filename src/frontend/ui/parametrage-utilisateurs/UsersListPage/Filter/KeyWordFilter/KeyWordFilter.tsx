/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { useSession } from "next-auth/react";
import { memo, useCallback } from "react";

import { iPaginationData } from "../../UsersListPage";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
}>;

const KeyWordFilter = ({
  paginationData: { keyWord, itemsPerPage, institutionId, roleId, profileId, page, setKey, setUserData, setPage, setLastPage, setTotal },
}: KeyWordFilterProps) => {
  const { data } = useSession();
  const institutionIdSession = (data?.user?.role as unknown as number) !== 1 ? data?.user.institutionId : 0;

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setKey(e.target.value as unknown as string);

      let institutionCondition = {};
      if (institutionIdSession || institutionId) {
        institutionCondition = { institutionId: institutionIdSession || institutionId };
      }

      let roleCondition = {};
      if (roleId) {
        roleCondition = { roleId: roleId };
      }

      let profilCondition = {};
      if (profileId) {
        profilCondition = { profileId: profileId };
      }

      const params = {
        key: e.target.value,
        sort: "",
        page: "1",
        itemsPerPage: itemsPerPage.toString(),
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
      };
      await fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      })
        .then((response) => response.json())
        .then((users) => {
          setUserData(users.data);
          setPage(users.currentPage);
          setTotal(users.total);
          setLastPage(users.lastPage);
        });
    },
    [institutionId, roleId, profileId, itemsPerPage, keyWord, page]
  );
  return (
    <div>
      <label className="fr-label" htmlFor="profil">
        Nom, Prénom, Email
      </label>
      <div className="fr-search-bar" id="header-search" role="search">
        <input className="fr-input" onChange={handleChange} placeholder="Rechercher" type="search" value={keyWord} />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default memo(KeyWordFilter);
