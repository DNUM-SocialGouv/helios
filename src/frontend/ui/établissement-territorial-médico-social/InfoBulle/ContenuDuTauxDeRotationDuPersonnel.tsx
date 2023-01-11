import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDuTauxDeRotationDuPersonnelProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuDuTauxDeRotationDuPersonnel = ({ dateDeMiseÀJour, source }: ContenuDuTauxDeRotationDuPersonnelProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Cet indicateur permet d’estimer la stabilité des effectifs CDI ou titulaires ainsi que l’importance du renouvellement des équipes. Ainsi, plus le taux
          est élevé, plus le renouvellement des équipes a été important au cours de l’année.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
          Numérateur : Somme du taux d’entrée et du taux de sortie
        </p>
        <ul>
          <li>Taux d’entrée : Nombre de recrutements au cours de l’année / Effectifs réels en nombre de personnes au 31/12/N-1</li>
          <li>Taux de sortie : Nombre de départs dans l’année / Effectifs réels en nombre de personnes au 31/12/N-1</li>
        </ul>
        <p>Dénominateur : 2</p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Tableau de bord de la performance dans le secteur médico-social - Agence technique de l’information sur l’hospitalisation (ATIH)
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
