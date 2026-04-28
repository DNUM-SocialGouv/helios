import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuPyramideAgesVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Répartition des personnes physiques par tranches d’âge, calculée à partir de l’effectif observé au dernier jour de l’année.  
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} :</span>{" "}
        <p>
          Indicateur démographique permettant d’anticiper les besoins de renouvellement des effectifs, les   
          départs liés à l’âge et les déséquilibres générationnels.    
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} :</span>{" "} 
          Personnes physiques   
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} :</span>{" "} 
           Nombre de personnes       
        </p>
      </section>
     <section aria-label={wording.DATE_OBSERVATION}>
        <p>
          <span className="fr-text--bold">{wording.DATE_OBSERVATION} :</span>{" "}  Dernier jour de l’année 
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span>{" "}Annuelle
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
