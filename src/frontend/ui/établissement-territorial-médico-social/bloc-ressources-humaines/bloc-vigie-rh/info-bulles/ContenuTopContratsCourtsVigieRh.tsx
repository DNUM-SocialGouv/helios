import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTopContratsCourtsVigieRh = ({ dateDeMiseAJour, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span>
        </p>
        <p>Part des CDD &lt; 6 mois sur le total des CDD. Pour chaque durée, le décompte est réalisé sur les <span className="fr-text--bold"> 12 derniers mois glissants. </span> </p>
        <p>Permet de repérer la dépendance aux contrats ultra-courts.  </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">{wording.SOURCES} :</span> DSN (Déclaration Sociale Nominative)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          La variation en pourcentage indique l’évolution du taux de contrat court par rapport à la même période de l’année précédente, permettant de
          suivre la tendance d’évolution (croissance, baisse).
        </p>
      </section>
    </>
  );
};
