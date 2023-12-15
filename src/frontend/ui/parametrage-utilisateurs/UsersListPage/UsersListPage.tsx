"use client";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";

import { useSession } from "next-auth/react";
import { useQueryState, parseAsInteger, parseAsString } from "next-usequerystate";
import { useCallback, useState } from "react";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import ConfirmDeleteModal from "./ConfirmDeleteModal/ConfirmDeleteModal";
import AdvancedFilter from "./Filter/AdvancedFilter/AdvancedFilter";
import ItemsPerPage from "./Pagination/ItemsPerPage/ItemsPerPage";
import PaginationBtn from "./Pagination/PaginationBtn/PaginationBtn";
import Reactivate from "./Reactivate/Reactivate";
import styles from "./UsersListPage.module.css";

function greaterThanNMonths(inputDate: Date, n: number): boolean {
  const NMonthsAgo = new Date();
  NMonthsAgo.setMonth(new Date().getMonth() - n);
  return new Date(inputDate) < NMonthsAgo;
}

function getUserStatus(lastConnectionDate: Date, deletedDate: Date): string {
  if (deletedDate) {
    return "Supprimé";
  }
  if (greaterThanNMonths(lastConnectionDate, 3) || lastConnectionDate === null) {
    return "InActif";
  }
  return "Actif";
}

