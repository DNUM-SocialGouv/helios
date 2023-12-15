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
import styles from "./EditUser.module.css";
import Link from "next/link";

type UsersListPageProps = Readonly<{
  user: UtilisateurModel;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
}>;

export const EditUser = ({ user, institutions, profiles, roles }: UsersListPageProps) => {
  const { data } = useSession();

  const searchParams = useSearchParams();

  const [userinfo, setUserInfo] = useState({
    profiles: [...user.profils],
  });

  const { wording } = useDependencies();
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

  const handleChangeReset = () => {
    setUserInfo({
      profiles: [...user.profils],
    });
  };

  const redirectPage = (url: string) => {
    let queryParams = "";
    if (searchParams.get("page")) {
      queryParams += "?page=" + searchParams.get("page");
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

    push(url + queryParams);
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { profiles } = userinfo;
    // @ts-ignore
    const { institutionId, roleId } = e.target.elements;

    fetch("/api/utilisateurs/update", {
      body: JSON.stringify({ userCode: user.code, institutionCode: institutionId.value, roleCode: roleId.value, profilsCode: profiles }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then(() => {
      redirectPage("/settings/users?status=edit_successfully&");
    });
  }
  const pageDetails = data?.user?.idUser === user.code && data?.user?.role !== 1;
  return (
    <main className="fr-container">
      {user && (
        <>
          <h1 className={styles["title"]}>{`${pageDetails ? "Détails" : "Modifier"} utilisateur`}</h1>
          <br />
          <div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.LASTNAME} : </div> {user.nom}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.FIRSTNAME} : </div> {user.prenom}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.EMAIL} : </div> {user.email}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.CREATION_DATE} : </div> {formatDateAndHours(user.dateCreation.toString())}
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fr-select-group fr-mt-3w">
                <label className="fr-label" htmlFor="institutionId">
                  Institution
                </label>
                <select className="fr-select" disabled={pageDetails} id="institutionId" name="institutionId">
                  <option disabled hidden selected value="">
                    Selectionnez une option
                  </option>

                  {institutions.map((item) => (
                    <option key={item.id} selected={user.institutionId === item.id} value={item.code}>
                      {item.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fr-select-group fr-mt-3w">
                <label className="fr-label" htmlFor="roleId">
                  Role
                </label>
                <select className="fr-select" disabled={pageDetails} id="roleId" name="roleId">
                  <option disabled hidden selected value="">
                    Selectionnez une option
                  </option>
                  {roles.map((item) => (
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
                  {profiles.map((item) => (
                    <div
                      className={`fr-fieldset__element fr-mt-2w ${styles["boxItem"]} ${userinfo.profiles.length === 0 ? styles["fr-fieldset--error"] : ""}`}
                      key={item.code}
                    >
                      <div className="fr-checkbox-group">
                        <input
                          aria-describedby={`checkboxes-${item.code}-messages`}
                          checked={userinfo.profiles && userinfo.profiles.includes(item.code)}
                          className={`${styles["input--checkbox--error"]} `}
                          disabled={pageDetails}
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

              <div className={styles["btnForm"]}>
                {pageDetails && (
                  <button
                    className="fr-mt-7v fr-btn "
                    onClick={() => {
                      redirectPage("/settings/users?");
                    }}
                    type="button"
                  >
                    Retour
                  </button>
                )}
                {!pageDetails && (
                  <>
                    <button className="fr-mt-7v fr-mr-7v fr-btn" onClick={handleChangeReset} type="reset">
                      Annuler
                    </button>
                    <button className="fr-mt-7v fr-btn " disabled={userinfo.profiles.length === 0} type="submit">
                      Sauvegarder
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </main>
  );
};
