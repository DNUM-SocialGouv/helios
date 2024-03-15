import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuEvenementsIndesirablesProps = Readonly<{
    dateDeMiseÀJour: string;
    source: ReactElement;
}>;

export const ContenuEvenementsIndesirables = ({ dateDeMiseÀJour, source }: ContenuEvenementsIndesirablesProps) => {
    const { wording } = useDependencies();

    return (
        <>
            <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
            <p>
                Hélios restitue les données de SIVSS sur les deux «familles» de signaux suivants:
                les évènements indésirables/graves associé aux soins (EIAS/EIGS) et les évènements/incidents
                dans un établissement ou un organisme.
            </p>
            <p>
                Un <b>évènement indésirable associé aux soins (EIAS)</b> est un évènement ou une circonstance associé(e) aux soins
                qui aurait pu entrainer ou a entrainé une atteinte pour un patient et dont on souhaite qu&apos;il ne se produise
                pas de nouveau.
            </p>
            <p>
                Un <b>évènement indésirable grave (EIGS)</b> est un évènement inattendu au regard de l&apos;état de santé et de la
                pathologie de la personne et dont les conséquences sont le décès, la mise en jeu du pronostic vital, la
                survenue probable d&apos;un déficit fonctionnel permanent, y compris une anomalie ou une malformation congénitale.
            </p>
            <br />
            Les EIGS sont soumis à des obligations réglementaires de signalement et d&apos;analyse par les professionnels de santé.
            La déclaration est réalisée en 2 parties :
            <ul>
                <li>un premier volet correspondant au signalement, à adresser « sans délai ».</li>
                <li>un deuxième volet précisant la gestion qui a été faite de l&apos;événement, à adresser au plus tard dans les 3 mois.</li>
            </ul>
            <br />
            <p>
                Un <b>évènement/incident structure (EIS)</b> est un évènement/incident dans un établissement ou un organisme est un évènement non lié
                aux soins pouvant avoir un impact sur la prise en charge des résidents/patients.
            </p>
            <p>
                Il est important de souligner que la déclaration des événements indésirables ne doit pas être perçue comme une preuve de mauvaise gestion de la part d&apos;un établissement, mais
                plutôt comme un outil permettant d&apos;identifier les problèmes et d&apos;améliorer continuellement la qualité des soins.
            </p>
            <u>Mode de calcul:</u>
            <br />
            <br />
            Nb d&apos;événements/incidents déclarés en cours par nature principale:
            <br />
            ·       Etat du signal = Initial, en gestion, à qualifier, à réguler, à valider.
            <br />
            Les évènements à l&apos;état «Interco» provenant d&apos;un autre système d&apos;information et qui n&apos;ont pas été classifiés par les ARS ne sont pas comptabilisés.
            <br />
            Nb d&apos;événements/incidents déclarés clôturés par nature principale:
            <br />
            ·       Etat du signal = Clôturé
            <br />
            ·       Motif de clôture = Géré, ne nécessitant pas de gestion, sans menace pour la santé publique, signal transféré.
            <br />
            Les évènements non validés dans SIVSS ne sont pas comptabilisés.
            <br />
            Identification de l&apos;établissement = numéro FINESS de l&apos;ET où est survenu l&apos;évènement, ou à défaut de renseignement de ce champ dans SIVSS,
            numéro FINESS de l&apos;ET déclarant. NB: si le déclarant a souhaité être anonyme, le signalement ne ressortira donc pas dans ces statistiques.
            <br />
            Année de référence = date de réception du signal.
            <br />
            <br />
            <p><b>Fréquence : </b> trimestrielle</p>
            <p><b>Source(s): </b> Système d&apos;Information de Veille et de Sécurité Sanitaire (SI VSS)</p>
            Le système dd&apos;information de veille et de sécurité sanitaire (SI VSS) a été mis en œuvre pour favoriser le partage
            dd&apos;informations et faciliter la coordination de la veille et de la sécurité sanitaire. Le SI VSS est un outil utilisé
            par les agents des ARS, et plus particulièrement par les équipes des points focaux régionaux (PFR) et les cellules
            de veille et dd&apos;alerte.
        </>
    );
};
