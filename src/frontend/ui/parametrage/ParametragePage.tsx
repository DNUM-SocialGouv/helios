import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Parametrage.module.css";


const profiles = [{
    name: "profile 1", id: "profile-1", createdAt: "21-09-2023"
}, {
    name: "profile 2", id: "profile-2", createdAt: "21-09-2023"
}, {
    name: "profile 3", id: "profile-3", createdAt: "21-09-2023"
}];

export const ParametragePage = () => {
    const { wording } = useDependencies();
    // const { getAllProfiles, profiles } = useParametrage();

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.PARAMETRAGE_TITRE}</h1>
            {profiles.length === 0 ? (<div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucun profil</div>) : (
                <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">{wording.PARAMETRAGE_PROFILE}</th>
                                <th scope="col">{wording.DATE}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (
                                <tr key={profile.id}>
                                    <td>
                                        <a className="fr-raw-link" href={`/parametrage/${profile.id}`}>
                                            {profile.id}
                                        </a></td>
                                    <td>{profile.createdAt}</td>
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