/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { useSession } from "next-auth/react";
import { memo, useCallback } from "react";

import { iPaginationData } from "../../UsersListPage";
import KeyWordFilter from "../KeyWordFilter/KeyWordFilter";
import styles from "./AdvancedFilter.module.css";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
  userSessionRole: string;
}>;

const AdvancedFilter = ({
  paginationData,
  paginationData: {
    keyWord,
    institutions,
    profiles,
    roles,
    institutionId,
    profileId,
    roleId,
    etatId,
    itemsPerPage,
    setTotal,
    setUserData,
    setPage,
    setLastPage,
    setInstitutionId,
    setProfileId,
    setRoleId,
    setEtatId,
    getUsersAndRefresh,
  },
  userSessionRole,
}: KeyWordFilterProps) => {
  const etats = [
    { id: 1, label: "Actif", code: "actif" },
    { id: 2, label: "Inactif", code: "inactif" },
    { id: 3, label: "Supprimé", code: "deleted" },
  ];

  const { data } = useSession();
  const institutionIdSession = (data?.user?.role as unknown as number) !== 1 ? data?.user.institutionId : 0;

  const handleChangeInstitution = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setInstitutionId(e.target.value as unknown as number);

      const institutionCondition = { institutionId: e.target.value };

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
        key: keyWord,
        sort: "",
        page: 1,
        itemsPerPage: itemsPerPage,
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
      };
      await getUsersAction(params);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord]
  );

  const handleChangeRole = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setRoleId(e.target.value as unknown as number);
      let institutionCondition = {};
      if (institutionIdSession || institutionId) {
        institutionCondition = { institutionId: institutionIdSession || institutionId };
      }

      const roleCondition = { roleId: e.target.value };

      let profilCondition = {};
      if (profileId) {
        profilCondition = { profileId: profileId };
      }

      let etatCondition = {};
      if (etatId) {
        etatCondition = { etatId: etatId };
      }

      const params = {
        key: keyWord,
        sort: "",
        page: 1,
        itemsPerPage: itemsPerPage,
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
      };
      await getUsersAction(params);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord]
  );

  const handleChangeProfil = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setProfileId(e.target.value);

      let institutionCondition = {};
      if (institutionIdSession || institutionId) {
        institutionCondition = { institutionId: institutionIdSession || institutionId };
      }

      let roleCondition = {};
      if (roleId) {
        roleCondition = { roleId: roleId };
      }

      const profilCondition = { profileId: e.target.value };

      let etatCondition = {};
      if (etatId) {
        etatCondition = { etatId: etatId };
      }

      const params = {
        key: keyWord,
        sort: "",
        page: 1,
        itemsPerPage: itemsPerPage,
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
      };
      await getUsersAction(params);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord]
  );

  const handleChangeEtat = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setEtatId(e.target.value);
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

      const etatCondition = { etatId: e.target.value };

      const params = {
        key: keyWord,
        sort: "",
        page: 1,
        itemsPerPage: itemsPerPage,
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
      };
      await getUsersAction(params);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord]
  );

  const getUsersAction = useCallback(
    (params: {}) => {
      getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
      /*fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      })
        .then((response) => response.json())
        .then((users) => {
          setUserData(users.data);
          setTotal(users.total);
          setPage(1);
          setLastPage(users.lastPage);
        });*/
    },
    [institutionId, roleId, profileId, itemsPerPage, keyWord]
  );

  return (
    <div className={`${styles["filter_details"]}`}>
      <div className={` ${styles["filter-item"]}`}>
        <KeyWordFilter paginationData={paginationData} />
      </div>

      {userSessionRole === "Admin National" && (
        <div className={`fr-select-group ${styles["filter-item"]}`}>
          <label className="fr-label" htmlFor="institution">
            Institution
          </label>

          <select className="fr-select" id="institution" onChange={handleChangeInstitution}>
            <option selected={institutionId === 0} value="">
              Toutes
            </option>

            {institutions.map((item) => (
              <option key={item.id} selected={institutionId === item.id} value={item.id}>
                {item.libelle}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="role">
          Rôle
        </label>

        <select className="fr-select" id="role" onChange={handleChangeRole}>
          <option selected={roleId === 0 || roleId === null} value="">
            Tous
          </option>

          {roles.map((item) => (
            <option key={item.id} selected={roleId === item.id} value={item.id}>
              {item.libelle}
            </option>
          ))}
        </select>
      </div>
      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="profil">
          Autorisation
        </label>
        <select className="fr-select" id="profil" onChange={handleChangeProfil}>
          <option selected={profileId === "" || profileId === null} value="">
            Tous
          </option>

          {profiles.map((item) => (
            <option key={item.id} selected={profileId === item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="etat">
          Etat
        </label>
        <select className="fr-select" id="etat" onChange={handleChangeEtat}>
          <option selected={etatId === "" || etatId === null} value="">
            Tous
          </option>

          {etats.map((item) => (
            <option key={item.id} selected={etatId === item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default memo(AdvancedFilter);
