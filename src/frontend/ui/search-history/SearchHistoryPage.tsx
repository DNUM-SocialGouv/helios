import "@gouvfr/dsfr/dist/component/table/table.min.css";

import { ResultatRechercheHistorique } from "../../../backend/métier/entities/ResultatHistorique";
import { formatDateAndHours } from "../../utils/dateUtils";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./SearchHistory.module.css";

interface SearchHistoryProps {
    searchHistory : ResultatRechercheHistorique[];
}

export const SearchHistoryPage = ({searchHistory}: SearchHistoryProps ) => {
    const { wording } = useDependencies();
 

    const buildLink = (history: any) => {
        if (history.type === "Médico-social") {
            return "/etablissement-territorial-medico-social/" + history.finessNumber;
        } else if (history.type === "Sanitaire") {
            return "/etablissement-territorial-sanitaire/" + history.finessNumber;
        }
        return "/entite-juridique/" + history.finessNumber;
    };

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.HISTORIQUE_DE_RECHERECHE_TITRE}</h1>
            {searchHistory?.length === 0 ? (<div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucune ancienne recherche</div>) : (
                <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">{wording.ETABLISSEMENT_CONSULTE}</th>
                                <th scope="col">{wording.DATE}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchHistory.map((elt) => (
                                <tr key={elt.finessNumber}>
                                    <td>
                                        <a className="fr-raw-link" href={buildLink(elt)}>
                                            {elt.title}
                                        </a></td>
                                    <td>{formatDateAndHours(elt.date)}</td>
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