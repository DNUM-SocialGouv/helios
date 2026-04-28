import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTopContratsCourtsVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Proportion de CDD terminés dont la durée effective est inférieure à six mois, 
          calculée parmi l’ensemble des CDD terminés au cours du dernier trimestre disponible.
        </p>
        <p>
          La durée effective correspond au nombre de jours calendaires entre la date de début et la date de fin du contrat, 
          connue avec certitude lorsque le contrat se termine. En cas de rupture anticipée,
          la date réelle de fin de contrat est prise en compte, et non la date prévisionnelle déclarée lors de la création du contrat.
        </p>
      </section>
      <section aria-label={wording.INDICATION_VARIATION}>
        <p>
          <span className="fr-text--bold">{wording.INDICATION_VARIATION} :</span>{" "}
          Evolution absolue en points de pourcentage par rapport à la même période de l’année   
          précédente
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <p>
          <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} :</span>{" "} 
          Permet d’analyser le recours aux CDD courts et d’identifier des pratiques d’emploi   
          potentiellement instables et/ou très mobiles.    
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} :</span>{" "} 
          CDD terminés durant le trimestre       
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} :</span>{" "} 
            pourcentage (%) , <span className="fr-text--bold">{wording.VARIATION}</span> en pp (% abs.)       
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span>{" "} Trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">{wording.SOURCES} :</span>{" "}DSN (Déclaration Sociale Nominative) - Données arrêtées :  {dateDonneesArretees}
        </p>
      </section>
    </>
  );
};
