import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDuNombreDEtpPm = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuDuNombreDEtpPm = ({ dateDeMiseÀJour, source }: ContenuDuNombreDEtpPm) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Quotidienne
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <span className="fr-text--bold">Mode de calcul : </span>
        <p>Nombre d’équivalents temps pleins moyens rémunérés personnel médical</p>
      </section>
      <section aria-label={wording.SOURCES}>
        <span className="fr-text--bold">Source(s) : </span>
        <p>Application Nationale Compte financier Rapport infra-annuel Eprd  (ANCRE) - Agence technique de l’information sur l’hospitalisation (ATIH)</p>
        <br />
        <p>Fichier de la campagne CF;</p>
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
