/**
 * CarteIndicateurEffectif
 * Affiche une carte indicateur : effectif total + flèche de tendance + variation (% et/ou valeur) vs iso-période.
 */
import React from "react";

import { ArrowUpSVG, ArrowDownSVG, ArrowRightSVG } from "./ArrowSVG";
import styles from "./CarteIndicateurEffectif.module.css";
import { useDependencies } from "../../../commun/contexts/useDependencies";

/** Propriétés de la carte indicateur d’effectif. */
type CarteIndicateurEffectifProps = Readonly<{
  // Libellé de la période de comparaison (ex. "septembre 2024").
  comparaisonLabel: string;
  // Valeur courante (ex. effectif total “N”).
  currentValue: number;
  // Valeur précédente pour comparaison (iso-période “N-1”).
  previousValue: number;
  // Titre du badge ("Effectif total").
  title?: string;
  // Libellé sous la valeur ("Employés actifs").
  unitLabel?: string;
  // Afficher la variation en pourcentage.
  showPercent?: boolean;
  // Afficher la variation en valeur absolue.
  showAbsolute?: boolean;
}>;

export default function CarteIndicateurEffectif({
  comparaisonLabel,
  currentValue,
  previousValue,
  title = "Effectif total",
  unitLabel = "Employés actifs",
  showPercent = true,
  showAbsolute = true,
}: CarteIndicateurEffectifProps) {
  const { wording } = useDependencies();
  const nf = new Intl.NumberFormat("fr-FR");
  const pf = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const deltaAbs = currentValue - previousValue;
  const deltaPct = previousValue === 0 ? null : (deltaAbs / previousValue) * 100;

  let arrow;
  if (deltaAbs > 0) {
    arrow = ArrowUpSVG("var(--text-action-high-blue-france)");
  } else if (deltaAbs < 0) {
    arrow = ArrowDownSVG("var(--text-action-high-blue-france)");
  } else {
    arrow = ArrowRightSVG("var(--text-action-high-blue-france)");
  }
  let sign = "";
  if (deltaAbs > 0) {
    sign = "+";
  } else if (deltaAbs < 0) {
    sign = "−";
  }

  /* calculs d’affichage pour éviter “par rapport à …” sans métrique */
  const showPctNow = !!(showPercent && deltaPct !== null);
  const showAbsNow = showAbsolute || (!showPctNow && !showAbsolute);

  return (
    <div aria-live="polite" className={`fr-p-3w fr-mb-4w ${styles["card"]}`}>
      <div className={`fr-badge fr-mb-2w ${styles["badge"]}`}>{title}</div>

      <div className={styles["headerRow"]}>
        <span aria-hidden className={styles["arrow"]}>
          {arrow}
        </span>
        <span className={styles["value"]}>{nf.format(currentValue)}</span>
      </div>

      <div className={styles["unit"]}>{unitLabel}</div>

      <div className={styles["variation"]}>
        {deltaAbs !== 0 ? (
          (() => {
            if (showPctNow || showAbsNow) {
              return (
                <>
                  <span className={styles["variationValue"]}>
                    {showPctNow && (
                      <span>
                        {sign}
                        {pf.format(Math.abs(deltaPct as number))}%
                      </span>
                    )}
                    {showPctNow && showAbsNow ? " " : null}
                    {showAbsNow && (
                      <span>
                        ({sign}
                        {nf.format(Math.abs(deltaAbs))})
                      </span>
                    )}
                  </span>
                  <span> par rapport à {comparaisonLabel}</span>
                </>
              );
            } else {
              return <span style={{ color: "#666" }}>{wording.INDICATEUR_EFFECTIFS_DONNEES_NON_DISPONIBLE}</span>;
            }
          })()
        ) : (
          <span style={{ color: "#666" }}>Stable par rapport à {comparaisonLabel}</span>
        )}
      </div>

      {/* Lecture d’écran : annonce la tendance et la variation */}
      {(() => {
        let variationText: string;
        if (deltaAbs > 0) {
          variationText = "en hausse";
        } else if (deltaAbs < 0) {
          variationText = "en baisse";
        } else {
          variationText = "stable";
        }
        return (
          <span className="fr-sr-only">
            Variation {variationText}
            {deltaPct !== null ? ` de ${pf.format(Math.abs(deltaPct))} pour cent` : ""} par rapport à {comparaisonLabel}.
          </span>
        );
      })()}
    </div>
  );
}
