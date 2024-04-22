import { useEffect, useState } from "react";

import { EvenementsIndesirables } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { HistogrammeHorizontalRow } from "../../../indicateur-métier/qualite/ReclamationsParAnnee/HistogrammeHorizontalRow/HistogrammeHorizontalRow";
import { ContenuEvenementsIndesirables } from "../../InfoBulle/ContenuEvenementsIndesirables";
import styles from "./evenementsIndesirables.module.css";
import { EvenementsIndesirablesTagMultiNiveaux } from "./EvenementsIndesirablesTagMultiNiveaux";

type GraphiqueEvenementsIndesirablesProps = Readonly<{
  data: { [key: number]: EvenementsIndesirables[] };
  dateMiseAJour: string;
  annees: number[];
}>;

export const GraphiqueEvenementsIndesirables = ({ data, dateMiseAJour, annees }: GraphiqueEvenementsIndesirablesProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(annees[0]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(
      data[annéeEnCours][0].evenementsClotures.length +
        data[annéeEnCours][0].evenementsEncours.length +
        data[annéeEnCours][1].evenementsClotures.length +
        data[annéeEnCours][1].evenementsEncours.length
    );
  }, [annéeEnCours]);

  return (
    <IndicateurGraphique
      années={{ liste: annees, setAnnéeEnCours }}
      contenuInfoBulle={<ContenuEvenementsIndesirables dateDeMiseÀJour={dateMiseAJour} source={wording.SIVSS} />}
      dateDeMiseÀJour={dateMiseAJour}
      identifiant="qualite-evenements-indesirables"
      nomDeLIndicateur={wording.EVENEMENTS_INDESIRABLES}
      source={wording.SIVSS}
    >
      <>
        <div className={styles["total_events"]}>
          {" "}
          <div className={styles["total_events_text"]}>{wording.EVENTS_TOTAL_NUMBER} </div>
          <HistogrammeHorizontalRow color="darkBlue" number={total} total={100} />
        </div>
        <EvenementsIndesirablesTagMultiNiveaux
          evenementsIndesirablesAssociesAuxSoins={data[annéeEnCours][0]}
          evenementsIndesirablesDansET={data[annéeEnCours][1]}
        />
      </>
    </IndicateurGraphique>
  );
};
