import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuNatureContratsVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Nombre de contrats débutés pendant la période, répartis entre postes permanents (CDI et fonctionnaires titulaires) et CDD.  
        </p>
        <p>
          Exemple : un même salarié ou agent ayant débuté 2 CDD sur la période se traduira par le décompte de 2 nouveaux CDD.  
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <p>
          <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} :</span>{" "} 
          Indicateur de stabilité contractuelle et de structure de l’emploi.     
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} :</span>{" "} 
          Contrats débutés, CDI et assimilés (fonctionnaires titulaires) et CDD uniquement.    
        </p>
      </section>
      <section aria-label={wording.EXCLUSIONS}>
        <p>
          <span className="fr-text--bold">{wording.EXCLUSIONS} :</span>{" "} 
          Intérim, alternance, stages, contrats aidés.    
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} :</span>{" "} 
           Nombre de nouveaux contrats         
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span>{" "}Trimestrielle ou annuelle
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
