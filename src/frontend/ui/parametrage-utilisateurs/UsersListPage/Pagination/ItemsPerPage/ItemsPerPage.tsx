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

const ItemsPerPage = ({
  paginationData: {
    keyWord,
    institutionId,
    profileId,
    roleId,
    itemsPerPage,
    etatId,
    setTotal,
    setUserData,
    setPage,
    setLastPage,
    setItemsPerPage,
    getUsersAndRefresh,
  },
}: KeyWordFilterProps) => {
  const pagesArray = [10, 20, 30, 50, 100];
  const handleChangeItemsPerPage = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
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

      let etatCondition = {};
      if (etatId) {
        etatCondition = { etatId: etatId };
      }

      const params = {
        key: keyWord,
        sort: "",
        page: 1,
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
        itemsPerPage: e.target.value,
      };

      await getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord]
  );

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

export default memo(ItemsPerPage);
