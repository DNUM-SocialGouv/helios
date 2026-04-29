import { ReactElement } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";

type ContenuAllocationRessourcesEJProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  comparaison: boolean;
}>;

export const ContenuAllocationRessourcesEJ = ({ dateDeMiseÀJour, source, comparaison }: ContenuAllocationRessourcesEJProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseÀJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        {comparaison && <p>
          Pour la campagne et le type d’établissement sélectionnés, cette enveloppe fait partie des 3 premières enveloppes attribuées.
        </p>}
        <p>
          L’application HAPI « Autres champs » outille le processus de gestion et d’attribution des ressources liées aux enveloppes MIGAC, DAF, USLD, Forfait et
          FMESPP d’une part, et, le pilotage et l’ordonnancement des dépenses du fonds d’intervention régional (FIR) d’autre part.
        </p>
        <p>STARS FIR est l’outil national de gestion entre les ARS et leurs partenaires des demandes de subvention du Fonds d’Intervention Régional (FIR).</p>
        <p>Les données de ressources des années antérieures à 2024 proviennent de l’application HAPI.</p>
        <p><strong>En 2025, HAPI est remplacé par STARS FIR.</strong> La campagne 2025 est en cours de traitement et n’est pas disponible.</p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>
        <p>HAPI : Montant des crédits alloués par enveloppes, sous enveloppes et mode délégation, par campagne budgétaire.</p>
        <p>STARS FIR : Montant des crédits alloués par enveloppe et sous enveloppes par campagne budgétaire.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Quotidienne pour les données de la campagne 2026 issues de STARS FIR
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> HAPI (HArmonisation et Partage d’Information) - Autres champs, STARS FIR.
        </p>
      </section>
    </>
  );
};
