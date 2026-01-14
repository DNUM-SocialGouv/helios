import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo } from "react";

import { iPaginationData } from "../../../UsersListPage";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
}>;

const KeyWordFilter = ({
  paginationData: { key, setKey, setPage },
}: KeyWordFilterProps) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setKey(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="fr-search-bar" id="header-search" role="search">
        <input className="fr-input" onChange={handleChange} placeholder="Rechercher un nom, un prénom ou une adresse mail" type="search" value={key} />
        <button className="fr-btn" title="Rechercher">
          Rechercher un nom, un prénom ou une adresse mail
        </button>
      </div>
    </div>
  );
};

export default memo(KeyWordFilter);
