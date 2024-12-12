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
}>;

export const RechercheAvanceeFormulaire = ({ lancerLaRecherche, rechercheOnChange }: RechercheAvanceeFormulaireProps) => {
  const { wording } = useDependencies();
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
  const [disableCapaciter, setDisableCapaciter] = useState<boolean>(false);
  const listTypes = [AttribuesDefaults.entiteJuridque, AttribuesDefaults.etablissementSanitaire];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Empêcher l'envoi du formulaire ou autres comportements
        document.getElementById("recherche-terme-botton")?.click();
      }
    };

    // Ajouter l'écouteur d'événement pour "Enter"
    document.addEventListener("keydown", handleKeyDown);

    // Nettoyer l'écouteur quand le modal est fermé
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [rechercheAvanceeContext?.terme]);

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
      return rechercheAvanceeContext?.zoneGeoLabel ? rechercheAvanceeContext.zoneGeoLabel : wording.ZONE_GEOGRAPHIQUE;
    }
    if (wording.STRUCTURE === defValue) {
      let structureWording = wording.STRUCTURE;
      if (AttribuesDefaults.entiteJuridque === rechercheAvanceeContext?.typeStructure) {
        structureWording += " : Etablissements Juridiques";
      }
      if (AttribuesDefaults.etablissementSanitaire === rechercheAvanceeContext?.typeStructure) {
        structureWording += " : Etablissements Sanitaires";
      }
      if (AttribuesDefaults.etablissementMedicoSocial === rechercheAvanceeContext?.typeStructure) {
        structureWording += " : Etablissements SMS";
      }
      if (rechercheAvanceeContext?.statutJuridiqueStructure && rechercheAvanceeContext?.statutJuridiqueStructure.length > 0) {
        structureWording += ", +" + rechercheAvanceeContext.statutJuridiqueStructure.length;
      }
      return structureWording;
    }
    if (wording.CAPACITE === defValue) {
      let capaciterWording = wording.CAPACITE;
      if (rechercheAvanceeContext?.capaciteMedicoSociaux || rechercheAvanceeContext?.capaciteHandicap || rechercheAvanceeContext?.capaciteAgees) {
        const allCapacities = [
          ...rechercheAvanceeContext.capaciteMedicoSociaux,
          ...rechercheAvanceeContext.capaciteHandicap,
          ...rechercheAvanceeContext.capaciteAgees,
        ];
        if (allCapacities.length > 0) {
          capaciterWording += " : " + ajusteementLibelleCapacite(allCapacities[0]);
          if (allCapacities.length > 1) {
            capaciterWording += ", +" + (allCapacities.length - 1);
          }
        }
      }
      return capaciterWording;
    }
    return defValue;
  };

  const ajusteementLibelleCapacite = (str: string): string => {
    return str.includes(">") ? +str.replace(">", "") + 1 + " et plus" : str.replace(",", "-");
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
            placeholder="Rechercher un numéro FINESS ou le nom d'un établissement"
            type="search"
            value={rechercheAvanceeContext?.terme}
          />
          <button className="fr-btn" id="recherche-terme-botton" onClick={lancerLaRecherche} title="Rechercher" type="button">
            {wording.RECHERCHE_LABEL}
          </button>
        </form>
      </div>
      <div className="fr-grid-row fr-mt-2w">
        <div className={styles["criteresRechercheButtons"]}>
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
