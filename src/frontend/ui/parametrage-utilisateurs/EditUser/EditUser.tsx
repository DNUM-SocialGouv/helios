"use client";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/pagination/pagination.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { useBreadcrumb } from "../../commun/hooks/useBreadcrumb";
import ConfirmDeleteModalEditPage from "../UsersListPage/ConfirmDeleteModal/ConfirmDeleteModalEditPage";
import styles from "./EditUser.module.css";

type UsersListPageProps = Readonly<{
  user: UtilisateurModel;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
}>;

export const EditUser = ({ user, institutions, profiles, roles }: UsersListPageProps) => {
  const { data } = useSession();

  const searchParams = useSearchParams();

  const [firstname, setFirstname] = useState(user.prenom);
  const [lastname, setLastname] = useState(user.nom);

  const [userinfo, setUserInfo] = useState({
    profiles: [...user.profils],
  });

  const { push } = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const { profiles } = userinfo;

    if (checked) {
      setUserInfo({
        profiles: [...profiles, value],
      });
    } else {
      setUserInfo({
        profiles: profiles.filter((e) => e !== value),
      });
    }
  };

  const redirectPage = (url: string, getOnly = false) => {
    let queryParams = "?";
    if (url.includes("?")) {
      queryParams = "&";
    }
    if (searchParams.get("page")) {
      queryParams += "page=" + searchParams.get("page");
    }
    if (searchParams.get("itemsPerPage")) {
      queryParams += "&itemsPerPage=" + searchParams.get("itemsPerPage");
    }
    if (searchParams.get("key")) {
      queryParams += "&key=" + searchParams.get("key");
    }
    if (parseInt(searchParams.get("institutionId") as string) > 0) {
      queryParams += "&institutionId=" + searchParams.get("institutionId");
    }
    if (parseInt(searchParams.get("roleId") as string) > 0) {
      queryParams += "&roleId=" + searchParams.get("roleId");
    }
    if (searchParams.get("profileId")) {
      queryParams += "&profileId=" + searchParams.get("profileId");
    }
    if (searchParams.get("etatId")) {
      queryParams += "&etatId=" + searchParams.get("etatId");
    }
    if (getOnly) {
      return url + queryParams;
    } else {
      push(url + queryParams);
      return url + queryParams;
    }
  };

  const { wording } = useDependencies();
  useBreadcrumb([
    {
      label: wording.PAGE_UTILISATEUR_TITRE,
      path: redirectPage("/settings/users", true),
    },
    {
      label: `${user.prenom} ${user.nom}`,
      path: "",
    },
  ]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { profiles } = userinfo;
    // @ts-ignore
    const { institutionId, roleId } = e.target.elements;

    fetch("/api/utilisateurs/update", {
      body: JSON.stringify({
        userCode: user.code,
        institutionCode: institutionId.value,
        roleCode: roleId.value,
        profilsCode: profiles,
        firstname: firstname,
        lastname: lastname,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then(() => {
      redirectPage("/settings/users?status=edit_successfully");
    });
  }
  //only "Admin national" can update it self || Admin regional cant update, delete, to (Admin National)
  const pageDetails =
    (data?.user?.idUser === user.code && data?.user?.role !== 1) || ((data?.user?.role as number) > parseInt(user.roleId) && data?.user?.idUser !== user.code);

  let rolesF = roles;
  if (pageDetails) {
    rolesF = roles;
  } else {
    rolesF = roles.filter((obj) => obj.code !== "ADMIN_NAT");
  }

  return (
    <main className="fr-container">
      {user && (
        <>
          <h1 className={styles["title"]}>
            {user.prenom} {user.nom}
          </h1>
          <br />
          <div>
            <div className="fr-mb-2w">
              <div className="fr-input-group">
                <label className={`fr-label ${firstname.length === 0 ? styles["fr-fieldset--error"] : ""}`} htmlFor="input-firstname">
                  Prénom
                </label>
                <input
                  className="fr-input fr-mb-1w"
                  disabled={pageDetails}
                  id="input-firstname"
                  name="firstname"
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  value={firstname}
                />
              </div>

              {firstname.length === 0 && (
                <div aria-live="assertive" className={`fr-messages-group ${styles["fr-fieldset--error"]}`} id="name-1-fieldset-messages">
                  Champ obligatoire
                </div>
              )}
            </div>
            <div className="fr-mb-2w">
              <div className="fr-input-group">
                <label className={`fr-label ${lastname.length === 0 ? styles["fr-fieldset--error"] : ""}`} htmlFor="input-lastname">
                  Nom
                </label>
                <input
                  className="fr-input fr-mb-1w"
                  disabled={pageDetails}
                  id="input-lastname"
                  name="lastname"
                  onChange={(e) => setLastname(e.target.value)}
                  type="text"
                  value={lastname}
                />
              </div>
              {lastname.length === 0 && (
                <div aria-live="assertive" className={`fr-messages-group ${styles["fr-fieldset--error"]}`} id="name-1-fieldset-messages">
                  Champ obligatoire
                </div>
              )}
            </div>

            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.EMAIL} : </div>
                {user.email}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.CREATION_DATE} : </div>
                {formatDateAndHours(user.dateCreation.toString())}
              </label>
            </div>

            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>Date de dernière modification : </div>
                {user.dateModification && formatDateAndHours(user.dateModification.toString())}
              </label>
            </div>

            {/*<div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>Date de dernière connexion : </div>
                {user.lastConnectionDate && formatDateAndHours(user.lastConnectionDate.toString())}
              </label>
            </div>*/}

            <form onSubmit={handleSubmit}>
              <div className="fr-select-group fr-mt-3w">
                <label className="fr-label" htmlFor="institutionId">
                  Institution
                </label>
                <select className="fr-select" disabled={pageDetails} id="institutionId" name="institutionId">
                  <option disabled hidden selected value="">
                    Selectionnez une option
                  </option>

                  {institutions &&
                    institutions.map((item) => (
                      <option key={item.id} selected={user.institutionId === item.id} value={item.code}>
                        {item.libelle}
                      </option>
                    ))}
                </select>
              </div>
              <div className="fr-select-group fr-mt-3w">
                <label className="fr-label" htmlFor="roleId">
                  Rôle
                </label>
                <select className="fr-select" disabled={pageDetails} id="roleId" name="roleId">
                  <option disabled hidden selected value="">
                    Selectionnez une option
                  </option>
                  {rolesF &&
                    rolesF.map((item) => (
                      <option key={item.id} selected={parseInt(user.roleId) === item.id} value={item.code}>
                        {item.libelle}
                      </option>
                    ))}
                </select>
              </div>
              <div className="fr-select-group fr-mt-3w">
                <label className={`fr-label ${userinfo.profiles.length === 0 ? styles["fr-fieldset--error"] : ""}`} htmlFor="select-hint">
                  Autorisations
                </label>
                <div className={styles["boxSelect"]}>
                  {profiles &&
                    profiles.map((item) => (
                      <div
                        className={`fr-fieldset__element fr-mt-2w ${styles["boxItem"]} ${userinfo.profiles.length === 0 ? styles["fr-fieldset--error"] : ""}`}
                        key={item.code}
                      >
                        <div className="fr-checkbox-group">
                          <input
                            aria-describedby={`checkboxes-${item.code}-messages`}
                            checked={userinfo.profiles && userinfo.profiles.includes(item.code)}
                            className={`${styles["input--checkbox--error"]} `}
                            disabled={pageDetails || (item.label === "Consultation administrateur national" && data?.user?.role !== 1)}
                            id={`${item.code}`}
                            name="profiles"
                            onChange={handleChange}
                            type="checkbox"
                            value={`${item.code}`}
                          />
                          <label className="fr-label" htmlFor={`${item.code}`}>
                            {item.label}
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
                {userinfo.profiles.length === 0 && (
                  <div aria-live="assertive" className={` fr-mt-2w fr-messages-group  ${styles["fr-fieldset--error"]}`} id="checkboxes-error-messages">
                    <p className={` fr-message fr-message--error ${styles["fr-fieldset--error"]}`} id="checkboxes-error-message-error">
                      Champ obligatoire
                    </p>
                  </div>
                )}
              </div>

              <div className="fr-mt-7v">
                {pageDetails && (
                  <button
                    className="fr-btn "
                    onClick={() => {
                      redirectPage("/settings/users");
                    }}
                    type="button"
                  >
                    Retour
                  </button>
                )}
                {!pageDetails && (
                  <>
                    {data?.user?.idUser !== user.code && (
                      <button aria-controls="fr-modal-2" className="fr-btn" data-fr-opened="false" title="Supprimer" type="button">
                        Supprimer
                      </button>
                    )}

                    <button
                      className={`fr-btn ${styles["float-right"]}`}
                      disabled={userinfo.profiles.length === 0 || firstname.length === 0 || lastname.length === 0}
                      type="submit"
                    >
                      Sauvegarder
                    </button>

                    <button
                      className={`fr-mr-7v fr-btn ${styles["float-right"]}`}
                      onClick={() => {
                        redirectPage("/settings/users");
                      }}
                      type="button"
                    >
                      Annuler
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </>
      )}
      <ConfirmDeleteModalEditPage redirectPage={redirectPage} userCode={user.code} />
    </main>
  );
};
