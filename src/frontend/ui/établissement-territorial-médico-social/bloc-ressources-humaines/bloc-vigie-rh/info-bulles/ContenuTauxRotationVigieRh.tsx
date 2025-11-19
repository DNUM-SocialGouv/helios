import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTauxRotationVigieRh = ({ dateDeMiseAJour, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span>
        </p>
        <p>Numérateur : (Nombre d’entrées (nouveaux contrats) (préciser type)  + Nombre de sorties (fins de contrat) /2) </p>
        <p>Dénominateur : Effectif moyen sur le trimestre.</p>
        <p>Permet de suivre la stabilité des équipes. Ainsi, plus le taux est élevé, plus le renouvellement des équipes a été important au cours du trimestre.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">{wording.SOURCES} :</span> DSN
        </p>
      </section>
    </>
  );
};
