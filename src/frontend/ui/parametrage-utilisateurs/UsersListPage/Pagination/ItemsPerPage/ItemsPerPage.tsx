/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { InstitutionModel } from "../../../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../../../database/models/RoleModel";
import { KeyWordFilter } from "../../Filter/KeyWordFilter/KeyWordFilter";
import styles from "./ItemsPerPage.module.css";

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
}>;

export const ItemsPerPage = ({
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
  setItemsPerPage,
  itemsPerPage,
}: KeyWordFilterProps) => {
  const pagesArray = [10, 20, 30, 50, 100];
  async function handleChangeItemsPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
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

    const params = { key: keyWord, sort: "", page: 1, ...institutionCondition, ...roleCondition, ...profilCondition, itemsPerPage: e.target.value };
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
        setItemsPerPage(users.itemsPerPage);
      });
  }

  return (
    <div className="fr-select-group">
      <select className="fr-select" id="itemsPerPage" onChange={(e) => handleChangeItemsPerPage(e)}>
        {pagesArray.map((item) => (
          <option key={item} selected={itemsPerPage === item} value={item}>
            {item} / page
          </option>
        ))}
      </select>
    </div>
  );
};
