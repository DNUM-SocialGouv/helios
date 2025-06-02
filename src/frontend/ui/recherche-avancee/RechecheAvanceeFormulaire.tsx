import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useState } from "react";

import { FiltreCapacite } from "./FiltreCapacite";
import { FiltreCategoriesFiness } from "./FiltreCategoriesFiness";
import { FiltreStructure } from "./FiltreStructure";
import { FiltreZoneGeographique } from "./FiltreZoneGeographique";
import { AttribuesDefaults, typeStructureTranscodage } from "./model/Attribues";
import { CategoriesFinessViewModel } from "./model/CategoriesFinessViewModel";
import styles from "./RechercheAvanceeFormulaire.module.css";
import { ComparaisonContext } from "../commun/contexts/ComparaisonContext";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";

type RechercheAvanceeFormulaireProps = Readonly<{
  lancerLaRecherche: () => void;
  rechercheOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isComparaison: boolean;
  setIsChangedZG?: Dispatch<SetStateAction<boolean>>;
  setIsChangedCapacite?: Dispatch<SetStateAction<boolean>>;
  setIsChangedStructure?: Dispatch<SetStateAction<boolean>>;
  setIsChangedCategories?: Dispatch<SetStateAction<boolean>>;
  categoriesViewModel: CategoriesFinessViewModel[]
}>;