export interface iPaginationData {
  institutionId: number;
  institutions: InstitutionModel[];
  keyWord: string;
  page: number;
  profileId: string;
  profiles: ProfilModel[];
  roleId: number;
  etatId: string;
  roles: RoleModel[];
  itemsPerPage: number;
  lastPage: number;
  total: number;
  setKey: (key: string) => void;
  setInstitutionId: (institutionId: number) => void;
  setLastPage: (lastPage: number) => void;
  setPage: (page: number) => void;
  setProfileId: (profileId: string) => void;
  setRoleId: (roleId: number) => void;
  setUserData: (userData: UtilisateurModel[]) => void;
  setTotal: (total: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setEtatId: (etatId: string) => void;
  getUsersAndRefresh: (params: any, setUserData: any, setPage: any, setLastPage: any, setTotal: any) => void;
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
  lastElementInPage,
  itemsPerPageValue,
  userSessionRole,
}: UsersListPageProps) => {
  const { data } = useSession();

  const [userData, setUserData] = useState<UtilisateurModel[]>(users.data);
  const [total, setTotal] = useState(users.total);
  const [lastPage, setLastPage] = useState(users.lastPage);

  const [key, setKey] = useQueryState<string>("key", parseAsString.withDefault(keyWord));
  const [institutionId, setInstitutionId] = useQueryState("institutionId", parseAsInteger.withDefault(institution));
  const [roleId, setRoleId] = useQueryState("roleId", parseAsInteger.withDefault(role));
  const [profileId, setProfileId] = useQueryState("profileId", parseAsString.withDefault(profile));
  const [etatId, setEtatId] = useQueryState("etatId", parseAsString.withDefault(etat));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(users.currentPage));
  const [statusCode] = useQueryState("status", parseAsString.withDefault(status));
  const [userToDelete, setUserToDelete] = useState("");
  const [itemsPerPage, setItemsPerPage] = useQueryState("itemsPerPage", parseAsInteger.withDefault(itemsPerPageValue));

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
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page]
  );

  const paginationData: iPaginationData = {
    institutionId: institutionId,
    institutions: institutions,
    keyWord: key,
    page: page as number,
    profileId: profileId,
    profiles: profiles,
    roleId: roleId,
    etatId: etatId,
    roles: roles,
    itemsPerPage: itemsPerPage,
    lastPage: lastPage,
    total: users.total,
    setKey: setKey,
    setInstitutionId: setInstitutionId,
    setLastPage: setLastPage,
    setPage: setPage,
    setProfileId: setProfileId,
    setRoleId: setRoleId,
    setUserData: setUserData,
    setTotal: setTotal,
    setItemsPerPage: setItemsPerPage,
    setEtatId: setEtatId,
    getUsersAndRefresh: getUsersAndRefresh,
  };

  return (
    <main className="fr-container">
      {userData && (
        <>
          <h1 className={`fr-mb-4w ${styles["title"]}`}>{wording.PAGE_UTILISATEUR_TITRE}</h1>

          {statusCode === "edit_successfully" && (
            <div className="fr-alert fr-alert--success fr-alert--sm fr-mb-3w ">
              <p>La modification de l`utilisateur a été effectuée avec succès.</p>
            </div>
          )}

          {statusCode === "deleted_successfully" && (
            <div className="fr-alert fr-alert--success fr-alert--sm fr-mb-3w ">
              <p>La suppression de l`utilisateur a été effectuée avec succès.</p>
            </div>
          )}

          <div className={`${styles["filtres-container"]}`}>
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
                  <thead>
                    <tr>
                      <th scope="col">{wording.LASTNAME}</th>
                      <th scope="col">{wording.FIRSTNAME}</th>
                      {/*<th className={styles["widthTD-small"]} scope="col">
                        {wording.EMAIL}
                      </th>*/}

                      <th scope="col">{wording.INSTITUTION}</th>
                      <th scope="col">{wording.ROLE_}</th>
                      <th scope="col">Autorisations</th>
                      {/*<th className={styles["widthTD-date"]} scope="col">
                        {wording.CREATION_DATE}
                      </th>*/}
                      <th scope="col">Etat</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((user: UtilisateurModel) => {
                      const roleClass = user.role.id === 1 ? "error" : user.role.id === 2 ? "success" : "info";
                      const userStatus = getUserStatus(user.lastConnectionDate, user.deletedDate);
                      const detailRow = data?.user?.idUser === user.code && data?.user?.role !== 1;

                      return (
                        <tr key={user.id}>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.id} {user.prenom}
                            </a>
                          </td>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.nom}
                            </a>
                          </td>
                          {/*<td className={styles["widthTD-small"]}>{user.email}</td>*/}

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

                          <td className={styles["widthTD-etat"]}>{userStatus}</td>

                          <td className={styles["widthTD-actions"]}>
                            {userStatus !== "Supprimé" && (
                              <>
                                {detailRow && (
                                  <>
                                    <a
                                      className="fr-raw-link"
                                      href={`/settings/users/${
                                        user.code
                                      }?page=${page}&itemsPerPage=${itemsPerPage}&key=${key}&institutionId=${institutionId}&roleId=${roleId}&profileId=${
                                        profileId || ""
                                      }`}
                                      title="Détails "
                                    >
                                      <button>
                                        <span aria-hidden="true" className="fr-icon-file-text-line"></span>
                                      </button>
                                    </a>
                                  </>
                                )}
                                {!detailRow && (
                                  <>
                                    <a
                                      className="fr-raw-link"
                                      href={`/settings/users/${
                                        user.code
                                      }?page=${page}&itemsPerPage=${itemsPerPage}&key=${key}&institutionId=${institutionId}&roleId=${roleId}&profileId=${
                                        profileId || ""
                                      }`}
                                      title="Modifier"
                                    >
                                      <button>
                                        <span aria-hidden="true" className="fr-icon-pencil-line"></span>
                                      </button>
                                    </a>
                                    {data?.user?.idUser !== user.code && (
                                      <button aria-controls="fr-modal-2" data-fr-opened="false" title="Supprimer">
                                        <span aria-hidden="true" className="fr-icon-delete-line" onClick={() => setUserToDelete(user.code)}></span>
                                      </button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                            {userStatus === "Supprimé" && (
                              <Reactivate lastElementInPage={lastElementInPage} paginationData={paginationData} userCode={user.code} />
                            )}
                          </td>
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
      <ConfirmDeleteModal lastElementInPage={lastElementInPage} paginationData={paginationData} userCode={userToDelete} />
    </main>
  );
};
UsersListPage.defaultProps = {
  status: "",
};

export default UsersListPage;
