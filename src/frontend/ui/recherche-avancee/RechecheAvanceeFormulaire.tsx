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

  const getWording = (defValue: string) => {
    if (wording.ZONE_GEOGRAPHIQUE === defValue) {
      return rechercheAvanceeContext?.zoneGeo ? rechercheAvanceeContext?.zoneGeo : wording.ZONE_GEOGRAPHIQUE;
    }
    if (wording.STRUCTURE === defValue) {
      var structureWording = wording.STRUCTURE;
      structureWording = rechercheAvanceeContext?.typeStructure ? structureWording + ":" + rechercheAvanceeContext.typeStructure : structureWording;
      if (rechercheAvanceeContext?.statutJuridiqueStructure && rechercheAvanceeContext?.statutJuridiqueStructure.length > 0) {
        structureWording += ",+" + (rechercheAvanceeContext.statutJuridiqueStructure.length - 1);
      }
      return structureWording;
    }
    if (wording.CAPACITE === defValue) {
      var capaciterWording = wording.CAPACITE;
      if (rechercheAvanceeContext?.capaciteMedicoSociaux || rechercheAvanceeContext?.capaciteHandicap || rechercheAvanceeContext?.capaciteAgees) {
        var allCapacities = [
          ...rechercheAvanceeContext.capaciteMedicoSociaux,
          ...rechercheAvanceeContext.capaciteHandicap,
          ...rechercheAvanceeContext.capaciteAgees,
        ];
        if (allCapacities.length > 0) {
          capaciterWording += ":" + allCapacities[0].replace(",", "-");
          if (allCapacities.length > 1) {
            capaciterWording += ",+" + (allCapacities.length - 1);
          }
        }
      }
      return capaciterWording;
    }
    return defValue;
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
            {getWording(wording.ZONE_GEOGRAPHIQUE)}
          </button>
          <button
            aria-controls="fr-modal-Structure-Filtre"
            className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary"
            data-fr-opened="false"
          >
            {getWording(wording.STRUCTURE)}
          </button>
          <button
            aria-controls="fr-modal-Capacite-Filtre"
            className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary"
            data-fr-opened="false"
            disabled={disableCapaciter}
          >
            {getWording(wording.CAPACITE)}
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
