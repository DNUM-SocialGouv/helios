/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { InstitutionModel } from "../../../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../../../database/models/RoleModel";
import styles from "./AdvancedFilter.module.css";

type KeyWordFilterProps = Readonly<{
  keyWord: string;
  setKey: () => {};
  setUserData: () => {};
  setPage: () => {};
  setLastPage: () => {};

  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
  profileId: number;
  roleId: number;
  setRoleId: number;
}>;

export const AdvancedFilter = ({
  keyWord,
  setKey,
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
  key,
  page,
}: KeyWordFilterProps) => {
  async function handleChangeInstitution(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();

    console.log("onChange TextInput value: " + e.target.value);
    const keyValue = key ? key : "";
    console.log("key--------------: " + key);
    setInstitutionId(e.target.value);

    const params = { key: keyValue, sort: "", page: page, institutionId: e.target.value };
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
  }

  return (
    <div className={`${styles["filtre_details"]}`}>
      <div className="fr-select-group">
        <label className="fr-label" htmlFor="institution">
          Institution
        </label>

        <select className="fr-select" id="institution" onChange={(e) => handleChangeInstitution(e)}>
          <option disabled hidden selected={institutionId === 0} value="">
            Selectionnez une option
          </option>

          {institutions.map((item) => (
            <option key={item.id} selected={institutionId === item.id} value={item.id}>
              {item.libelle}
            </option>
          ))}
        </select>
      </div>
      <div className="fr-select-group fr-mt-3w">
        <label className="fr-label" htmlFor="role">
          Role
        </label>
        <select className="fr-select" id="role">
          <option disabled hidden selected={roleId === 0} value="">
            Selectionnez une option
          </option>

          {roles.map((item) => (
            <option key={item.id} selected={roleId === item.id} value={item.id}>
              {item.libelle}
            </option>
          ))}
        </select>
      </div>

      <div className="fr-select-group fr-mt-3w">
        <label className="fr-label" htmlFor="profil">
          Profil
        </label>
        <select className="fr-select" id="profil">
          <option disabled hidden selected={profileId === 0 || profileId === null} value="">
            Selectionnez une option
          </option>

          {profiles.map((item) => (
            <option key={item.id} selected={profileId === item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
