import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./SearchHistory.module.css";

export const SearchHistoryPage = () => {
    const { wording } = useDependencies();

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.HISTORIQUE_DE_RECHERECHE_TITRE}</h1>
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">{wording.ETABLISSEMENT_CONSULTE}</th>
                            <th scope="col">{wording.DATE}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{wording.ETABLISSEMENT_CONSULTE}</td>
                            <td>{wording.DATE}</td>
                        </tr>
                        <tr>
                            <td>{wording.ETABLISSEMENT_CONSULTE}</td>
                            <td>{wording.DATE}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
};