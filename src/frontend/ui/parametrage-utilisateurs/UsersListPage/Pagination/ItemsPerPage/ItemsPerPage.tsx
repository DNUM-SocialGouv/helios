/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { iPaginationData } from "../../UsersListPage";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
}>;

export const ItemsPerPage = ({
  paginationData: { keyWord, institutionId, profileId, roleId, itemsPerPage, setTotal, setUserData, setPage, setLastPage, setItemsPerPage },
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
