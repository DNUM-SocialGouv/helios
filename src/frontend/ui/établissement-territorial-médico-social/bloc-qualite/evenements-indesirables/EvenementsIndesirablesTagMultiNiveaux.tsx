import { ReactElement } from "react";

import { EvenementsIndesirables } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { couleurDuFondHistogrammeBleuFoncé, couleurDuFondHistogrammeOrange } from "../../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontalWithToggle, HistogrammeWithToggleData } from "../../../commun/Graphique/HistogrammeHorizontalWithToggle";
import { StringFormater } from "../../../commun/StringFormater";
import { Tag, TagCliquable } from "../../../commun/Tag";
import { TagWithLink } from "../../../commun/Tag/TagWithLink";
import styles from "./evenementsIndesirables.module.css";

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

type EventsProps = {
    events: EventByNature[],
    isClosed: boolean,
    libelle: string
}

type EventByNature = {
    nature: string,
    est_EIGS: boolean,
    numeroSIVSS: number
}

const groupByEventsNature = (events: any[]): any => {
    return events.reduce((grouped, event) => {
        (grouped[event["nature"]] = grouped[event["nature"]] || []).push(event);
        return grouped;
    }, {});
}

export const EvenementsIndesirablesTagMultiNiveaux = ({ evenementsIndesirablesAssociesAuxSoins, evenementsIndesirablesDansET }: TagMultiNiveauxProps): ReactElement => {
    return (
        <ul>
            <EventTag events={evenementsIndesirablesAssociesAuxSoins} />
            <EventTag events={evenementsIndesirablesDansET} />
        </ul>
    );
};

const valeursDesHistogrammes: HistogrammeWithToggleData[] = [
    new HistogrammeWithToggleData(
        "",
        ["Nombre total EIGAS"],
        [10],
        [
            {
                backgroundColor: [couleurDuFondHistogrammeBleuFoncé],
                data: [8],
                label: "EIGS",
            },
            {
                label: "Non EIGS",
                data: [2],
                backgroundColor: [couleurDuFondHistogrammeOrange],
            },
        ],
        StringFormater.formatInFrench
    )
];

const EventTag = ({ events }: EventTagProps): ReactElement => {
    return (
        <li key="evenement-1">
            <TagCliquable for={`evenement-accordion-${events.libelle}`} titre={`${events.libelle} (${events.total})`} />
            <div className="fr-collapse niveau1 fr-mb-2w" id={`evenement-accordion-${events.libelle}`}>
                <HistogrammeHorizontalWithToggle légende={["EIGS", "Non EIGS"]} valeursDesHistogrammes={valeursDesHistogrammes} />
                <EventNaturesAndStatus evenementsClotures={events.evenementsClotures} evenementsEncours={events.evenementsEncours} libelle={events.libelle} />
            </div>
        </li>
    )
}

const EventNaturesAndStatus = ({ evenementsEncours, evenementsClotures, libelle }: EventNaturesAndStatusProps): ReactElement => {
    return (
        <ul>
            <li>
                <TagCliquable for={`evenement-encours-accordion-${libelle}`} titre={`${libelle} en cours (${evenementsEncours.length})`} />
                {evenementsEncours.length !== 0 && (
                    <ul className="fr-collapse niveau1 " id={`evenement-encours-accordion-${libelle}`}>
                        <EventNatures events={evenementsEncours} isClosed={false} libelle={libelle} />
                    </ul>
                )}
            </li>
            <li>
                <TagCliquable for={`evenement-clotures-accordion-${libelle}`} titre={`${libelle} clôturés (${evenementsClotures.length})`} />
                {evenementsClotures.length !== 0 && (
                    <ul className="fr-collapse niveau1 " id={`evenement-clotures-accordion-${libelle}`}>
                        <EventNatures events={evenementsClotures} isClosed={true} libelle={libelle} />
                    </ul>
                )}
            </li>
        </ul>
    )
}

const EventNatures = ({ events, isClosed, libelle }: EventsProps): ReactElement => {
    const eventsByNature = groupByEventsNature(events);
    const natures = Object.keys(eventsByNature);
    return (
        <ul>
            {natures.map((nature) => (
                <li key={`${libelle}-${nature}`}>
                    <TagWithLink for={`events-nature-accordion-${libelle}-${nature}`} titre={`${nature} (${eventsByNature[nature].length})`} />
                    {eventsByNature[nature].length !== 0 && (
                        <ul className={"fr-collapse niveau1 " + styles["list-style"]} id={`events-nature-accordion-${libelle}-${nature}`}>
                            {eventsByNature[nature].map((natureDetails: any) => (
                                <li className={styles["list-element-style"]} key={`${libelle}-${nature}-${natureDetails.numeroSIVSS}`}>
                                    <Tag label={`Numéro SIVSS : ${natureDetails.numeroSIVSS}`} />
                                    {isClosed && <Tag label={`Date de clôture  : ${natureDetails.clotDate}`} />}
                                    {isClosed && <Tag label={`Motif de clôture : ${natureDetails.clotMotif}`} />}
                                </li>
                            ))}

                        </ul>
                    )}
                </li>
            ))}
        </ul>
    )
}