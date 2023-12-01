/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { InstitutionModel } from "../../../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../../../database/models/RoleModel";
import { KeyWordFilter } from "../KeyWordFilter/KeyWordFilter";
import styles from "./AdvancedFilter.module.css";

type KeyWordFilterProps = Readonly<{
  keyWord: string;
  setKey: () => void;
  setUserData: () => void;
  setPage: () => void;
  setLastPage: () => void;
  setRoleId: () => void;
  setProfileId: () => void;
  setInstitutionId: () => void;
  setTotal: () => void;

  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
  institutionId: number;
  roleId: number;
  profileId: string;
  itemsPerPage: number;
}>;

export const AdvancedFilter = ({
  keyWord,
  setKey,
  setTotal,
  setUserData,
  setPage,
  setLastPage,
  institutions,
  profiles,
  roles,
  setInstitutionId,
  institutionId,
  setProfileId,
  profileId,
  roleId,
  setRoleId,
  page,
  itemsPerPage,
}: KeyWordFilterProps) => {
  async function handleChangeInstitution(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setInstitutionId(e.target.value);

    const institutionCondition = { institutionId: e.target.value };

    let roleCondition = {};
    if (roleId) {
      roleCondition = { roleId: roleId };
    }

    let profilCondition = {};
    if (profileId) {
      profilCondition = { profileId: profileId };
    }

    const params = { key: keyWord, sort: "", page: 1, itemsPerPage: itemsPerPage, ...institutionCondition, ...roleCondition, ...profilCondition };
    getUsersAction(params);
  }

  async function handleChangeRole(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setRoleId(e.target.value);

    let institutionCondition = {};
    if (institutionId) {
      institutionCondition = { institutionId: institutionId };
    }

    const roleCondition = { roleId: e.target.value };

    let profilCondition = {};
    if (profileId) {
      profilCondition = { profileId: profileId };
    }

    const params = { key: keyWord, sort: "", page: 1, itemsPerPage: itemsPerPage, ...institutionCondition, ...roleCondition, ...profilCondition };
    getUsersAction(params);
  }

  async function handleChangeProfil(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setProfileId(e.target.value);

    let institutionCondition = {};
    if (institutionId) {
      institutionCondition = { institutionId: institutionId };
    }

    let roleCondition = {};
    if (roleId) {
      roleCondition = { roleId: roleId };
    }

    const profilCondition = { profileId: e.target.value };

    const params = { key: keyWord, sort: "", page: 1, itemsPerPage: itemsPerPage, ...institutionCondition, ...roleCondition, ...profilCondition };
    getUsersAction(params);
  }

  function getUsersAction(params: {}) {
    fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((response) => response.json())
      .then((users) => {
        setUserData(users.data);
        setTotal(users.total);
        setPage(1);
        setLastPage(users.lastPage);
      });
  }

  return (
    <div className={`${styles["filter_details"]}`}>
      <div className={` ${styles["filter-item"]}`}>
        <KeyWordFilter
          keyWord={keyWord}
          setKey={setKey}
          setLastPage={setLastPage}
          setPage={setPage}
          setUserData={setUserData}
          setTotal={setTotal}
          itemsPerPage={itemsPerPage}
          itemsPerPage={itemsPerPage}
          institutionId={institutionId}
          roleId={roleId}
        />
      </div>
      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="institution">
          Institution
        </label>

        <select className="fr-select" id="institution" onChange={(e) => handleChangeInstitution(e)}>
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
      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="role">
          Rôle
        </label>

        <select className="fr-select" id="role" onChange={(e) => handleChangeRole(e)}>
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
          Profil
        </label>
        <select className="fr-select" id="profil" onChange={(e) => handleChangeProfil(e)}>
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
    </div>
  );
};
