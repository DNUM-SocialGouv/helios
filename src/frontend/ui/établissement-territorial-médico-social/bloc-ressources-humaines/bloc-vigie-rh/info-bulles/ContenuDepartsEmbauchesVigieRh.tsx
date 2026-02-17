import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDepartsEmbauchesVigieRh = ({ dateDeMiseAJour, source, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseAJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Nombre de nouveaux contrats et de fins de contrats enregistrés dans la
          DSN au cours du trimestre.
        </p>
        <p>Permet de mesurer la dynamique de recrutement et de départs afin de suivre les pratiques de recrutement.  </p>
        <p>Exemple : 1 même salarié qui réalise 2 contrats courts sur le trimestre, compte pour 2 entrées et 2 sorties.  </p>
        <p>
          La notion de contrat renvoie ici à toutes les formes d’exercice d’emploi (CDI,
          CDD, agents titulaires, contrats aidés, alternances, stages) hors interim.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Trimestrielle
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
