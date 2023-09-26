import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useContext, useEffect } from "react";

import { formatDateAndHours } from "../../utils/dateUtils";
import { ProfileContext } from "../commun/contexts/ProfilContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Parametrage.module.css";
import { useParametrage } from "./useParametrage";

export const ParametragePage = () => {
    const { wording } = useDependencies();
    const profileContext = useContext(ProfileContext);

    const { getAllProfiles } = useParametrage();

    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.PARAMETRAGE_TITRE}</h1>
            {profileContext?.profiles.length === 0 ? (<div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucun profil</div>) : (
                <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">{wording.PROFILE}</th>
                                <th scope="col">{wording.CREATION_DATE}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profileContext?.profiles.map((profile: any) => (
                                <tr key={profile.id}>
                                    <td>
                                        <a className="fr-raw-link" href={`/parametrage/${profile.code}`}>
                                            {profile.label}
                                        </a></td>
                                    <td>{formatDateAndHours(profile.dateCreation)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </main >
    );
};