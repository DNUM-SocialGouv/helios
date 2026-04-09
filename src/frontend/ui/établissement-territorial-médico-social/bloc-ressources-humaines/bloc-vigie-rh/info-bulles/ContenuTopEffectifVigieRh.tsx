import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTopEffectifVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Nombre de personnes physiques présentes dans l’établissement le dernier jour du mois.   
          Une personne est comptée si un contrat couvre la date considérée, quel que soit son temps   
          de travail ou son nombre de contrats.  
        </p>
        <p>
          Un salarié ou agent employé à mi-temps sur tout le mois est compté comme 1 personne   
          physique. De la même manière, un salarié ou agent ayant effectué plusieurs contrats dans   
          l’établissement sur le mois est compté comme 1 personne physique.  
        </p>
      </section>
      <section aria-label={wording.INDICATION_VARIATION}>
        <p>
          <span className="fr-text--bold">{wording.INDICATION_VARIATION} : </span> 
          Évolution relative en pourcentage par rapport au même mois de l’année précédente  
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <p>
          <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} : </span> 
          Indicateur central pour suivre la dynamique des effectifs réels, repérer les hausses ou   
          baisses d’activité et situer les tendances d’évolution de l’établissement.   
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} : </span> 
          Personnes physiques en fin de mois     
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} : </span> 
           Nombre de personnes ,  <span className="fr-text--bold">{wording.VARIATION}</span>  en %        
        </p>
      </section>
     <section aria-label={wording.DATE_OBSERVATION}>
        <p>
          <span className="fr-text--bold">{wording.DATE_OBSERVATION} : </span>  Dernier jour du mois  
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Mensuelle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">{wording.SOURCES} :</span> DSN (Déclaration Sociale Nominative) - Données arrêtées :  {dateDonneesArretees}
        </p>
      </section>
    </>
  );
};
