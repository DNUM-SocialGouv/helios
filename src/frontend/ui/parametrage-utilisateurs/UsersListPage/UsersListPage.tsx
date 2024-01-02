"use client";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";

import { useQueryState, parseAsInteger, parseAsString } from "next-usequerystate";
import { useCallback, useEffect, useState } from "react";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import AdvancedFilter from "./Pagination/Filter/AdvancedFilter/AdvancedFilter";
import ItemsPerPage from "./Pagination/ItemsPerPage/ItemsPerPage";
import PaginationBtn from "./Pagination/PaginationBtn/PaginationBtn";
import TheadTable from "./Pagination/TheadTable/TheadTable";
import styles from "./UsersListPage.module.css";

function greaterThanNMonths(inputDate: Date, n: number): boolean {
  const NMonthsAgo = new Date();
  NMonthsAgo.setMonth(new Date().getMonth() - n);
  return new Date(inputDate) < NMonthsAgo;
}

function getUserStatus(lastConnectionDate: Date): string {
  if (greaterThanNMonths(lastConnectionDate, 6) || lastConnectionDate === null) {
    return "Inactif";
  }
  return "Actif";
}

export interface iPaginationData {
  institutionId: number;
  institutions: InstitutionModel[];
  keyWord: string;
  key: string;
  page: number;
  profileId: string;
  profiles: ProfilModel[];
  roleId: number;
  etatId: string;
  roles: RoleModel[];
  itemsPerPage: number;
  lastPage: number;
  orderBy: string;
  sortDir: string;
  total: number;
  setKey: (key: string) => void;
  setInstitutionId: (institutionId: number) => void;
  setLastPage: (lastPage: number) => void;
  setPage: (page: number) => void;
  setProfileId: (profileId: string) => void;
  setRoleId: (roleId: number) => void;
  setTotal: (total: number) => void;
  setUserData: (userData: UtilisateurModel[]) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setEtatId: (etatId: string) => void;
  getUsersAndRefresh: (params: any, setUserData: any, setPage: any, setLastPage: any, setTotal: any) => void;
  setOrderBy: (orderBy: string) => void;
  setSortDir: (sortDir: string) => void;
}

type UsersListPageProps = Readonly<{
  users: {
    data: UtilisateurModel[];
    total: number;
    currentPage: number;
    keyWord: string;
    lastPage: number;
  };
  keyWord: string;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
  institution: number;
  profile: string;
  role: number;
  status?: string;
  etat: string;
  lastElementInPage: boolean;
  itemsPerPageValue: number;
  userSessionRole: string;
  orderByPage: string;
  sortDirPage: string;
}>;

