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
  const [emptyLabelError, setEmptyLabelError] = useState(false);

  const inputId = "profile-label";

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
          <div className={"fr-input-group" + (emptyLabelError ? " fr-input-group--error" : "")}>
            <input
              aria-describedby={emptyLabelError ? `${inputId}-error` : undefined}
              aria-invalid={emptyLabelError}
              className="fr-input"
              id={inputId}
              onChange={(event) => {
                setProfileLabel(event.target.value);
                setEmptyLabelError(event.target.value.trim() === "");
              }
              }
              required
              value={profileLabel}
            />
            {emptyLabelError && (
              <p className="fr-error-text" id={`${inputId}-error`}>
                {wording.NEW_PROFILE_LABEL_MANDATORY}
              </p>
            )}
          </div>

        </div>
      </div>
      <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
        <ProfileTable codeValue={profileLabel} creating name={profileLabel} onEmptyLabel={() => setEmptyLabelError(true)} profileValue={DefaultProfile} />
      </div>
    </main >
  );
};