export const RechercheAvanceeFormulaire = ({
  lancerLaRecherche,
  rechercheOnChange,
  isComparaison,
  setIsChangedZG,
  setIsChangedStructure,
  setIsChangedCapacite,
  setIsChangedCategories,
  categoriesViewModel
}: RechercheAvanceeFormulaireProps) => {
  const { wording } = useDependencies();
  const rechercheAvanceeContext = useContext(isComparaison ? ComparaisonContext : RechercheAvanceeContext);
  const [disableCapaciter, setDisableCapaciter] = useState<boolean>(false);
  const isEraseAllEnabled = rechercheAvanceeContext?.terme !== "" ||
    rechercheAvanceeContext?.zoneGeo !== "" ||
    rechercheAvanceeContext?.typeStructure.length !== 0 ||
    rechercheAvanceeContext?.statutJuridiqueStructure.length !== 0 ||
    rechercheAvanceeContext?.categories.length !== 0 ||
    rechercheAvanceeContext?.capaciteAgees.length !== 0 ||
    rechercheAvanceeContext?.capaciteHandicap.length !== 0 ||
    rechercheAvanceeContext?.capaciteMedicoSociaux.length !== 0;

  useEffect(() => {
    const structureType = rechercheAvanceeContext?.typeStructure || [];
    if (!structureType.includes(AttribuesDefaults.etablissementMedicoSocial)) {
      setDisableCapaciter(true);
    } else {
      setDisableCapaciter(false);
    }
  }, [rechercheAvanceeContext?.typeStructure]);

  const getWordingGeo = (): string => {
    return rechercheAvanceeContext?.zoneGeoLabel?.trim() ? rechercheAvanceeContext.zoneGeoLabel : wording.ZONE_GEOGRAPHIQUE;
  }

  const getWordingStructure = (): string => {
    let structureWording = wording.STRUCTURE;
    const totalSelected = (rechercheAvanceeContext?.typeStructure.length ?? 0) + (rechercheAvanceeContext?.statutJuridiqueStructure.length ?? 0);
    if (totalSelected > 0 && rechercheAvanceeContext?.typeStructure) {
      structureWording += ` : ${typeStructureTranscodage[rechercheAvanceeContext?.typeStructure[0]]}`;
      if (totalSelected > 1) structureWording += ", +" + (totalSelected - 1);
    }
    return structureWording;
  }

  const getWordingCategories = (): string => {
    let categoriesWording = wording.CATEGORIES_FINESS;
    if (rechercheAvanceeContext?.categories && rechercheAvanceeContext?.categories.length > 0) {
      categoriesWording += ` : ${rechercheAvanceeContext?.categoriesLibellesCourt[0]}`;
      if (rechercheAvanceeContext?.categories.length > 1) categoriesWording += ", +" + (rechercheAvanceeContext?.categories.length - 1);
    }
    return categoriesWording;
  }

  const getWordingCapacite = () => {
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
  };

  const ajusteementLibelleCapacite = (str: string): string => {
    return str.includes(">") ? +str.replace(">", "") + 1 + " et plus" : str.replace(",", "-");
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("recherche-terme-botton")?.click();
    }
  }

  const eraseAll = () => {
    rechercheAvanceeContext?.setCapaciteAgees([]);
    rechercheAvanceeContext?.setCapaciteHandicap([]);
    rechercheAvanceeContext?.setCapaciteMedicoSociaux([]);
    rechercheAvanceeContext?.setTypeStructure([]);
    rechercheAvanceeContext?.setStatutJuridiqueStructure([]);
    rechercheAvanceeContext?.setCategories([]);
    rechercheAvanceeContext?.setCategoriesDomaines([]);
    rechercheAvanceeContext?.setCategoriesLibellesCourt([]);
    rechercheAvanceeContext?.setZoneGeo("");
    rechercheAvanceeContext?.setZoneGeoD("");
    rechercheAvanceeContext?.setZoneGeoLabel("");
    rechercheAvanceeContext?.setZoneGeoType("");
    rechercheAvanceeContext?.setTerme("");
  }

  const buttonZoneGeoClicked = rechercheAvanceeContext?.zoneGeo !== "" ? styles["filtre-button_clicked"] : "";
  const buttonStructureClicked = rechercheAvanceeContext?.typeStructure.length !== 0 ||
    rechercheAvanceeContext?.statutJuridiqueStructure.length !== 0 ? styles["filtre-button_clicked"] : "";
  const buttonCapaciteClicked = rechercheAvanceeContext?.capaciteAgees.length !== 0 ||
    rechercheAvanceeContext?.capaciteHandicap.length !== 0 ||
    rechercheAvanceeContext?.capaciteMedicoSociaux.length !== 0 ? styles["filtre-button_clicked"] : "";
  const buttonCategorieClicked = rechercheAvanceeContext?.categories.length !== 0 ? styles["filtre-button_clicked"] : "";

  return (
    <div>
      <div className="fr-grid-row">
        <form className="fr-search-bar fr-col-5" id="search-540" role="search">
          <label className="fr-label" htmlFor="search-input">
            {wording.RECHERCHE_LABEL}
          </label>
          <input
            className="fr-input"
            id="search-input"
            name="terme"
            onChange={rechercheOnChange}
            onKeyDown={(event) => onKeyDown(event)}
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
            className={`fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary ${buttonZoneGeoClicked}`}
            data-fr-opened="false"
          >
            {getWordingGeo()}
          </button>
          <button
            aria-controls="fr-modal-Structure-Filtre"
            className={`fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary ${buttonStructureClicked}`}
            data-fr-opened="false"
            disabled={isComparaison}
          >
            {getWordingStructure()}
          </button>
          <button
            aria-controls="fr-modal-Categories-Filtre"
            className={`fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary ${buttonCategorieClicked}`}
            data-fr-opened="false"
            disabled={rechercheAvanceeContext?.typeStructure.length === 1 && rechercheAvanceeContext?.typeStructure[0] === AttribuesDefaults.entiteJuridque}
          >
            {getWordingCategories()}
          </button>
          <button
            aria-controls="fr-modal-Capacite-Filtre"
            className={`fr-btn fr-btn--icon-right fr-icon-arrow-down-s-fill fr-btn--secondary ${buttonCapaciteClicked}`}
            data-fr-opened="false"
            disabled={disableCapaciter}
          >
            {getWordingCapacite()}
          </button>
          {isEraseAllEnabled && !isComparaison && <button
            className={"fr-btn fr-btn--tertiary-no-outline " + styles["eraseAllButton"]}
            onClick={eraseAll}
          >
            {wording.TOUT_EFFACER}
          </button>}
        </div>
      </div>
      <div>
        <FiltreZoneGeographique isComparaison={isComparaison} setIsChanged={setIsChangedZG} />
        <FiltreStructure isComparaison={isComparaison} setIsChanged={setIsChangedStructure} />
        <FiltreCategoriesFiness categoriesViewModel={categoriesViewModel} isComparaison={isComparaison} setIsChanged={setIsChangedCategories} />
        <FiltreCapacite isComparaison={isComparaison} setIsChanged={setIsChangedCapacite} />
      </div>
    </div>
  );
};
