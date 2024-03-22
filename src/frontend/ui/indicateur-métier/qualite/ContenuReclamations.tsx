import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuReclamationsProps = Readonly<{
    dateDeMiseÀJour: string;
    source: ReactElement;
}>;

export const ContenuReclamations = ({ dateDeMiseÀJour, source }: ContenuReclamationsProps) => {
    const { wording } = useDependencies();

    return (
        <>
            <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
            Une réclamation correspond à une requête, doléance ou plainte écrite émanant d&apos;un usager ou de
            son entourage et mettant en cause la qualité du service rendu.
            <br />
            <br />
            <u>Mode de calcul:</u>
            <br />
            <br />
            Nombre annuel total/en cours/clôturées de réclamations sur l&apos;année. Ces indicateurs peuvent être différents
            de la somme des réclamations par motif car il peut y avoir plusieurs motifs pour une réclamation.
            <br />
            Nombre annuel total de réclamations en cours par motif de niveau 1: Statut SIREC de la réclamation =
            &quot;Identification&quot;, &quot;Affectation&quot;, &quot;Traitement&quot; et &quot;Réponse&quot;.
            <br />
            Nombre annuel total de réclamations clôturées par motif de niveau 1: Statut SIREC de la
            réclamation = &quot;Clôturée&quot;, &quot;Clôturé sans suite&quot; et &quot;Clôturé hors compétence&quot;.
            <br />
            <br />
            <p>Listes des motifs de niveau 1 SIREC:</p>
            <ul>
                <li>Hôtellerie-locaux-restauration</li>
                <li>Problème d&apos;organisation ou de fonctionnement de l&apos;établissement ou du service</li>
                <li>Problème de qualité des soins médicaux</li>
                <li>Problème de qualité des soins paramédicaux</li>
                <li>Recherche d&apos;établissement ou d&apos;un professionnel</li>
                <li>Mise en cause attitude des professionnels</li>
                <li>Maltraitance</li>
                <li>Informations et droits des usagers</li>
                <li>Facturation et honoraires</li>
                <li>Santé-environnementale</li>
                <li>Activités d&apos;esthétique réglementées</li>
                <li>À renseigner</li>
                <li>COVID-19</li>
            </ul>
            <br />
            Année de référence = date de réception à l&apos;ARS.
            <br />
            <br />
            <section aria-label={wording.FRÉQUENCE}>
                <p><span className="fr-text--bold">Fréquence : </span> trimestrielle</p>
            </section>
            <section aria-label={wording.SOURCES}>
                <p><span className="fr-text--bold">Source(s): </span> Système d&apos;Information Réclamations (SI REC)</p>
                Le Système d&apos;Information Réclamations est l&apos;outil de gestion des réclamations
                d’usagers qui apporte une visibilité sur le suivi et le traitement de la réclamation en ARS.
            </section>
        </>
    );
};
