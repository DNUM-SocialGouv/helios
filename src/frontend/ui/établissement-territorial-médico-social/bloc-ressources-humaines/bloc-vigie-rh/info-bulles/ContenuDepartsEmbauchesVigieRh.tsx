import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDepartsEmbauchesVigieRh = ({ dateDeMiseAJour, source, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Mesure le nombre de personnes physiques ayant rejoint ou quitté l’établissement entre   
          deux périodes consécutives (trimestre ou année), à partir de la comparaison des personnes   
          présentes au dernier jour de chaque période.  
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} :</span>{" "}
        <p>
          <br/> 
          Indicateur décrivant la dynamique des effectifs en personnes entre deux périodes.  
          Il permet d’identifier les arrivées, les départs, et la variation nette d’effectif.     
        <br/>
          Cet indicateur porte uniquement sur les personnes et ne dépend pas du nombre de contrats   
          successifs détenus par un même salarié ou agent.    
        </p>
      </section>
      <section aria-label={wording.PRESENCE_PERIODE}>
        <span className="fr-text--bold">{wording.PRESENCE_PERIODE} :</span>{" "}
        <p>
          <br/>
          Une personne est considérée comme présente dans une période si elle possède un contrat   
          actif à la date de fin de la période (dernier jour du trimestre ou de l’année).   
          <br/>
          Les mouvements sont calculés par comparaison entre les personnes présentes/absentes au   
          dernier jour de deux périodes consécutives.
          <br/>
          Entrée : personne absente au dernier jour de T-1 (ou N−1) et présente au dernier jour de T (ou N).   
           <br/>
          Sortie : personne présente au dernier jour de T-1 (ou N−1)  et absente au dernier jour de T (ou N).  
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} :</span>{" "} Personnes physiques       
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} :</span>{" "}Nombre de personnes         
        </p>
      </section>


      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span>{" "}Trimestrielle  ou annuelle  
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
