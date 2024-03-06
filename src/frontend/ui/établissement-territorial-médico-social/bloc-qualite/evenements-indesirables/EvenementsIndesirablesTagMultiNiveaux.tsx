import { ReactElement } from "react";

import { EvenementsIndesirables } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { TagCliquable } from "../../../commun/Tag";

export type TagMultiNiveauxProps = {
    evenementsIndesirablesAssociesAuxSoins: EvenementsIndesirables;
    evenementsIndesirablesDansET: EvenementsIndesirables;
};

type EventTagProps = {
    events: EvenementsIndesirables
}

type EventNaturesAndStatusProps = {
    evenementsEncours: any[],
    evenementsClotures: any[],
    libelle: string
}

export const EvenementsIndesirablesTagMultiNiveaux = ({ evenementsIndesirablesAssociesAuxSoins, evenementsIndesirablesDansET }: TagMultiNiveauxProps): ReactElement => {
    return (
        <ul>
            <EventTag events={evenementsIndesirablesAssociesAuxSoins} />
            <EventTag events={evenementsIndesirablesDansET} />
        </ul>
    );
};

const EventTag = ({ events }: EventTagProps): ReactElement => {
    return (
        <li key="evenement-1">
            <TagCliquable for={`evenement-accordion-${events.libelle}`} titre={`${events.libelle} (${events.total})`} />
            <ul className="fr-collapse niveau1 " id={`evenement-accordion-${events.libelle}`}>
                <EventNaturesAndStatus evenementsClotures={events.evenementsClotures} evenementsEncours={events.evenementsEncours} libelle={events.libelle} />
            </ul>
        </li>
    )

}

const EventNaturesAndStatus = ({ evenementsEncours, evenementsClotures, libelle }: EventNaturesAndStatusProps): ReactElement => {
    return (
        <ul>
            <li>
                <TagCliquable for="evenement-accordion-" titre={`${libelle} en cours (${evenementsEncours.length})`} />
            </li>
            <li>
                <TagCliquable for="evenement-accordion-" titre={`${libelle} clôturés (${evenementsClotures.length})`} />
            </li>
        </ul>
    )
}