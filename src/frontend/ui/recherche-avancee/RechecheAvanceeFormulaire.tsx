import { useDependencies } from "../commun/contexts/useDependencies";
import { FiltreZoneGeographique } from "./FiltreZoneGeographique";
import styles from "./RechercheAvanceeFormulaire.module.css"

export const RechercheAvanceeFormulaire = () => {
    const { wording } = useDependencies();

    return (
        <div>
            <div className="fr-grid-row">
                <form action="/recherche" className="fr-search-bar fr-col-5" id="search-540" role="search">
                    <label className="fr-label" htmlFor="recherche-avancee-input">
                        {wording.RECHERCHE_LABEL}
                    </label>
                    <input
                        className="fr-input"
                        id="recherche-avancee-input"
                        name="terme"
                        placeholder="Nom, Finess, etc."
                        type="search"
                    />
                    <button
                        className="fr-btn"
                        onClick={(event) => {
                            event.preventDefault();
                        }}
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