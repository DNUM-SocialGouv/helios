import { ReactElement, useEffect, useMemo, useState } from "react";

import styles from "./evenementsIndesirables.module.css";
import { EvenementsIndesirables } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeBleuFoncé, couleurDuFondHistogrammeOrange } from "../../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontalWithToggle, HistogrammeWithToggleData } from "../../../commun/Graphique/HistogrammeHorizontalWithToggle";
import { StringFormater } from "../../../commun/StringFormater";
import { Tag, TagCliquable } from "../../../commun/Tag";
import { TagWithLink } from "../../../commun/Tag/TagWithLink";

export type TagMultiNiveauxProps = {
  evenementsIndesirablesAssociesAuxSoins: EvenementsIndesirables;
  evenementsIndesirablesDansET: EvenementsIndesirables;
};

type EventTagProps = {
  events: EvenementsIndesirables;
};

type EventNaturesAndStatusProps = {
  evenementsEncours: any[];
  evenementsClotures: any[];
  libelle: string;
};

type EventsProps = {
  events: EventByNature[];
  isClosed: boolean;
  libelle: string;
};

type EventByNature = {
  nature: string;
  est_EIGS: boolean;
  numeroSIVSS: number;
};

const groupByEventsNature = (events: any[]): any => {
  return events.reduce((grouped, event) => {
    grouped[event["nature"]] = grouped[event["nature"]] || [];
    grouped[event["nature"]].push(event);
    return grouped;
  }, {});
};

const sortEventsNature = (events: object): object => {
  const sortedEvents = Object.fromEntries(Object.entries(events).sort(([, arr1], [, arr2]) => arr2.length - arr1.length));
  for (const nature in sortedEvents) {
    sortedEvents[nature].sort((a: any, b: any) => b.numeroSIVSS - a.numeroSIVSS);
  }
  return sortedEvents;
};

export const EvenementsIndesirablesTagMultiNiveaux = ({
  evenementsIndesirablesAssociesAuxSoins,
  evenementsIndesirablesDansET,
}: TagMultiNiveauxProps): ReactElement => {
  return (
    <ul>
      <EventTag events={evenementsIndesirablesAssociesAuxSoins} />
      <EventTag events={evenementsIndesirablesDansET} />
    </ul>
  );
};

const EventTag = ({ events }: EventTagProps): ReactElement => {
  const { wording } = useDependencies();
  const [filtredClosedEvents, setFiltredClosedEvents] = useState(events.evenementsClotures);
  const [filtredPenddingEvents, setFiltredPenddingEvents] = useState(events.evenementsEncours);
  const [EIGSTotal, setEIGSTotal] = useState(0);
  const [nonEIGSTotal, setNonEIGSTotal] = useState(0);

  useEffect(() => {
    setFiltredClosedEvents(events.evenementsClotures);
    setFiltredPenddingEvents(events.evenementsEncours);
    setEIGSTotal(events.evenementsEncours.filter((event) => event.est_EIGS).length + events.evenementsClotures.filter((event) => event.est_EIGS).length);
    setNonEIGSTotal(events.evenementsEncours.filter((event) => !event.est_EIGS).length + events.evenementsClotures.filter((event) => !event.est_EIGS).length);
  }, [events]);

  const valeursDesHistogrammes: HistogrammeWithToggleData[] = useMemo(() => {
    return [
      new HistogrammeWithToggleData(
        "",
        ["Nombre total EIGAS"],
        [events.evenementsClotures.length + events.evenementsEncours.length],
        [
          {
            backgroundColor: [couleurDuFondHistogrammeBleuFoncé],
            data: [EIGSTotal],
            label: "EIGS",
          },
          {
            label: "Non EIGS",
            data: [nonEIGSTotal],
            backgroundColor: [couleurDuFondHistogrammeOrange],
          },
        ],
        StringFormater.formatInFrench
      ),
    ];
  }, [EIGSTotal, nonEIGSTotal, events]);

  const removeDataFromEvents = (isEIGS: boolean) => {
    const newClosedEvents = filtredClosedEvents.filter((event) => event.est_EIGS === !isEIGS);
    const newPenddingEvents = filtredPenddingEvents.filter((event) => event.est_EIGS === !isEIGS);
    setFiltredClosedEvents(newClosedEvents);
    setFiltredPenddingEvents(newPenddingEvents);
  };

  const addDataToEvents = (isEIGS: boolean) => {
    const closedEventsToAdd = events.evenementsClotures.filter((event) => event.est_EIGS === isEIGS);
    const penddingEventsToAdd = events.evenementsEncours.filter((event) => event.est_EIGS === isEIGS);
    setFiltredClosedEvents([...filtredClosedEvents, ...closedEventsToAdd]);
    setFiltredPenddingEvents([...filtredPenddingEvents, ...penddingEventsToAdd]);
  };

  const filterEventsEIGS = (index: number, isVisible: boolean) => {
    if (isVisible) {
      if (index === 0) {
        addDataToEvents(true);
      } else {
        addDataToEvents(false);
      }
    } else {
      if (index === 0) {
        removeDataFromEvents(true);
      } else {
        removeDataFromEvents(false);
      }
    }
  };
  const [showHistogramme, setShowHistogramme] = useState(true);

  useEffect(() => {
    setShowHistogramme(false);
    const id = setTimeout(() => {
      setShowHistogramme(true);
    }, 10);
    return () => {
      clearTimeout(id);
    };
  }, [valeursDesHistogrammes]);

  return (
    <li key={events.libelle}>
      <TagCliquable
        for={`evenement-accordion-${events.libelle}`}
        titre={`${events.libelle} [${events.evenementsClotures.length + events.evenementsEncours.length}]`}
      />
      <div className="fr-collapse niveau1 fr-mb-2w " id={`evenement-accordion-${events.libelle}`}>
        {events.libelle === wording.EVENEMENTS_ASSOCIE_AUX_SOINS && showHistogramme && (
          <HistogrammeHorizontalWithToggle filterEventsEIGS={filterEventsEIGS} légende={["EIGS", "Non EIGS"]} valeursDesHistogrammes={valeursDesHistogrammes} />
        )}
        <EventNaturesAndStatus evenementsClotures={filtredClosedEvents} evenementsEncours={filtredPenddingEvents} libelle={events.libelle} />
      </div>
    </li>
  );
};

