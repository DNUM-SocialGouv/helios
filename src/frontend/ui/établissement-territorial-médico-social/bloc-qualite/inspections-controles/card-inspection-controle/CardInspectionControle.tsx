import { ReactElement, memo, useCallback } from "react";

import styles from "./CardInspectionControle.module.css";
import { Inspection } from "../../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { convertDateDDMMYYYY } from "../../../../../utils/dateUtils";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

type CardInspectionControleProps = {
  data: Inspection;
};


const CardInspectionControle = ({ data }: CardInspectionControleProps): ReactElement => {
  const { wording } = useDependencies();

  const getSumCardEcartRemarqueText = useCallback(
    (data: Inspection) => {
      const sumCardEcartRemarque = [];

      if (data.nombreEcart > 1) {
        sumCardEcartRemarque.push({ nb: data.nombreEcart, label: "écarts" });
      } else {
        sumCardEcartRemarque.push({ nb: data.nombreEcart, label: "écart" });
      }

      if (data.nombreRemarque > 1) {
        sumCardEcartRemarque.push({ nb: data.nombreRemarque, label: "remarques" });
      } else {
        sumCardEcartRemarque.push({ nb: data.nombreRemarque, label: "remarque" });
      }

      const sumCardEcartRemarqueText = sumCardEcartRemarque.map((item) => {
        return `${item.nb} ${item.label}`;
      });
      return sumCardEcartRemarqueText.join(", ");
    },
    [data]
  );

  const getMissions = useCallback(
    (data: Inspection) => {
      const sumCard = [];
      if (data.injonction > 0) {
        if (data.injonction === 1) {
          sumCard.push({ nb: 1, label: "injonction" });
        } else {
          sumCard.push({ nb: data.injonction, label: "injonctions" });
        }
      }
      if (data.prescription > 0) {
        if (data.prescription === 1) {
          sumCard.push({ nb: 1, label: "prescription" });
        } else {
          sumCard.push({ nb: data.prescription, label: "prescriptions" });
        }
      }
      if (data.recommandation > 0) {
        if (data.recommandation === 1) {
          sumCard.push({ nb: 1, label: "recommandation" });
        } else {
          sumCard.push({ nb: data.recommandation, label: "recommandations" });
        }
      }
      if (data.saisineCng > 0) {
        if (data.saisineCng === 1) {
          sumCard.push({ nb: 1, label: "saisine CNG" });
        } else {
          sumCard.push({ nb: data.saisineCng, label: "saisines CNG" });
        }
      }
      if (data.saisineJuridiction > 0) {
        if (data.saisineJuridiction === 1) {
          sumCard.push({ nb: 1, label: "saisine juridiction/ordinale" });
        } else {
          sumCard.push({ nb: data.saisineJuridiction, label: "saisines juridiction/ordinale" });
        }
      }
      if (data.saisineParquet > 0) {
        if (data.saisineParquet === 1) {
          sumCard.push({ nb: 1, label: "saisine parquet" });
        } else {
          sumCard.push({ nb: data.saisineParquet, label: "saisines parquet" });
        }
      }
      if (data.saisineAutre > 0) {
        if (data.saisineAutre === 1) {
          sumCard.push({ nb: 1, label: "autre parquet" });
        } else {
          sumCard.push({ nb: data.saisineAutre, label: "autres parquets" });
        }
      }

      const sumCardText = sumCard.map((item) => {
        return `${item.nb} ${item.label}`;
      });
      return sumCardText.join(", ");
    },
    [data]
  );

  const missions = getMissions(data);
  const sumCardEcartRemarqueText = getSumCardEcartRemarqueText(data);

  return (
    <div className={styles["card-inspection-controle"]}>

      <div className="card-dates">
        <ul className="fr-badge-group">
          {data.dateVisite && (
            <li key="li-date-visite">
              <p className={`fr-badge fr-badge--sm ${styles["date-visite"]}`}>
                {wording.DATE_REELLE_DE_VISITE} : {convertDateDDMMYYYY(data.dateVisite)}
              </p>
            </li>
          )}
          {data.dateRapport && (
            <li key="li-date-rapport">
              <p className={`fr-badge fr-badge--sm ${styles["date-rapport"]}`}>
                {wording.DATE_REELLE_DE_RAPPORT} : {convertDateDDMMYYYY(data.dateRapport)}
              </p>
            </li>
          )}
        </ul>
      </div>
      {data.themeRegional && <h6 className={styles["card-title"]}>{data.themeRegional}</h6>}

      <div className={`fr-text--sm ${styles["card-sum-1"]}`}>{sumCardEcartRemarqueText}</div>
      {missions && <div className={`fr-text--sm ${styles["card-sum-2"]}`}>{missions}</div>}

      <div className={`fr-text--xs " ${styles["card-type"]}`}>
        <span aria-hidden="true" className={`fr-icon-arrow-right-line ${styles["iconeType"]}`}></span>
        {wording.TYPE_DE_PLANIFICATION} : <b>{data.typePlannification}</b>
        {data.modaliteMission && (
          <span className={styles["modaliteMission"]}>
            <span aria-hidden="true" className={`fr-icon-arrow-right-line ${styles["iconeType"]}`}></span>
            {wording.MODALITE_DE_LA_MISSION} : <b>{data.modaliteMission}</b>
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(CardInspectionControle);