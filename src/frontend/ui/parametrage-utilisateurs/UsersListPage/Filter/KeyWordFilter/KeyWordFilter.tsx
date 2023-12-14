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
  paginationData: {
    keyWord,
    itemsPerPage,
    institutionId,
    roleId,
    profileId,
    etatId,
    page,
    setKey,
    setUserData,
    setPage,
    setLastPage,
    setTotal,
    getUsersAndRefresh,
  },
}: KeyWordFilterProps) => {
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setKey(e.target.value as unknown as string);

      let institutionCondition = {};
      if (institutionId) {
        institutionCondition = { institutionId: institutionId };
      }

      let roleCondition = {};
      if (roleId) {
        roleCondition = { roleId: roleId };
      }

      let profilCondition = {};
      if (profileId) {
        profilCondition = { profileId: profileId };
      }

      let etatCondition = {};
      if (etatId) {
        etatCondition = { etatId: etatId };
      }

      const params = {
        key: e.target.value,
        sort: "",
        page: "1",
        itemsPerPage: itemsPerPage.toString(),
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
      };
      getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page]
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
