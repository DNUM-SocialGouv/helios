
import { ChangeEvent, MouseEvent } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { FiltreZoneGeographique } from "./FiltreZoneGeographique";
import styles from "./RechercheAvanceeFormulaire.module.css";

type RechercheAvanceeFormulaireProps = Readonly<{
    lancerLaRecherche: (event: MouseEvent<HTMLButtonElement>) => void
    rechercheOnChange: (event: ChangeEvent<HTMLInputElement>) => void
    terme: string
}>;

export const RechercheAvanceeFormulaire = ({ terme, lancerLaRecherche, rechercheOnChange }: RechercheAvanceeFormulaireProps) => {
    const { wording } = useDependencies();

    const [termeDeRecherche, setTermeDeRecherche] = useState("");

    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

    const rechercheTermeOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTermeDeRecherche(event.target.value);
    }

    const lancerLaRecherche = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setEstCeEnAttente(true);
        setEstCeQueLesRésultatsSontReçus(false);

        fetch("/api/recherche-avancee", {
            body: JSON.stringify({ page: 1, terme: termeDeRecherche, commune: rechercheAvanceeContext?.zoneGeo }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                setEstCeEnAttente(false);
                setEstCeQueLesRésultatsSontReçus(true);
                // eslint-disable-next-line no-console
                console.log("data", data);
            })
            .catch(() => {
                setEstCeEnAttente(false);
            });
    };

    return (
        <div>
            <div className="fr-grid-row">
                <form className="fr-search-bar fr-col-5" id="search-540" role="search">
                    <label className="fr-label" htmlFor="recherche-avancee-input">
                        {wording.RECHERCHE_LABEL}
                    </label>
                    <input
                        className="fr-input"
                        id="recherche-avancee-input"
                        name="terme"
                        onChange={rechercheOnChange}
                        placeholder="Nom, Finess, etc."
                        type="search"
                        value={terme}
                    />
                    <button
                        className="fr-btn"
                        onClick={lancerLaRecherche}
                        title="Rechercher"
                        type="submit"
                    >
                        {wording.RECHERCHE_LABEL}
                    </button>
                </form>
            </div>
            <div className="fr-grid-row fr-mt-2w">
                <div className={"fr-col-5 " + styles["criteresRechercheButtons"]}>
                    <button
                        aria-controls="fr-modal-Zone-Geographique-Filtre"
                        className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary"
                        data-fr-opened="false"
                    >
                        {wording.ZONE_GEOGRAPHIQUE}
                    </button>
                    <button className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary">
                        {wording.STRUCTURE}
                    </button>
                    <button className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary">
                        {wording.CAPACITE}
                    </button>
                </div>
            </div>
            <div>
                <FiltreZoneGeographique />
            </div>
        </div >
    );
};