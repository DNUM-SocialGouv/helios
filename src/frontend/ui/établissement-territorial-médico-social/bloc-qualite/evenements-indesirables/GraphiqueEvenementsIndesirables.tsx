import { useState } from "react";

import { EvenementsIndesirables } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { HistogrammeHorizontalRow } from "../../../indicateur-métier/qualite/ReclamationsParAnnee/HistogrammeHorizontalRow/HistogrammeHorizontalRow";
import { ContenuEvenementsIndesirables } from "../../InfoBulle/ContenuEvenementsIndesirables";
import styles from "./evenementsIndesirables.module.css";
import { EvenementsIndesirablesTagMultiNiveaux } from "./EvenementsIndesirablesTagMultiNiveaux";

type GraphiqueEvenementsIndesirablesProps = Readonly<{
    data: EvenementsIndesirables[];
    total: number
}>;

export const GraphiqueEvenementsIndesirables = ({ data, total }: GraphiqueEvenementsIndesirablesProps) => {
    const { wording } = useDependencies();
    const [annéeEnCours, setAnnéeEnCours] = useState<number>(2022);

    // eslint-disable-next-line no-console
    console.log('annéeEnCours', annéeEnCours);

    return (
        <IndicateurGraphique
            années={{ liste: [2022, 2021, 2020], setAnnéeEnCours }}
            contenuInfoBulle={<ContenuEvenementsIndesirables dateDeMiseÀJour="13/02/2024" source={wording.SIVSS} />}
            dateDeMiseÀJour="13/02/2024"
            identifiant="qualite-evenements-indesirables"
            nomDeLIndicateur={wording.EVENEMENTS_INDESIRABLES}
            source={wording.SIVSS}
        >
            <>
                <div className={styles["total_events"]}> <div className={styles["total_events_text"]}>{wording.EVENTS_TOTAL_NUMBER} </div><HistogrammeHorizontalRow color="darkBlue" number={total} total={100} /></div>
                <EvenementsIndesirablesTagMultiNiveaux evenementsIndesirablesAssociesAuxSoins={data[0]} evenementsIndesirablesDansET={data[1]} />
            </>
        </IndicateurGraphique>
    );
}