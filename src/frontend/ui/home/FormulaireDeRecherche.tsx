import { ChangeEventHandler, MouseEventHandler } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { BouttonRechercheAvancee } from "./BouttonRechercheAvancee";
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
        <p>{wording.RECHERCHE_DESCRIPTION}</p>
        <form action="/" className="fr-search-bar fr-search-bar--lg" id="search" role="search">
          <label className="fr-label" htmlFor="search-input">
            {wording.RECHERCHE_LABEL}
          </label>
          <input
            className="fr-input"
            id="search-input"
            name="search-input"
            onChange={rechercheOnChange}
            placeholder={wording.RECHERCHE_PLACEHOLDER}
            type="search"
            value={terme}
          />
          <button className="fr-btn" disabled={isLoading} onClick={lancerLaRecherche} type="submit">
            {wording.RECHERCHE_LABEL}
          </button>
        </form>
        <BouttonRechercheAvancee />
      </section>
    </div>
  );
};
