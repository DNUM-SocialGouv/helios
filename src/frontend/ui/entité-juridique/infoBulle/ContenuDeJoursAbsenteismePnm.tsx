import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDeJoursAbsenteismePnm = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuDeJoursAbsenteismePnm = ({ dateDeMiseÀJour, source }: ContenuDeJoursAbsenteismePnm) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Quotidienne
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <span className="fr-text--bold">Mode de calcul : </span>
        <p>Nombre de jours d’absence du personnel non médical</p>
        <p>La réalisation du bilan social est obligatoire pour les établissements
          (qu’ils soient sanitaires, sociaux ou médico-sociaux) dont l’effectif global au 31/12/n-1 est d’au moins 300 agents.
          Il est facultatif pour les autres établissements.</p>
      </section>
      <section aria-label={wording.SOURCES}>
        <span className="fr-text--bold">Source(s) : </span><p>Enquête « Bilan Social »- Agence technique de l’information sur l’hospitalisation (ATIH)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT qui est un système
          décisionnel national permettant de stocker des informations provenant de plusieurs sources.
          DIAMANT  : Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation.
        </p>
      </section>
    </>
  );
};
