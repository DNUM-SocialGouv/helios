import { ReactNode, ReactElement } from "react";

import { IDetails } from "./IDetails";
import styles from "./IndicateurGraphique.module.css";
import { EchelleTemporelleVigieRh } from "../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../contexts/useDependencies";
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
  echelleTemporel?: EchelleTemporelleVigieRh;
  className?: string;
}>;

export const IndicateurGraphique = ({ années, children, contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source, prefixSelect, echelleTemporel, className = "" }: IndicateurProps) => {
  const { wording } = useDependencies();

  return (
    <li className={styles["print-only"] + " " + className}>
      <div className={styles["mise-a-jour-source"]}>
        <h3 className={`fr-m-0 fr-text--bold ${styles["intitule"]} fr-h6`}>
          {nomDeLIndicateur}
        </h3>
        <IDetails
          contenuInfoBulle={contenuInfoBulle}
          dateDeMiseÀJour={dateDeMiseÀJour}
          identifiant={identifiant}
          nomDeLIndicateur={nomDeLIndicateur}
          source={source}
        />
      </div>

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
    </li>
  );
};
