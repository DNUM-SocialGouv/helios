import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuNombreDePassagesAuxUrgencesProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  estEntitéJuridique?: boolean;
}>;

export const ContenuNombreDeJourneesUsld = ({ dateDeMiseÀJour, source, estEntitéJuridique = false }: ContenuNombreDePassagesAuxUrgencesProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Permet d’observer l’évolution de l’activité de l’unité de soins longue durée (USLD).
        </p>
        <p>
          Les unités de soins de longue durée (USLD) sont des structures d’hébergement et de soins qui accueillent majoritairement des personnes âgées de plus de 60 ans.
        </p>
        <p>
          Généralement adossées à un établissement hospitalier, les USLD s’adressent à des personnes dont l’état nécessite une surveillance médicale constante.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span> Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>
        <p>
          Nombre de journées réalisées pour l’année en hospitalisation complète. Si la personne effectue un séjour en MCO ou en SMR, ce séjour interrompt le comptage des journées en soins de longue durée (qui reprend après).
        </p>
        {estEntitéJuridique && (
          <p>
            L’activité affichée au niveau de l’entité juridique (EJ) correspond à la somme de l’activité du ou des établissements géographiques rattachés à
            l’EJ.
          </p>
        )}
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
        <p>
          Statistique annuelle des établissements de santé (SAE) - Direction de la Recherche, des Études, de l’Évaluation et des Statistiques (DREES).
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          La Statistique annuelle des établissements de santé (SAE) est une enquête administrative exhaustive obligatoire, réalisée chaque année par la DREES auprès de tous les établissements de santé de France, pour recueillir des informations sur leur activité, leurs capacités, leurs équipements, et leurs personnel médicaux et non-médicaux.
        </p>
        <p>
          Helios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};
