import { ReactElement } from "react";

import { InspectionControleData } from "../../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import styles from "./CardInspectionControle.module.css";

type CardInspectionControleProps = {
  data: InspectionControleData;
};

export const CardInspectionControle = ({ data }: CardInspectionControleProps): ReactElement => {
  const { wording } = useDependencies();

  const sumCardEcartRemarque = [];

  if (data.nombreEcart > 1) {
    sumCardEcartRemarque.push({ nb: data.nombreEcart, label: "ecarts" });
  } else {
    sumCardEcartRemarque.push({ nb: data.nombreEcart, label: "ecart" });
  }

  if (data.nombreRemarque > 1) {
    sumCardEcartRemarque.push({ nb: data.nombreRemarque, label: "remarques" });
  } else {
    sumCardEcartRemarque.push({ nb: data.nombreRemarque, label: "remarque" });
  }

  const sumCardEcartRemarqueText = sumCardEcartRemarque.map((item) => {
    return `${item.nb} ${item.label}`;
  });

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
      sumCard.push({ nb: 1, label: "recomandation" });
    } else {
      sumCard.push({ nb: data.recommandation, label: "recomandations" });
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

  return (
    <div className={styles["card-inspection-controle"]}>
      <div className="card-dates">
        <ul className="fr-badge-group">
          <li key="li-date-visite">
            <p className={`fr-badge fr-badge--sm ${styles["date-visite"]}`}>Date réelle de visite : {data.dateVisite}</p>
          </li>
          <li key="li-date-rapport">
            <p className={`fr-badge fr-badge--sm ${styles["date-rapport"]}`}>Date réelle de rapport : {data.dateRapport}</p>
          </li>
        </ul>
      </div>

      <h6 className={styles["card-title"]}>{data.themeRegional}</h6>

      <div className={`fr-text--sm ${styles["card-sum-1"]}`}>{sumCardEcartRemarqueText.join(", ")}</div>
      <div className={`fr-text--sm ${styles["card-sum-2"]}`}>{sumCardText.join(", ")}</div>

      <div className={`fr-text--xs " ${styles["card-type"]}`}>
        <span aria-hidden="true" className={`fr-icon-arrow-right-line ${styles["iconeType"]}`}></span>
        Type de planification : <b>{data.typePlannification}</b>
        <span className={styles["modaliteMission"]}>
          <span aria-hidden="true" className={`fr-icon-arrow-right-line ${styles["iconeType"]}`}></span>
          Modalité de la mission : <b>{data.modaliteMission}</b>
        </span>
      </div>
    </div>
  );
};
