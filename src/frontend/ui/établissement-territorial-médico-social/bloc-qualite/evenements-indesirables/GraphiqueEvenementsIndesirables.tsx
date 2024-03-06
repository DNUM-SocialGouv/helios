import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { HistogrammeHorizontalRow } from "../../../indicateur-métier/qualite/ReclamationsParAnnee/HistogrammeHorizontalRow/HistogrammeHorizontalRow";
import { ContenuEvenementsIndesirables } from "../../InfoBulle/ContenuEvenementsIndesirables";
import styles from "./evenementsIndesirables.module.css";
import { EvenementsIndesirablesTagMultiNiveaux } from "./EvenementsIndesirablesTagMultiNiveaux";

export const GraphiqueEvenementsIndesirables = () => {
    const { wording } = useDependencies();
    const evenementsIndesirablesAssociesAuxSoins =
        { libelle: "Evènements indésirables/graves associés aux soins", total: 10, evenementsEncours: [], evenementsClotures: [] };
    const evenementsIndesirablesDansET = { libelle: "Evènements/incidents dans un établissement ou organisme", total: 7, evenementsEncours: [], evenementsClotures: [] };
    ;
    return (
        <IndicateurGraphique
            contenuInfoBulle={<ContenuEvenementsIndesirables dateDeMiseÀJour="13/02/2024" source={wording.SIVSS} />}
            dateDeMiseÀJour="13/02/2024"
            identifiant="qualite-evenements-indesirables"
            nomDeLIndicateur={wording.EVENEMENTS_INDESIRABLES}
            source={wording.SIVSS}
        >
            <>
                <div className={styles["total_events"]}> <div className={styles["total_events_text"]}>{wording.EVENTS_TOTAL_NUMBER} </div><HistogrammeHorizontalRow color="darkBlue" number={17} total={100} /></div>
                <EvenementsIndesirablesTagMultiNiveaux evenementsIndesirablesAssociesAuxSoins={evenementsIndesirablesAssociesAuxSoins} evenementsIndesirablesDansET={evenementsIndesirablesDansET} />
            </>
        </IndicateurGraphique>
    );
}