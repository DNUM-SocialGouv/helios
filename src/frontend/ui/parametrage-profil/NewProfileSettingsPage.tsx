/* eslint-disable jsx-a11y/label-has-associated-control */
import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useState } from "react";

// TODO get Default Profile from database
import { ProfileTable } from "./ParamatrageTable";
import styles from "./ParametrageProfil.module.css";
import { DefaultProfile } from "../../configuration/DefaultProfile";
import { useDependencies } from "../commun/contexts/useDependencies";

export const NewProfileSettingsPage = () => {
  const { wording } = useDependencies();
  const [profileLabel, setProfileLabel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const inputId = "profile-label";

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileLabel(event.target.value);
    if (event.target.value.trim() === "") {
      setErrorMessage(wording.NEW_PROFILE_LABEL_MANDATORY);
    } else {
      setErrorMessage("");
    }
  };

  return (
    <main className="fr-container" id="content">
      <h1 className={styles["title"]}>{wording.PARAMETRAGE_NEW_PROFILE}</h1>
      <div className="fr-grid-row fr-grid-row--center fr-mt-5w">
        <div className="fr-col-12 fr-col-md-3">
          <label className="fr-label" htmlFor={inputId}>
            {wording.PROFILE_TITLE}
          </label>
        </div>
        <div className="fr-col-11 fr-col-md-3">
          <div className={"fr-input-group" + (errorMessage ? " fr-input-group--error" : "")}>
            <input
              aria-describedby={errorMessage ? `${inputId}-error` : undefined}
              aria-invalid={!!errorMessage}
              className="fr-input"
              id={inputId}
              onChange={onInputChange}
              required
              value={profileLabel}
            />
            {errorMessage && (
              <p className="fr-error-text" id={`${inputId}-error`}>
                {errorMessage}
              </p>
            )}
          </div>

        </div>
      </div>
      <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
        <ProfileTable codeValue={profileLabel} creating name={profileLabel} onError={setErrorMessage} profileValue={DefaultProfile} />
      </div>
    </main >
  );
};
