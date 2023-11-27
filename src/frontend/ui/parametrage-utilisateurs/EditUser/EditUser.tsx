import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/pagination/pagination.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import styles from "./EditUser.module.css";

type UsersListPageProps = Readonly<{
  users: UtilisateurModel;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
}>;

export const EditUser = ({ user, institutions, profiles, roles }: UsersListPageProps) => {
  const [userinfo, setUserInfo] = useState({
    profiles: [...user.profils],
  });

  const { wording } = useDependencies();
  const { push } = useRouter();

  const handleChange = (e) => {
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

  const handleChangeReset = (e) => {
    setUserInfo({
      profiles: [...user.profils],
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const { profiles } = userinfo;
    const { institutionId, roleId } = e.target.elements;

    fetch("/api/utilisateurs/update", {
      body: JSON.stringify({ institutionCode: institutionId.value, roleCode: roleId.value, profilsCode: profiles }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((user) => {
      console.log("user changed  ", user);
      push("/settings/users?status=edit_successfully");
    });
  }

  return (
    <main className="fr-container">
      {user && (
        <>
          <h1 className={styles["title"]}>{wording.PAGE_EDIT_UTILISATEUR_TITRE}</h1>
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
                <div className={styles["label-field"]}>{wording.CREATION_DATE} : </div> {formatDateAndHours(user.dateCreation)}
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fr-select-group fr-mt-3w">
                <label className="fr-label" htmlFor="institutionId">
                  Institution
                </label>
                <select className="fr-select" id="institutionId" name="institutionId">
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
                <select className="fr-select" id="roleId" name="roleId">
                  <option disabled hidden selected value="">
                    Selectionnez une option
                  </option>
                  {roles.map((item) => (
                    <option key={item.id} selected={user.roleId === item.id} value={item.code}>
                      {item.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fr-select-group fr-mt-3w">
                <label className={`fr-label ${userinfo.profiles.length === 0 ? styles["fr-fieldset--error"] : ""}`} htmlFor="select-hint">
                  Profils
                </label>
                <div className={styles["boxSelect"]}>
                  {profiles.map((item) => (
                    <div
                      className={`fr-fieldset__element fr-mt-2w ${styles["boxItem"]} ${userinfo.profiles.length === 0 ? styles["fr-fieldset--error"] : ""}`}
                      key={item.code}
                    >
                      <div className="fr-checkbox-group">
                        <input
                          className={`${styles["input--checkbox--error"]} `}
                          aria-describedby={`checkboxes-${item.code}-messages`}
                          id={`${item.code}`}
                          name="profiles"
                          onChange={handleChange}
                          value={`${item.code}`}
                          type="checkbox"
                          checked={userinfo.profiles && userinfo.profiles.includes(item.code)}
                        />
                        <label className="fr-label" htmlFor={`${item.code}`}>
                          {item.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {userinfo.profiles.length === 0 && (
                  <div className={` fr-mt-2w fr-messages-group  ${styles["fr-fieldset--error"]}`} id="checkboxes-error-messages" aria-live="assertive">
                    <p className={` fr-message fr-message--error ${styles["fr-fieldset--error"]}`} id="checkboxes-error-message-error">
                      Champ obligatoire
                    </p>
                  </div>
                )}
              </div>

              <div className={styles["btnForm"]}>
                <button className="fr-mt-7v fr-mr-7v fr-btn" onClick={handleChangeReset} type="reset">
                  Annuler
                </button>
                <button className="fr-mt-7v fr-btn " disabled={userinfo.profiles.length === 0} type="submit">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </main>
  );
};
