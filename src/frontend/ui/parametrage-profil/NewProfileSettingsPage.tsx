/* eslint-disable jsx-a11y/label-has-associated-control */
import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useState } from "react";

// TODO get Default Profile from database
import { DefaultProfile } from "../../configuration/DefaultProfile";
import { useDependencies } from "../commun/contexts/useDependencies";
import { ProfileTable } from "./ParamatrageTable";
import styles from "./ParametrageProfil.module.css";

export const NewProfileSettingsPage = () => {
    const { wording } = useDependencies();
    const [profileLabel, setProfileLabel] = useState("");

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.PARAMETRAGE_NEW_PROFILE}</h1>
            <div className="fr-grid-row fr-grid-row--center fr-mt-5w">
                <div className="fr-col-12 fr-col-md-3">
                    <label className="fr-label">
                        libellé de profil
                    </label>
                </div>
                <div className="fr-col-11 fr-col-md-3">
                    <input
                        className="fr-input"
                        onChange={(event) => setProfileLabel(event.target.value)}
                        required
                        value={profileLabel}
                    />
                </div>
            </div>
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                <ProfileTable codeValue={profileLabel} creating profileValue={DefaultProfile} />
            </div>
        </main >
    );
};