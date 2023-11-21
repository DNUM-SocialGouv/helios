"use client";

import "@gouvfr/dsfr/dist/component/table/table.min.css";

import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { useQueryState, parseAsInteger, parseAsString } from "next-usequerystate";
import { useState } from "react";

import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { PaginationBtn } from "./PaginationBtn/PaginationBtn";
import styles from "./UsersListPage.module.css";
import { KeyWordFilter } from "./KeyWordFilter/KeyWordFilter";

type UsersListPageProps = Readonly<{
  users: {
    data: UtilisateurModel[];
    total: number;
    currentPage: number;
    keyWord: string;
    lastPage: number;
  };
  keyWord: string;
}>;

export const UsersListPage = ({ users, keyWord }: UsersListPageProps) => {
  const [userData, setUserData] = useState(users.data);

  const [key, setKey] = useQueryState("key", parseAsString.withDefault(keyWord));

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(users.currentPage));

  const { wording } = useDependencies();

  const Roles = ["Admin National", "Admin Regional", "Utilisateur"];
  const Profiles = [
    { profil_label: "Utilisateur lambda", profil_code: "f998021c-9613-4978-be6a-2b4cd9e24ffb" },
    { profil_label: "Equipe projet", profil_code: "4bbf1e31-180a-4d29-9973-54459dc3087d" },
  ];

  const Institutions = [
    { inst_code_geo: "84", inst_libelle: "ARS Auvergne-Rhône-Alpes", inst_code: "ARS_84" },
    { inst_code_geo: "27", inst_libelle: "ARS Bourgogne-Franche-Comté", inst_code: "ARS_27" },
    { inst_code_geo: "53", inst_libelle: "ARS Bretagne", inst_code: "ARS_53" },
    { inst_code_geo: "24", inst_libelle: "ARS Centre-Val de Loire", inst_code: "ARS_24" },
    { inst_code_geo: "94", inst_libelle: "ARS Corse", inst_code: "ARS_94" },
    { inst_code_geo: "44", inst_libelle: "ARS Grand Est", inst_code: "ARS_44" },
    { inst_code_geo: "1", inst_libelle: "ARS Guadeloupe", inst_code: "ARS_01" },
    { inst_code_geo: "3", inst_libelle: "ARS Guyane", inst_code: "ARS_03" },
    { inst_code_geo: "32", inst_libelle: "ARS Hauts-de-France", inst_code: "ARS_32" },
    { inst_code_geo: "11", inst_libelle: "ARS Île-de-France", inst_code: "ARS_11" },
    { inst_code_geo: "4", inst_libelle: "ARS La Réunion", inst_code: "ARS_04" },
    { inst_code_geo: "2", inst_libelle: "ARS Martinique", inst_code: "ARS_02" },
    { inst_code_geo: "6", inst_libelle: "ARS Mayotte", inst_code: "ARS_06" },
    { inst_code_geo: "28", inst_libelle: "ARS Normandie", inst_code: "ARS_28" },
    { inst_code_geo: "75", inst_libelle: "ARS Nouvelle-Aquitaine", inst_code: "ARS_75" },
    { inst_code_geo: "76", inst_libelle: "ARS Occitanie", inst_code: "ARS_76" },
    { inst_code_geo: "52", inst_libelle: "ARS Pays de la Loire", inst_code: "ARS_52" },
    { inst_code_geo: "93", inst_libelle: "ARS Provence-Alpes-Côte d`Azur", inst_code: "ARS_93" },
    { inst_code_geo: "0", inst_libelle: "DNUM (SCN)", inst_code: "SCN" },
    { inst_code_geo: "75", inst_libelle: "CAT-AMANIA", inst_code: "CAT" },
    { inst_code_geo: "44", inst_libelle: "TEST", inst_code: "TEST" },
  ];

  return (
    <main className="fr-container">
      {userData && (
        <>
          <h1 className={styles["title"]}>{wording.PAGE_UTILISATEUR_TITRE}</h1>
          <br />

          <div className={styles["filtres-big-container"]}>
            <div className={styles["filtres-container"]}>
              <KeyWordFilter keyWord={key} setKey={setKey} setUserData={setUserData} setPage={setPage} />
              <button aria-controls="accordion-106" aria-expanded="false" className={`fr-accordion__btn fr-mt-2v fr-btn ${styles["btn-filtre"]}`}>
                Filtre
              </button>
            </div>

            <section className="fr-accordion">
              <div className={`fr-collapse  ${styles["collapseBox"]}`} id="accordion-106">
                <div className={`${styles["filtre_details"]}`}>
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="select-hint">
                      Role
                    </label>
                    <select className="fr-select" id="select-hint" name="select-hint">
                      <option disabled hidden selected value="">
                        Selectionnez une option
                      </option>
                      <option value="1">Admin National</option>
                      <option value="2">Admin Regional</option>
                      <option value="3">Utilisateur</option>
                    </select>
                  </div>

                  <div className="fr-select-group fr-mt-3w">
                    <label className="fr-label" htmlFor="select-hint">
                      Profil
                    </label>
                    <select className="fr-select" id="select-hint" name="select-hint">
                      <option disabled hidden selected value="">
                        Selectionnez une option
                      </option>
                      <option value="1">Utilisateur lambda</option>
                      <option value="2">Equipe projet</option>
                    </select>
                  </div>

                  <div className="fr-select-group fr-mt-3w">
                    <label className="fr-label" htmlFor="select-hint">
                      Institution
                    </label>
                    <select className="fr-select" id="select-hint" name="select-hint">
                      <option disabled hidden selected value="">
                        Selectionnez une option
                      </option>

                      {Institutions.map((item) => (
                        <option key={item.inst_code} value={item.inst_code}>
                          {item.inst_libelle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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

                      <th scope="col">{wording.ROLE_}</th>
                      <th scope="col">{wording.INSTITUTION}</th>
                      <th scope="col">{wording.PROFILE}</th>
                      <th scope="col">{wording.CREATION_DATE}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((user: any) => {
                      const roleClass = user.roleId === "1" ? "error" : user.roleId === "2" ? "success" : "info";

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

                          <td>
                            <span className={`fr-badge fr-badge--${roleClass} fr-badge--no-icon ${styles["text_no_change"]}`}>{Roles[user.roleId - 1]}</span>
                          </td>

                          <td className={styles["widthTD-small"]}>
                            {Institutions.filter((item) => item.inst_code_geo === user.institution2)[0]?.inst_libelle || "ARS Guyane"}
                          </td>

                          <td>
                            {user.profils.map((profil: string) => {
                              const pr = Profiles.filter((item) => item.profil_code === profil);
                              return (
                                <div key={pr[0].profil_code}>
                                  <span
                                    className={`fr-badge fr-badge--${
                                      pr[0].profil_code === "f998021c-9613-4978-be6a-2b4cd9e24ffb" ? "info" : "error"
                                    } fr-badge--no-icon ${styles["text_no_change"]}`}
                                  >
                                    {pr[0].profil_label}
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
                <PaginationBtn lastPage={users.lastPage} page={page as number} setPage={setPage} setUserData={setUserData} total={users.total} keyWord={key} />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};
