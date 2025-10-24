import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuAutresActivitésProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  estEntitéJuridique?: boolean;
}>;

export const ContenuAutresActivités = ({ dateDeMiseÀJour, source, estEntitéJuridique = false }: ContenuAutresActivitésProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Une autorisation d’autre activité de soins est une décision administrative,
          délivrée par arrêté du Directeur général de l’Agence régionale de santé,
          permettant à un établissement de santé d’exercer ces autres activités (chirurgie esthétique, dépôt de sang, lactarium, etc.).
          Ces autres activités ne relèvent pas du régime juridique des autorisations d’activités de soins et sont encadrées par des textes spécifiques du Code de la santé publique.
        </p>
        <p>Les autres activités de soins sont composées de trois niveaux : Autre activité / Modalité / Forme.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Hebdomadaire
        </p>
      </section>
      {estEntitéJuridique && (
        <section aria-label={wording.MODE_DE_CALCUL}>
          <p>
            <span className="fr-text--bold">Mode de calcul :</span> Les autorisations affichées au niveau de l’entité juridique (EJ) correspondent à l’ensemble des autorisations et capacités des établissements géographiques sanitaires rattachés à l’EJ.
          </p>
        </section>
      )}
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> Agence Régionale Hospitalière Gestion des Objectifs Sanitaire (ARHGOS) - Fichier National des Établissements Sanitaires et Sociaux (FINESS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Ces données prennent leur source dans ARHGOS et sont reprises dans le fichier national des établissements sanitaires et sociaux (FINESS).
          <br />
          ARHGOS est l’outil de gestion des reconnaissances contractuelles, des autres activités de soins ainsi que des pharmacies à usage intérieur (PUI).
        </p>
      </section>
    </>
  );
};
