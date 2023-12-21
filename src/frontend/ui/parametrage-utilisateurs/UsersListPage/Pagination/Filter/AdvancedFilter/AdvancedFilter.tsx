import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback } from "react";

import { iPaginationData } from "../../../UsersListPage";
import KeyWordFilter from "../KeyWordFilter/KeyWordFilter";
import styles from "./AdvancedFilter.module.css";

type KeyWordFilterProps = Readonly<{
  paginationData: iPaginationData;
  userSessionRole: string;
}>;

const AdvancedFilter = ({
  paginationData,
  paginationData: {
    keyWord,
    institutions,
    profiles,
    roles,
    institutionId,
    profileId,
    roleId,
    etatId,
    itemsPerPage,
    orderBy,
    sortDir,
    setTotal,
    setUserData,
    setPage,
    setLastPage,
    setInstitutionId,
    setProfileId,
    setRoleId,
    setEtatId,
    getUsersAndRefresh,
    setKey,
    setOrderBy,
    setSortDir,
  },
  userSessionRole,
}: KeyWordFilterProps) => {
  const etats = [
    { id: 1, label: "Actif", code: "actif" },
    { id: 2, label: "Inactif", code: "inactif" },
    /* { id: 3, label: "Supprimé", code: "deleted" },*/
  ];

  const handleChangeInstitution = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setInstitutionId(e.target.value as unknown as number);
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, sortDir, orderBy]
  );

  const handleChangeRole = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setRoleId(e.target.value as unknown as number);
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, sortDir, orderBy]
  );

  const handleChangeProfil = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setProfileId(e.target.value);
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, sortDir, orderBy]
  );

  const handleChangeEtat = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setEtatId(e.target.value);
      setPage(1);
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, sortDir, orderBy]
  );

  const handleResetFilter = useCallback(async () => {
    setKey("");
    setInstitutionId(0);
    setProfileId("");
    setEtatId("");
    setRoleId(0);
    setPage(1);
    setOrderBy("nom");
    setSortDir("ASC");

    const params = {
      page: 1,
      itemsPerPage: itemsPerPage,
    };
    await getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
  }, [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord]);

  return (
    <div className={`${styles["filter_details"]}`}>
      <div className={` ${styles["filter-item"]}`}>
        <KeyWordFilter paginationData={paginationData} />
      </div>

      {userSessionRole === "Admin National" && (
        <div className={`fr-select-group ${styles["filter-item"]}`}>
          <label className="fr-label" htmlFor="institution">
            Institution
          </label>

          <select className="fr-select" id="institution" onChange={handleChangeInstitution}>
            <option selected={institutionId === 0} value="">
              Toutes
            </option>

            {institutions.map((item) => (
              <option key={item.id} selected={institutionId === item.id} value={item.id}>
                {item.libelle}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="role">
          Rôle
        </label>

        <select className="fr-select" id="role" onChange={handleChangeRole}>
          <option selected={roleId === 0 || roleId === null} value="">
            Tous
          </option>

          {roles.map((item) => (
            <option key={item.id} selected={roleId === item.id} value={item.id}>
              {item.libelle}
            </option>
          ))}
        </select>
      </div>
      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="profil">
          Autorisation
        </label>
        <select className="fr-select" id="profil" onChange={handleChangeProfil}>
          <option selected={profileId === "" || profileId === null} value="">
            Tous
          </option>

          {profiles.map((item) => (
            <option key={item.id} selected={profileId === item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className={`fr-select-group ${styles["filter-item"]}`}>
        <label className="fr-label" htmlFor="etat">
          Etat
        </label>
        <select className="fr-select" id="etat" onChange={handleChangeEtat}>
          <option selected={etatId === "" || etatId === null} value="">
            Tous
          </option>

          {etats.map((item) => (
            <option key={item.id} selected={etatId === item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className={`fr-select-group ${styles["reset-filter-container"]}`}>
        <button className={`${styles["reset-filter-btn"]}`} onClick={handleResetFilter} title="Réinitialiser les filtres">
          <span aria-hidden="true" className="fr-icon-refresh-line fr-btn"></span>
        </button>
      </div>
    </div>
  );
};

export default memo(AdvancedFilter);