const UsersListPage = ({
  users,
  keyWord,
  institutions,
  profiles,
  roles,
  institution,
  profile,
  role,
  status,
  etat,
  itemsPerPageValue,
  userSessionRole,
  orderByPage,
  sortDirPage,
}: UsersListPageProps) => {
  const [userData, setUserData] = useState<UtilisateurModel[]>(users.data);
  const [total, setTotal] = useState(users.total);
  const [lastPage, setLastPage] = useState(users.lastPage);

  const [key, setKey] = useQueryState<string>("key", parseAsString.withDefault(keyWord));
  const [institutionId, setInstitutionId] = useQueryState("institutionId", parseAsInteger.withDefault(institution));
  const [roleId, setRoleId] = useQueryState("roleId", parseAsInteger.withDefault(role));
  const [profileId, setProfileId] = useQueryState("profileId", parseAsString.withDefault(profile));
  const [etatId, setEtatId] = useQueryState("etatId", parseAsString.withDefault(etat));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(users.currentPage));
  const [statusCode] = useQueryState("status", parseAsString.withDefault(status ? status : ""));
  const [itemsPerPage, setItemsPerPage] = useQueryState("itemsPerPage", parseAsInteger.withDefault(itemsPerPageValue));

  const [orderBy, setOrderBy] = useQueryState("orderBy", parseAsString.withDefault(orderByPage));
  const [sortDir, setSortDir] = useQueryState("sortDir", parseAsString.withDefault(sortDirPage));

  const { wording } = useDependencies();

  const getUsersAndRefresh = useCallback(
    async (
      params: string | string[][] | Record<string, string> | URLSearchParams | undefined,
      setUserData: (arg0: any) => void,
      setPage: (arg0: any) => void,
      setLastPage: (arg0: any) => void,
      setTotal: (arg0: any) => void
    ) => {
      fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      })
        .then((response) => response.json())
        .then((users) => {
          setUserData(users.data);
          setPage(users.currentPage);
          setLastPage(users.lastPage);
          setTotal(users.total);
        });
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page, sortDir, orderBy]
  );

  const paginationData: iPaginationData = {
    institutionId: institutionId,
    institutions: institutions,
    keyWord: key,
    key: key,
    page: page as number,
    profileId: profileId,
    profiles: profiles,
    roleId: roleId,
    etatId: etatId,
    roles: roles,
    itemsPerPage: itemsPerPage,
    lastPage: lastPage,
    orderBy: orderBy,
    sortDir: sortDir,
    total: users.total,
    setKey: setKey,
    setInstitutionId: setInstitutionId,
    setLastPage: setLastPage,
    setPage: setPage,
    setProfileId: setProfileId,
    setRoleId: setRoleId,
    setUserData: setUserData,
    setItemsPerPage: setItemsPerPage,
    setEtatId: setEtatId,
    getUsersAndRefresh: getUsersAndRefresh,
    setOrderBy: setOrderBy,
    setSortDir: setSortDir,
    setTotal: setTotal,
  };

  useEffect(() => {
    let orderByData = {};
    if (orderBy) {
      orderByData = { orderBy: orderBy };
    }

    let sortDirdData = {};
    if (sortDir) {
      sortDirdData = { sortDir: sortDir };
    }

    let keyWordData = {};
    if (key) {
      keyWordData = { key: key };
    }

    let pageData = {};
    if (page) {
      pageData = { page: page };
    }

    let institutionIdData = {};
    if (institutionId) {
      institutionIdData = { institutionId: institutionId };
    }

    let roleIdData = {};
    if (roleId) {
      roleIdData = { roleId: roleId };
    }

    let profileIdData = {};
    if (profileId) {
      profileIdData = { profileId: profileId };
    }

    let etatCondition = {};
    if (etatId) {
      etatCondition = { etatId: etatId };
    }

    const params = {
      ...keyWordData,
      ...pageData,
      ...institutionIdData,
      ...roleIdData,
      ...profileIdData,
      ...etatCondition,
      ...orderByData,
      ...sortDirdData,
      itemsPerPage: itemsPerPage.toString(),
    };
    getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);
  }, [institutionId, roleId, profileId, etatId, itemsPerPage, key, page, sortDir, orderBy]);

  return (
    <main className="fr-container">
      {userData && (
        <>
          <h1 className={`fr-mb-4w ${styles["title"]}`}>{wording.PAGE_UTILISATEUR_TITRE}</h1>

          {statusCode === "edit_successfully" && (
            <div className="fr-alert fr-alert--success fr-alert--sm fr-mb-3w">
              <p>La modification de l`utilisateur a été effectuée avec succès.</p>
            </div>
          )}

          {statusCode === "deleted_successfully" && (
            <div className="fr-alert fr-alert--success fr-alert--sm fr-mb-3w">
              <p>La suppression de l`utilisateur a été effectuée avec succès.</p>
            </div>
          )}

          <div>
            <AdvancedFilter paginationData={paginationData} userSessionRole={userSessionRole} />
          </div>

          <div className={styles["count-elements"]}>
            {total > 1 && <>{total} éléments trouvés.</>}
            {total === 1 && <>{total} élément trouvé.</>}
          </div>

          {userData.length === 0 ? (
            <div className={"fr-mt-8w " + styles["align-text"]}>{wording.AUCUN_ELEMENT_TROUVE}</div>
          ) : (
            <div>
              <div className={"fr-table fr-table--blue-ecume fr-mt-2w " + styles["align"]}>
                <table>
                  <TheadTable paginationData={paginationData} />
                  <tbody>
                    {userData.map((user: UtilisateurModel) => {
                      const roleClass = user.role.id === 1 ? "error" : user.role.id === 2 ? "success" : "info";
                      return (
                        <tr key={user.id}>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.nom}
                            </a>
                          </td>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.prenom}
                            </a>
                          </td>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.email}
                            </a>
                          </td>
                          <td className={styles["widthTD-small"]}>{user.institution.libelle}</td>

                          <td>
                            <span
                              className={`fr-badge fr-badge--${roleClass} fr-badge--no-icon ${styles["text_no_change"]} ${styles["widthTD-role"]} fr-text--xs`}
                            >
                              {user.role.libelle}
                            </span>
                          </td>
                          <td className={`${styles["widthTD-profil"]}`}>
                            {user.profils.map((profil: string, i: number, { length }: any) => {
                              const pr = profiles.filter((item) => item.code === profil);
                              let seperator = ", ";
                              //last element
                              if (i + 1 === length) {
                                seperator = "";
                              }
                              return (
                                <span className={`fr-text--xs `} key={pr[0].code}>
                                  {pr[0].label}
                                  {seperator}
                                </span>
                              );
                            })}
                          </td>
                          <td className={styles["widthTD-date"]}>{user?.lastConnectionDate && formatDateAndHours(user?.lastConnectionDate?.toString())}</td>
                          <td className={styles["widthTD-etat"]}>{getUserStatus(user.lastConnectionDate)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className={`${styles["pagination-container"]}`}>
                  <div className={`${styles["paginationBtn-container"]}`}>
                    <PaginationBtn paginationData={paginationData} />
                  </div>
                  <div className={`${styles["itemsPerPage-container"]}`}>
                    <ItemsPerPage paginationData={paginationData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};
UsersListPage.defaultProps = {
  status: "",
};

export default UsersListPage;
