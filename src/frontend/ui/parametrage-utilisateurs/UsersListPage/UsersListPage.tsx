"use client";

import "@gouvfr/dsfr/dist/component/table/table.min.css";

import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { useQueryState, parseAsInteger, parseAsString } from "next-usequerystate";
import { useState } from "react";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { AdvancedFilter } from "./Filter/AdvancedFilter/AdvancedFilter";
import { KeyWordFilter } from "./Filter/KeyWordFilter/KeyWordFilter";
import { PaginationBtn } from "./PaginationBtn/PaginationBtn";
import styles from "./UsersListPage.module.css";

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
  profile: number;
  role: string;
}>;

export const UsersListPage = ({ users, keyWord, institutions, profiles, roles, institution, profile, role }: UsersListPageProps) => {
  const [userData, setUserData] = useState(users.data);

  const [lastPage, setLastPage] = useState(users.lastPage);
  const [key, setKey] = useQueryState("key", parseAsString.withDefault(keyWord));
  const [institutionId, setInstitutionId] = useQueryState("institutionId", parseAsInteger.withDefault(institution));
  const [profileId, setProfileId] = useQueryState("profileId", parseAsInteger.withDefault(profile));
  const [roleId, setRoleId] = useQueryState("roleId", parseAsString.withDefault(role));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(users.currentPage));

  const { wording } = useDependencies();

  return (
    <main className="fr-container">
      {userData && (
        <>
          <h1 className={styles["title"]}>{wording.PAGE_UTILISATEUR_TITRE}</h1>
          <br />

          <div className={styles["filtres-big-container"]}>
            <div className={styles["filtres-container"]}>
              <KeyWordFilter keyWord={key} setKey={setKey} setLastPage={setLastPage} setPage={setPage} setUserData={setUserData} />
              <button aria-controls="accordion-106" aria-expanded="false" className={`fr-accordion__btn fr-mt-2v fr-btn ${styles["btn-filtre"]}`}>
                Filtre
              </button>
            </div>

            <section className="fr-accordion">
              <div className={`fr-collapse  ${styles["collapseBox"]}`} id="accordion-106">
                <AdvancedFilter
                  institutionId={institutionId}
                  institutions={institutions}
                  key={key}
                  page={page}
                  profileId={profileId}
                  profiles={profiles}
                  roleId={roleId}
                  roles={roles}
                  setInstitutionId={setInstitutionId}
                  setLastPage={setLastPage}
                  setPage={setPage}
                  setProfileId={setProfileId}
                  setRoleId={setRoleId}
                  setUserData={setUserData}
                />
              </div>
            </section>
          </div>

          {userData.length === 0 ? (
            <div className={"fr-mt-8w " + styles["align-text"]}>{wording.AUCUN_ELEMENT_TROUVE}</div>
          ) : (
            <div>
              <div className={"fr-table fr-table--blue-ecume fr-mt-3w " + styles["align"]}>
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
                      <th scope="col">{wording.PROFILE}</th>
                      <th scope="col">{wording.CREATION_DATE}</th>
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
                            <span className={`fr-badge fr-badge--${roleClass} fr-badge--no-icon ${styles["text_no_change"]}`}>{user.role.libelle}</span>
                          </td>

                          <td>
                            {user.profils.map((profil: string) => {
                              const pr = profiles.filter((item) => item.code === profil);
                              return (
                                <div key={pr[0].code}>
                                  <span
                                    className={`fr-badge fr-badge--${
                                      pr[0].code === "f998021c-9613-4978-be6a-2b4cd9e24ffb" ? "info" : "error"
                                    } fr-badge--no-icon ${styles["text_no_change"]}`}
                                  >
                                    {pr[0].label}
                                  </span>
                                </div>
                              );
                            })}
                          </td>
                          <td>{formatDateAndHours(user.dateCreation)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <PaginationBtn
                  keyWord={key}
                  lastPage={lastPage}
                  page={page as number}
                  setLastPage={setLastPage}
                  setPage={setPage}
                  setUserData={setUserData}
                  total={users.total}
                />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};
