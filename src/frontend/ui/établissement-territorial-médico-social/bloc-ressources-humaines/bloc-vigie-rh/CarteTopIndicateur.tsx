/**
 * CarteIndicateurEffectif
 * Affiche une carte indicateur : effectif total + flèche de tendance + variation (% et/ou valeur) vs iso-période.
 */
import React, { ReactElement, useState } from "react";

import styles from "./CarteIndicateurEffectif.module.css";
import "@gouvfr/dsfr/dist/component/card/card.min.css";
import { EchelleTemporelleVigieRh } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { InfoBulle } from "../../../commun/InfoBulle/InfoBulle";

/** Propriétés de la carte indicateur d’effectif. */
type CarteIndicateurEffectifProps = Readonly<{
  // Libellé de la période de comparaison (ex. "septembre 2024").
  comparaisonLabel: string;
  // Valeur courante (ex. effectif total “N”).
  currentValue: string | number;
  variation: number;
  variationText: string;
  echelleTemporelle?: EchelleTemporelleVigieRh;
  // Titre du badge ("Effectif total").
  title?: string;
  // Libellé sous la valeur ("Employés actifs").
  unitLabel?: string;
  identifiant: string;
  contenuInfoBulle: ReactElement;
}>;

export default function CarteTopIndicateur({
  comparaisonLabel,
  currentValue,
  title = "Effectif total",
  unitLabel = "Employés actifs",
  variation,
  variationText = "",
  echelleTemporelle,
  identifiant,
  contenuInfoBulle
}: CarteIndicateurEffectifProps) {
  const [estCeOuvert, setEstCeOuvert] = useState(false);

  let arrow;
  if (variation > 0) {
    arrow = '<span class="fr-icon-arrow-right-up-fill" aria-hidden="true"></span>';
  } else if (variation < 0) {
    arrow = '<span class="fr-icon-arrow-right-down-fill" aria-hidden="true"></span>';
  } else {
    arrow = '<span class="fr-icon-arrow-right-fill" aria-hidden="true"></span>';
  }

  return (
    <div aria-live="polite" className='fr-card'>
      <div className={styles['detailsButton']}>
        <button
          aria-controls={`infobulle-${identifiant}`}
          className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
          data-fr-opened={estCeOuvert}
          onClick={() => setEstCeOuvert(true)}
          title="Détails de l'indicateur"
          type="button"
        >
          DÉTAILS
        </button>
      </div>
      <div className="fr-card__body">
        <div className="fr-card__content">
          <p className="fr-tag">{title}</p>
          <div className={styles["headerRow"]}>
            <span aria-hidden className={styles["arrow"]} dangerouslySetInnerHTML={{ __html: arrow }}></span>
            <span className={styles["value"]}>{currentValue}</span>
            {echelleTemporelle && 
              echelleTemporelle.type==="TRIMESTRIEL"? <abbr title={echelleTemporelle?.valeurTranscription}><span>({echelleTemporelle?.valeur})</span></abbr>:<span>({echelleTemporelle?.valeur})</span>
            }
          </div>

          <div className={styles["unit"]}>{unitLabel}</div>

          <div className={styles["variation"]}>
            {variation !== 0 ? (
              (() => {
                return (
                  <>
                    <span className={styles["variationValue"]}>
                      {variationText}
                    </span>
                    <span> par rapport {comparaisonLabel}</span>
                  </>
                );
              })()
            ) : (
              <span style={{ color: "#666" }}>Stable par rapport {comparaisonLabel}</span>
            )}
          </div>
        </div>
      </div>
      <InfoBulle estCeOuvert={estCeOuvert} identifiant={`infobulle-${identifiant}`} setEstCeOuvert={setEstCeOuvert} titre={title}>
        {contenuInfoBulle}
      </InfoBulle>
    </div>
  );
}