const EventNaturesAndStatus = ({ evenementsEncours, evenementsClotures, libelle }: EventNaturesAndStatusProps): ReactElement => {
  return (
    <ul>
      <li className="fr-ml-2w fr-mb-1w">
        <TagCliquable for={`evenement-encours-accordion-${libelle}`} titre={`${libelle} en cours [${evenementsEncours.length}]`} />
        {evenementsEncours.length !== 0 && (
          <ul className="fr-collapse " id={`evenement-encours-accordion-${libelle}`}>
            <EventNatures events={evenementsEncours} isClosed={false} libelle={`${libelle}-en-cours`} />
          </ul>
        )}
      </li>
      <li className="fr-ml-2w fr-mb-1w">
        <TagCliquable for={`evenement-clotures-accordion-${libelle}`} titre={`${libelle} clôturés [${evenementsClotures.length}]`} />
        {evenementsClotures.length !== 0 && (
          <ul className="fr-collapse " id={`evenement-clotures-accordion-${libelle}`}>
            <EventNatures events={evenementsClotures} isClosed={true} libelle={`${libelle}-clot`} />
          </ul>
        )}
      </li>
    </ul>
  );
};

const EventNatures = ({ events, isClosed, libelle }: EventsProps): ReactElement => {
  const eventsByNature = groupByEventsNature(events);
  const natures = Object.keys(sortEventsNature(eventsByNature));

  return (
    <ul>
      {natures.map((nature) => (
        <li className="fr-ml-4w" key={`${libelle}-${nature}`}>
          <TagWithLink
            for={`events-nature-accordion-${libelle}-${nature}`}
            titre={`${nature === "null" ? "Non renseigné" : nature} (${eventsByNature[nature].length})`}
          />
          {eventsByNature[nature].length !== 0 && (
            <ul className={"fr-collapse niveau1 " + styles["list-style"]} id={`events-nature-accordion-${libelle}-${nature}`}>
              {eventsByNature[nature].map((natureDetails: any) => (
                <li className={"fr-ml-6w " + styles["list-element-style"]} key={`${libelle}-${nature}-${natureDetails.numeroSIVSS}`}>
                  <Tag label={`Numéro SIVSS : ${natureDetails.numeroSIVSS}`} />
                  {isClosed && <Tag label={`Date de clôture  : ${StringFormater.formatDate(natureDetails.clotDate)}`} />}
                  {isClosed && <Tag label={`Motif de clôture : ${natureDetails.clotMotif}`} />}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
