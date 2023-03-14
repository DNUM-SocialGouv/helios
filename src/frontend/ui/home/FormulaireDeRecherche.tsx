import { ChangeEventHandler, MouseEventHandler } from "react";

import { FEATURE_NAME } from "../../utils/featureToggle";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Recherche.module.css";

type FormulaireDeRechercheProps = Readonly<{
  lancerLaRecherche: MouseEventHandler<HTMLButtonElement>;
  rechercheOnChange: ChangeEventHandler<HTMLInputElement>;
  terme: string;
  isLoading: boolean;
}>;

export const FormulaireDeRecherche = ({ lancerLaRecherche, rechercheOnChange, terme, isLoading }: FormulaireDeRechercheProps) => {
  const { wording } = useDependencies();

  return (
    <div className="fr-grid-row fr-grid-row--center">
      <section className={"fr-col-8 " + styles["formulaire"]}>
        <h1>{wording.RECHERCHE_TITRE}</h1>
        <p>{wording.RECHERCHE_DESCRIPTION}</p>
        <form action="/" className="fr-search-bar fr-search-bar--lg" id="search-2" role="search">
          <label className="fr-label" htmlFor="search-787-input">
            {wording.RECHERCHE_LABEL}
          </label>
          <input
            className="fr-input"
            id="search-787-input"
            name="search-787-input"
            onChange={rechercheOnChange}
            placeholder={wording.RECHERCHE_PLACEHOLDER}
            type="search"
            value={terme}
          />
          <ButtonRecherche isLoading={isLoading} lancerLaRecherche={lancerLaRecherche} rechercheOnChange={rechercheOnChange} terme={terme} />
        </form>
      </section>
    </div>
  );
};

export const ButtonRecherche = ({ lancerLaRecherche, isLoading }: FormulaireDeRechercheProps) => {
  const { wording, isFeatureEnabled } = useDependencies();

  if (!isFeatureEnabled(FEATURE_NAME.BOUTON_RECHERCHE)) {
    return (
      <>
        <button className="fr-btn" onClick={lancerLaRecherche} type="submit">
          {wording.RECHERCHE_LABEL}
        </button>
      </>
    );
  }
  return (
    <>
      <button className="fr-btn" disabled={isLoading} onClick={lancerLaRecherche} type="submit">
        {wording.RECHERCHE_LABEL}
      </button>
    </>
  );
};
