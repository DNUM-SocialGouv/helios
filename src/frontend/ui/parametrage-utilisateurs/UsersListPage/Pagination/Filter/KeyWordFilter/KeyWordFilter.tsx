import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback } from "react";

import { iPaginationData } from "../../../UsersListPage";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
}>;

const KeyWordFilter = ({
  paginationData: { key, itemsPerPage, institutionId, roleId, profileId, etatId, page, orderBy, sortDir, setKey, setPage },
}: KeyWordFilterProps) => {
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setKey(e.target.value);
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, key, page, sortDir, orderBy]
  );
  return (
    <div>
      <label className="fr-label" htmlFor="profil">
        Nom, Prénom, Email
      </label>
      <div className="fr-search-bar" id="header-search" role="search">
        <input className="fr-input" onChange={handleChange} placeholder="Rechercher" type="search" value={key} />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default memo(KeyWordFilter);
