import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuRésultatNetComptableProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuNombreHAD = ({ dateDeMiseÀJour, source }: ContenuRésultatNetComptableProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Permet d’observer l’évolution de l’activité de l’établissement et le développement des prises en charge ambulatoires.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Mensuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de Calcul : </span>
          Nombre de séjours commencés lors de la période étudiée (mais pas nécessairement terminés).
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Hospitalisation A Domicile (HAD) - fichiers RAPSS (Résumés Anonyme Par Sous-Séquence) Hélios collecte ces données depuis le SI mutualisé des ARS
          DIAMANT qui est un système décisionnel national permettant de stocker des informations provenant de plusieurs sources. DIAMANT : Décisionnel Inter-ARS
          pour la Maîtrise et l’Anticipation.
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Dans le cadre du PMSI, tout séjour dans un établissement de santé, public ou privé, fait l’objet d’un recueil systématique et minimal d’informations
          administratives et médicales qui sont utilisées principalement pour le financement des établissements de santé (tarification à l’activité) et pour
          l’organisation de l’offre de soins (planification).
        </p>
      </section>
    </>
  );
};
