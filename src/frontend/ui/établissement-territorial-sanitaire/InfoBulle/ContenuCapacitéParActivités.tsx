import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuCapacitéParActivitésProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuCapacitéParActivités = ({ dateDeMiseÀJour, source }: ContenuCapacitéParActivitésProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Permet de caractériser les capacités d’accueil de l’établissement et les alternatives à l’hospitalisation conventionnelle avec nuitée dont il dispose.
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
          Nombre de lits MCO : Le nombre de lits installés correspond aux lits intégrés au sein de services d’hospitalisation complète, y compris
          l’hospitalisation de semaine.
          <br />
          <br />
          Nombre de places MCO : Le nombre de places installées au 31 décembre de l’année est égal au nombre de patients pouvant être accueillis en même temps.
          <br />
          <br />
          Nombre de lits SSR : Le nombre de lits installés au 31 décembre de l’année est égal à la somme du nombre de lits en état d’accueillir des malades.
          <br />
          <br />
          Nombre de places SSR : Le nombre de places installées au 31 décembre de l’année en hospitalisation à temps partiel de jour ou de nuit est égal au
          nombre de patients pouvant être accueillis en même temps.
          <br />
          <br />
          Nombre de lits PSY (capacité en HC) : le nombre de lits installés au 31 décembre de l’année est égal à la somme du nombre de lits en état d’accueillir
          des malades et du nombre de de patients pouvant être pris en charge simultanément en hospitalisation à domicile (HAD).
          <br />
          <br />
          Nombre de places PSY : Le nombre de places installées au 31 décembre de l’année en hospitalisation à temps partiel de jour ou de nuit est égal au
          nombre de patients pouvant être accueillis en même temps, hors prise en charge ambulatoire.
          <br />
          <br />
          Nombre de lits USLD : Le nombre de lits installés au 31 décembre de l’année est égal à la somme du nombre de lits en état d’accueillir des malades.
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Statistique annuelle des établissements de santé (SAE) - Direction de la Recherche, des Études, de l’Évaluation et des Statistiques (DREES).
          <br />
          <br />
          DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. » est un outil décisionnel de pilotage centré sur la régulation de l’offre de
          soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          La Statistique annuelle des établissements de santé (SAE) est une enquête administrative exhaustive obligatoire, réalisée chaque année par la DREES
          auprès de tous les établissements de santé de France, pour recueillir des informations sur leur activité, leurs capacités, leurs équipements, et leurs
          personnel médicaux et non-médicaux.
        </p>
      </section>
    </>
  );
};
