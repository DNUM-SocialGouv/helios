import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback } from "react";

import { iPaginationData } from "../../../UsersListPage";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
}>;

const KeyWordFilter = ({ paginationData: { keyWord, itemsPerPage, institutionId, roleId, profileId, etatId, page, setKey, setPage } }: KeyWordFilterProps) => {
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setKey(e.target.value as unknown as string);
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page]
  );
  return (
    <div>
      <label className="fr-label" htmlFor="profil">
        Nom, Prénom, Email
      </label>
      <div className="fr-search-bar" id="header-search" role="search">
        <input className="fr-input" onChange={handleChange} placeholder="Rechercher" type="search" value={keyWord} />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default memo(KeyWordFilter);
