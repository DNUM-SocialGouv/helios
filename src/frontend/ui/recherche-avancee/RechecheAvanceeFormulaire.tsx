import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";

import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { FiltreCapacite } from "./FiltreCapacite";
import { FiltreStructure } from "./FiltreStructure";
import { FiltreZoneGeographique } from "./FiltreZoneGeographique";
import { AttribuesDefaults } from "./model/Attribues";
import styles from "./RechercheAvanceeFormulaire.module.css";

type RechercheAvanceeFormulaireProps = Readonly<{
  lancerLaRecherche: (event: MouseEvent<HTMLButtonElement>) => void;
  rechercheOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  terme: string | undefined;
}>;

export const RechercheAvanceeFormulaire = ({ terme, lancerLaRecherche, rechercheOnChange }: RechercheAvanceeFormulaireProps) => {
  const { wording } = useDependencies();
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
  const [disableCapaciter, setDisableCapaciter] = useState<boolean>(false);
  const listTypes = [AttribuesDefaults.entiteJuridque, AttribuesDefaults.etablissementSanitaire];

  useEffect(() => {
    const structureType = rechercheAvanceeContext?.typeStructure ?? "";
    if (listTypes.includes(structureType, 0)) {
      setDisableCapaciter(true);
    } else {
      setDisableCapaciter(false);
    }
  }, [rechercheAvanceeContext?.typeStructure]);

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
          <button className="fr-btn" onClick={lancerLaRecherche} title="Rechercher" type="submit">
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
          <button
            aria-controls="fr-modal-Structure-Filtre"
            className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary"
            data-fr-opened="false"
          >
            {wording.STRUCTURE}
          </button>
          <button
            aria-controls="fr-modal-Capacite-Filtre"
            className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary"
            data-fr-opened="false"
            disabled={disableCapaciter}
          >
            {wording.CAPACITE}
          </button>
        </div>
      </div>
      <div>
        <FiltreZoneGeographique />
        <FiltreStructure />
        <FiltreCapacite />
      </div>
    </div>
  );
};
