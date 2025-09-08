import "@gouvfr/dsfr/dist/component/select/select.min.css";
import { memo, useCallback } from "react";

import styles from "./AdvancedFilter.module.css";
import { iPaginationData } from "../../../UsersListPage";
import KeyWordFilter from "../KeyWordFilter/KeyWordFilter";

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
    setTotal,
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
    <>
      <div>
        <KeyWordFilter paginationData={paginationData} />
      </div>
      <div className={`${styles["filtres-container"]}`}>
        <div className={`${styles["filter_details"]}`}>
          {userSessionRole === "Admin National" && (
            <div className={`fr-select-group ${styles["filter-item"]}`}>
              <label className="fr-label" htmlFor="institution">
                Institution
              </label>

              <select className="fr-select" id="institution" onChange={handleChangeInstitution} value={institutionId || ""}>
                <option value="">Toutes</option>

                {institutions &&
                  institutions.map((item) => (
                    <option key={item.id} value={item.id}>
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

            <select className="fr-select" id="role" onChange={handleChangeRole} value={roleId || ""}>
              <option value="">Tous</option>

              {roles &&
                roles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.libelle}
                  </option>
                ))}
            </select>
          </div>
          <div className={`fr-select-group ${styles["filter-item"]}`}>
            <label className="fr-label" htmlFor="profil">
              Autorisation
            </label>
            <select className="fr-select" id="profil" onChange={handleChangeProfil} value={profileId || ""}>
              <option value="">Tous</option>

              {profiles &&
                profiles.map((item) => (
                  <option key={item.id} value={item.code}>
                    {item.label}
                  </option>
                ))}
            </select>
          </div>

          <div className={`fr-select-group ${styles["filter-item"]}`}>
            <label className="fr-label" htmlFor="etat">
              Statut
            </label>
            <select className="fr-select" id="etat" onChange={handleChangeEtat} value={etatId || ""}>
              <option value="">Tous</option>

              {etats &&
                etats.map((item) => (
                  <option key={item.id} value={item.code}>
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
      </div>
    </>
  );
};

export default memo(AdvancedFilter);
