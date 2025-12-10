/**
 * CarteIndicateurEffectif
 * Affiche une carte indicateur : effectif total + flèche de tendance + variation (% et/ou valeur) vs iso-période.
 */
import React, { ReactElement, useState } from "react";

import styles from "./CarteIndicateurEffectif.module.css";
import "@gouvfr/dsfr/dist/component/card/card.min.css";
import { EchelleTemporelleVigieRh } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { InfoBulle } from "../../../commun/InfoBulle/InfoBulle";
import { Transcription } from "../../../commun/Transcription/Transcription";

/** Propriétés de la carte indicateur d’effectif. */
type CarteIndicateurEffectifProps = Readonly<{
  // Libellé de la période de comparaison (ex. "septembre 2024").
  comparaisonLabel: string;
  // Valeur courante (ex. effectif total “N”).
  currentValue: string | number;
  pastValue: string | number;
  variation: number;
  variationText: string;
  echelleTemporelle?: EchelleTemporelleVigieRh;
  pastPeriod: string;
  // Titre du badge ("Effectif total").
  title?: string;
  infoBulleTitle?: string;
  // Libellé sous la valeur ("Employés actifs").
  unitLabel?: string;
  identifiant: string;
  contenuInfoBulle: ReactElement;
  tendance?: "ASC" | "DESC";
  etabFiness: string;
  etabTitle: string;
}>;

export default function CarteTopIndicateur({
  comparaisonLabel,
  currentValue,
  pastValue,
  title = "Effectif total",
  infoBulleTitle,
  unitLabel = "Employés actifs",
  variation,
  variationText = "",
  echelleTemporelle,
  pastPeriod,
  identifiant,
  contenuInfoBulle,
  tendance = "ASC",
  etabFiness,
  etabTitle
}: CarteIndicateurEffectifProps) {
  const [estCeOuvert, setEstCeOuvert] = useState(false);
  const { wording } = useDependencies()
  let variationColorClass = 'variationGreen', arrowIcone;
  const variationEstRouge = (variation > 0 && tendance === "DESC") //Si la valeur de l'indicateur augmente alors que la tendance souhaité est déscendante
    || (variation < 0 && tendance === "ASC") //Si la valeur de l'indicateur baisse alors que la tendance souhaité est ascendante
    || (variation === 0 && tendance === "ASC"); //Si la valeur de l'indicateur est stable alors que la tedance souhaité est ascendante 
  if (variationEstRouge) {
    variationColorClass = 'variationRed';
  }
  if (variation > 0) {
    arrowIcone = 'fr-icon-arrow-right-up-fill';
  } else if (variation < 0) {
    arrowIcone = "fr-icon-arrow-right-down-fill";
  } else {
    arrowIcone = "fr-icon-arrow-right-fill";
  }

  return (
    <div className="fr-mb-3w">
      <div aria-live="polite" className='fr-card '>
        <div className={`${styles['detailsButton']}`}>
          <button
            aria-controls={`infobulle-${identifiant}`}
            className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
            data-fr-opened={estCeOuvert}
            onClick={() => setEstCeOuvert(true)}
            title="Détails de l'indicateur"
            type="button"
          >
            {wording.DÉTAILS}
          </button>
        </div>
        <div className="fr-card__body">
          <div className={`${styles["contenuVignette"]} fr-card__content`}>
            <p className="fr-tag">{title}</p>
            <div className={styles["headerRow"]}>
              <span aria-hidden className={`${styles[variationColorClass]} ${styles["arrow"]} ${arrowIcone}`}></span>
              <span className={styles["value"]}>{currentValue}</span>
            </div>

            <div className={styles["unit"]}>{unitLabel}</div>

            <div className={styles["variation"]}>
              {variation === 0 ? (
                <><span className={`${styles[variationColorClass]}`}>Stable </span><span style={{ color: "#666" }}> par rapport {comparaisonLabel}</span></>
              ) : (
                (() => {
                  return (
                    <>
                      <span className={`${styles["variationValue"]} ${styles[variationColorClass]}`}>
                        {variationText}
                      </span>
                      <span> par rapport {comparaisonLabel}</span>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        </div>
        <InfoBulle estCeOuvert={estCeOuvert} identifiant={`infobulle-${identifiant}`} setEstCeOuvert={setEstCeOuvert} titre={infoBulleTitle}>
          {contenuInfoBulle}
        </InfoBulle>
      </div>
      <Transcription
        disabled={false}
        entêteLibellé="Période"
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={[`${unitLabel}`, "Variation"]}
        libellés={[`${echelleTemporelle?.valeur}`, pastPeriod]}
        nomGraph={unitLabel}
        valeurs={[[currentValue, pastValue], [variationText, '']]}
      />

    </div>
  );
}















