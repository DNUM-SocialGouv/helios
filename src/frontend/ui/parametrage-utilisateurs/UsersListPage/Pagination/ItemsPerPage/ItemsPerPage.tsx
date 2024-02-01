import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback } from "react";

import { iPaginationData } from "../../UsersListPage";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
}>;

const ItemsPerPage = ({
  paginationData: { keyWord, institutionId, profileId, roleId, itemsPerPage, etatId, sortDir, orderBy, setPage },
}: KeyWordFilterProps) => {
  const pagesArray = [10, 20, 30, 50, 100];
  const handleChangeItemsPerPage = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, sortDir, orderBy]
  );

  return (
    <div className="fr-select-group">
      <select className="fr-select" id="itemsPerPage" onChange={(e) => handleChangeItemsPerPage(e)}>
        {pagesArray &&
          pagesArray.map((item) => (
            <option key={item} selected={itemsPerPage === item} value={item}>
              {item} / page
            </option>
          ))}
      </select>
    </div>
  );
};

export default memo(ItemsPerPage);
