import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { formatDateAndHours } from "../../utils/dateUtils";
import { ProfileContext } from "../commun/contexts/ProfilContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Parametrage.module.css";
import { useParametrage } from "./useParametrage";

export const ParametragePage = () => {
    const { wording } = useDependencies();
    const { data } = useSession();
    const profileContext = useContext(ProfileContext);
    const router = useRouter();
    const { getAllProfiles } = useParametrage();

    useEffect(() => {
        if (data?.user.idUser) {
            getAllProfiles(data.user.idUser);
        }
    }, [data]);

    return (
        <main className="fr-container">
            {profileContext?.profiles && (
                <>
                    <h1 className={styles["title"]}>{wording.PARAMETRAGE_TITRE}</h1>
                    <button className="fr-mt-2v fr-btn" onClick={() => {
                        router.push("/settings/add-profile");
                    }}>
                        Ajouter un profil
                    </button>

                    {profileContext?.profiles.length === 0 ? (<div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucun profil</div>) : (
                        <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">{wording.PROFILE}</th>
                                        <th scope="col">{wording.PROFILE_CODE}</th>
                                        <th scope="col">{wording.CREATION_DATE}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profileContext?.profiles.map((profile: any) => (
                                        <tr key={profile.id}>
                                            <td>
                                                <a className="fr-raw-link" href={`/settings/${profile.code}`}>
                                                    {profile.label}
                                                </a>
                                            </td>
                                            <td>
                                                {profile.code} <button className="fr-icon-clipboard-line" onClick={() => {
                                                    navigator.clipboard.writeText(profile.code);
                                                }} />
                                            </td>
                                            <td>{formatDateAndHours(profile.dateCreation)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                    }
                </>
            )}
        </main >
    );
};