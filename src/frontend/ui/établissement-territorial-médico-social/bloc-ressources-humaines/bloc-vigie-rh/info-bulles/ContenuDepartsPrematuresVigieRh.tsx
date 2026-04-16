import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDepartsPrematuresVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
         Ruptures de contrats à durée indéterminée (CDI) durant l’année ayant eu une durée effective inférieure à six mois.  
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <p>
          <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} : </span>{" "}
          Indicateur de qualité de recrutement et d’intégration : un nombre élevé de contrats CDI   
          terminés prématurément peut traduire un problème dans l’accueil et/ou l’adéquation au poste.    
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} : </span>{" "}
           CDI terminés durant l’année       
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} : </span>{" "}Nombre de CDI       
        </p>
      </section>
     <section aria-label={wording.DATE_OBSERVATION}>
        <p>
          <span className="fr-text--bold">{wording.DATE_OBSERVATION} : </span>{" "}De janvier à décembre   
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
