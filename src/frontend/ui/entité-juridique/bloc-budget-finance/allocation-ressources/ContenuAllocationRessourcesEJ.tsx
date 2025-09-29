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
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        {comparaison && <p>
          Pour la campagne et le type d’établissement sélectionnés, cette enveloppe fait partie des 3 premières enveloppes attribuées.
        </p>}
        <p>
          L’application HAPI « Autres champs » outille le processus de gestion et d’attribution des ressources liées aux enveloppes MIGAC, DAF, USLD, Forfait et
          FMESPP d’une part, et, le pilotage et l’ordonnancement des dépenses du fonds d’intervention régional (FIR) d’autre part.
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>

        <p>Montant des crédits alloués par enveloppes, sous enveloppes et mode délégation, par campagne budgétaire.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Quotidienne
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> HAPI (HArmonisation et Partage d’Information) - Autres champs.
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};
