/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/pagination/pagination.min.css";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";

import styles from "./KeyWordFilter.module.css";

type KeyWordFilterProps = Readonly<{
  keyWord: string;
  setKey: () => {};
  setUserData: () => {};
  setPage: () => {};
  setLastPage: () => {};
}>;

export const KeyWordFilter = ({ keyWord, setKey, setUserData, setPage, setLastPage }: KeyWordFilterProps) => {
  async function handleChange(e: Event) {
    e.preventDefault();
    setKey(e.target.value);

    const params = { key: e.target.value, sort: "", page: 1 };
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
    <div className={styles["search-bar-container"]}>
      <div className={"fr-search-bar " + styles["search-bar"]} id="header-search" role="search">
        <input className="fr-input" onChange={(e) => handleChange(e)} placeholder="Rechercher" type="search" value={keyWord} />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </div>
  );
};
