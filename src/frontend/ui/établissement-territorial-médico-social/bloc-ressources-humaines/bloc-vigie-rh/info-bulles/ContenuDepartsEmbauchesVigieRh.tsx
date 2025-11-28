import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDepartsEmbauchesVigieRh = ({ dateDeMiseAJour, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span> Décompte des entrées (nouveaux contrats) et sorties (fins de contrat) enregistrées dans la DSN au cours
          du trimestre.
        </p>
        <p>Permet de mesurer la dynamique de recrutement et de départs afin de suivre les pratiques de recrutement.</p>
        <p>Exemple : 1 même salarié qui réalise 2 contrats courts sur le trimestre, compte pour 2 entrées et 2 sorties.</p>
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
    </>
  );
};
