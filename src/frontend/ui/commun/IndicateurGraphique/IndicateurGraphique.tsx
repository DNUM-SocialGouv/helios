import { ReactNode, ReactElement, useState } from "react";

import styles from "./IndicateurGraphique.module.css";
import { EchelleTemporelleVigieRh } from "../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../contexts/useDependencies";
import { InfoBulle } from "../InfoBulle/InfoBulle";
import { SelectionAnneeTags } from "../Tag/SelectionAnneeTags";

import "@gouvfr/dsfr/dist/component/button/button.min.css";

type IndicateurProps = Readonly<{
  années?: { liste: number[]; setAnnéeEnCours: (annee: number) => void };
  children: ReactElement;
  contenuInfoBulle: ReactElement;
  dateDeMiseÀJour?: string;
  identifiant: string;
  nomDeLIndicateur: ReactNode;
  source: ReactElement;
  prefixSelect?: string;
  echelleTemporel?: EchelleTemporelleVigieRh
}>;

export const IndicateurGraphique = ({ années, children, contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source, prefixSelect, echelleTemporel }: IndicateurProps) => {
  const { wording } = useDependencies();
  const [estCeOuvert, setEstCeOuvert] = useState(false);

  return (
    <li className={styles["print-only"]}>
      <div className={styles["mise-a-jour-source"]}>
        <h3 className={`fr-m-0 fr-text--bold ${styles["intitule"]} fr-h6`}>
          {nomDeLIndicateur}
        </h3>
        {!dateDeMiseÀJour && <button
          aria-controls={`nom-info-bulle-${identifiant}`}
          className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
          data-fr-opened={estCeOuvert}
          onClick={() => setEstCeOuvert(true)}
          title="Détails de l'indicateur"
          type="button"
        >
          {wording.DÉTAILS}
        </button>}
      </div>

      {dateDeMiseÀJour && source && <div className={styles["mise-a-jour-source"]}>
        <p className={`fr-text--xs ${styles["titraille"]}`}>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
        <button
          aria-controls={`nom-info-bulle-${identifiant}`}
          className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
          data-fr-opened={estCeOuvert}
          onClick={() => setEstCeOuvert(true)}
          title="Détails de l'indicateur"
          type="button"
        >
          {wording.DÉTAILS}
        </button>
      </div>}
      {echelleTemporel && (
        <p className={styles["donnees-arretees"]}>
          {wording.DONNEES_ARRETEES}{" "}
          {echelleTemporel.type === "TRIMESTRIEL" ? (
            <abbr title={echelleTemporel.valeurTranscription}>{echelleTemporel.valeur}</abbr>
          ) : (
            echelleTemporel.valeur
          )}
        </p>
      )}
      {années ? <SelectionAnneeTags annees={années.liste} id={identifiant} prefix={prefixSelect} setAnnéeEnCours={années.setAnnéeEnCours} /> : <></>}

      <div className={styles["graphe"]}>{children}</div>
      <InfoBulle estCeOuvert={estCeOuvert} identifiant={identifiant} setEstCeOuvert={setEstCeOuvert} titre={nomDeLIndicateur}>
        {contenuInfoBulle}
      </InfoBulle>
    </li>
  );
};
