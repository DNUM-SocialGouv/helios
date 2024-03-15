import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { HistogrammeHorizontalRow } from "../../../indicateur-métier/qualite/ReclamationsParAnnee/HistogrammeHorizontalRow/HistogrammeHorizontalRow";
import { ContenuEvenementsIndesirables } from "../../InfoBulle/ContenuEvenementsIndesirables";
import styles from "./evenementsIndesirables.module.css";
import { EvenementsIndesirablesTagMultiNiveaux } from "./EvenementsIndesirablesTagMultiNiveaux";

export const GraphiqueEvenementsIndesirables = () => {
    const { wording } = useDependencies();
    const [annéeEnCours, setAnnéeEnCours] = useState<number>(2022);

    // eslint-disable-next-line no-console
    console.log('annéeEnCours', annéeEnCours);

    const evenementsIndesirablesAssociesAuxSoins =
    {
        libelle: wording.EVENEMENTS_ASSOCIE_AUX_SOINS,
        dateMiseAJourSource: '2024-03-15',
        evenementsEncours: [
            { nature: "Maltraitance", est_EIGS: true, numeroSIVSS: 484045 },
            { nature: "Maltraitance", est_EIGS: false, numeroSIVSS: 484046 },
            { nature: "Maltraitance", est_EIGS: true, numeroSIVSS: 484047 },
            { nature: "Fausse route", est_EIGS: false, numeroSIVSS: 484048 },
            { nature: "Fausse route", est_EIGS: true, numeroSIVSS: 484049 },
            { nature: "Fausse route", est_EIGS: false, numeroSIVSS: 484044 },
            { nature: "Brûlure accidentelle", est_EIGS: true, numeroSIVSS: 484043 },
            { nature: "Brûlure accidentelle", est_EIGS: false, numeroSIVSS: 484042 },
            { nature: "Tentative de suicide", est_EIGS: true, numeroSIVSS: 484041 },
        ],
        evenementsClotures: [{ nature: "IRA - Infection Respiratoire Aigue", est_EIGS: false, numeroSIVSS: 384045, clotDate: "05/05/2012", clotMotif: "motif de test" },]
    };
    const evenementsIndesirablesDansET = {
        libelle: wording.EVENEMENTS_DANS_ET,
        dateMiseAJourSource: '2024-03-15',
        evenementsEncours: [
            { nature: "Fausse route", est_EIGS: true, numeroSIVSS: 484145 },
            { nature: "Fausse route", est_EIGS: true, numeroSIVSS: 484245 },
            { nature: "Brûlure accidentelle", est_EIGS: true, numeroSIVSS: 484345 },
            { nature: "Brûlure accidentelle", est_EIGS: true, numeroSIVSS: 484445 },
            { nature: "Tentative de suicide", est_EIGS: true, numeroSIVSS: 484545 },
        ],
        evenementsClotures: [
            { nature: "IRA - Infection Respiratoire Aigue", est_EIGS: true, numeroSIVSS: 484065, clotDate: "05/05/2012", clotMotif: "motif de test" },
            { nature: "IRA - Infection Respiratoire Aigue", est_EIGS: true, numeroSIVSS: 484075, clotDate: "05/05/2012", clotMotif: "motif de test" },
        ]
    };
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
                <div className={styles["total_events"]}> <div className={styles["total_events_text"]}>{wording.EVENTS_TOTAL_NUMBER} </div><HistogrammeHorizontalRow color="darkBlue" number={17} total={100} /></div>
                <EvenementsIndesirablesTagMultiNiveaux evenementsIndesirablesAssociesAuxSoins={evenementsIndesirablesAssociesAuxSoins} evenementsIndesirablesDansET={evenementsIndesirablesDansET} />
            </>
        </IndicateurGraphique>
    );
}