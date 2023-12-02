"use client";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";

import { useSession } from "next-auth/react";
import { useQueryState, parseAsInteger, parseAsString } from "next-usequerystate";
import { useState } from "react";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
//import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal/ConfirmDeleteModal";
import { AdvancedFilter } from "./Filter/AdvancedFilter/AdvancedFilter";
import { ItemsPerPage } from "./Pagination/ItemsPerPage/ItemsPerPage";
import { PaginationBtn } from "./Pagination/PaginationBtn/PaginationBtn";
import styles from "./UsersListPage.module.css";

export interface iPaginationData {
  institutionId: number;
  institutions: InstitutionModel[];
  keyWord: string;
  page: number;
  profileId: string;
  profiles: ProfilModel[];
  roleId: number;
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
  status: string;
  lastElementInPage: boolean;
  itemsPerPageValue: number;
}>;

export const UsersListPage = ({
  users,
  keyWord,
  institutions,
  profiles,
  roles,
  institution,
  profile,
  role,
  status,
  lastElementInPage,
  itemsPerPageValue,
}: UsersListPageProps) => {
  const { data } = useSession();

  const [userData, setUserData] = useState<UtilisateurModel[]>(users.data);
  const [total, setTotal] = useState(users.total);
  const [lastPage, setLastPage] = useState(users.lastPage);

  const [key, setKey] = useQueryState<string>("key", parseAsString.withDefault(keyWord));
  const [institutionId, setInstitutionId] = useQueryState("institutionId", parseAsInteger.withDefault(institution));
  const [roleId, setRoleId] = useQueryState("roleId", parseAsInteger.withDefault(role));
  const [profileId, setProfileId] = useQueryState("profileId", parseAsString.withDefault(profile));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(users.currentPage));
  const [statusCode] = useQueryState("status", parseAsString.withDefault(status));
  const [userToDelete, setUserToDelete] = useState("");
  const [itemsPerPage, setItemsPerPage] = useQueryState("itemsPerPage", parseAsInteger.withDefault(itemsPerPageValue));

  const { wording } = useDependencies();

  const paginationData: iPaginationData = {
    institutionId: institutionId,
    institutions: institutions,
    keyWord: key,
    page: page as number,
    profileId: profileId,
    profiles: profiles,
    roleId: roleId,
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
            <AdvancedFilter adminNational={(data?.user?.role as unknown as number) === 1} paginationData={paginationData} />
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
                      <th className={styles["widthTD-small"]} scope="col">
                        {wording.EMAIL}
                      </th>

                      <th scope="col">{wording.INSTITUTION}</th>
                      <th scope="col">{wording.ROLE_}</th>
                      <th scope="col">Profils</th>
                      {/*<th className={styles["widthTD-date"]} scope="col">
                        {wording.CREATION_DATE}
                      </th>*/}
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((user: any) => {
                      const roleClass = user.role.id === 1 ? "error" : user.role.id === 2 ? "success" : "info";

                      return (
                        <tr key={user.id}>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.prenom}
                            </a>
                          </td>
                          <td className={styles["widthTD-small"]}>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              {user.nom}
                            </a>
                          </td>
                          <td className={styles["widthTD-small"]}>{user.email}</td>

                          <td className={styles["widthTD-small"]}>{user.institution.libelle}</td>

                          <td>
                            <span
                              className={`fr-badge fr-badge--${roleClass} fr-badge--no-icon ${styles["text_no_change"]} ${styles["widthTD-role"]}  fr-text--xs`}
                            >
                              {user.role.libelle}
                            </span>
                          </td>

                          <td>
                            {user.profils.map((profil: string) => {
                              const pr = profiles.filter((item) => item.code === profil);
                              return (
                                <div key={pr[0].code}>
                                  <span
                                    className={`fr-badge fr-badge--${
                                      pr[0].code === "f998021c-9613-4978-be6a-2b4cd9e24ffb" ? "info" : "error"
                                    } fr-badge--no-icon ${styles["text_no_change"]} ${styles["widthTD-profil"]}  fr-text--xs  `}
                                  >
                                    {pr[0].label}
                                  </span>
                                </div>
                              );
                            })}
                          </td>
                          {/*<td className={styles["widthTD-date"]}>{formatDateAndHours(user.dateCreation)}</td>*/}
                          <td>
                            <a className="fr-raw-link" href={`/settings/users/${user.code}`}>
                              <button>
                                <span aria-hidden="true" className="fr-icon-pencil-line"></span>
                              </button>
                            </a>

                            <button aria-controls="fr-modal-2" data-fr-opened="false">
                              <span aria-hidden="true" className="fr-icon-delete-line" onClick={() => setUserToDelete(user.code)}></span>
                            </button>
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
