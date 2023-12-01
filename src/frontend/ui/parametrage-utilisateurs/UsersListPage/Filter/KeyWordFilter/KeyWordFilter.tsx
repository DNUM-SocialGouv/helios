/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";

import styles from "./KeyWordFilter.module.css";

type KeyWordFilterProps = Readonly<{
  keyWord: string;
  itemsPerPage: number;
  institutionId: number;
  roleId: number;
  profileId: string;
  setKey: () => void;
  setUserData: () => void;
  setPage: () => void;
  setLastPage: () => void;
  setTotal: () => void;
}>;

export const KeyWordFilter = ({
  keyWord,
  setKey,
  setUserData,
  setPage,
  setLastPage,
  setTotal,
  itemsPerPage,
  institutionId,
  roleId,
  profileId,
}: KeyWordFilterProps) => {
  async function handleChange(e: Event) {
    e.preventDefault();
    setKey(e.target.value);

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

    const params = { key: e.target.value, sort: "", page: 1, itemsPerPage: itemsPerPage, ...institutionCondition, ...roleCondition, ...profilCondition };
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
  }
  return (
    <div>
      <label className="fr-label" htmlFor="profil">
        Nom, Prénom, Email
      </label>
      <div className="fr-search-bar" id="header-search" role="search">
        <input className="fr-input" onChange={(e) => handleChange(e)} placeholder="Rechercher" type="search" value={keyWord} />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </div>
  );
};
