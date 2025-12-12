import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTopTauxRotationVigieRh = ({ dateDeMiseAJour, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span>
        </p>
        <p>Numérateur : (Nombre d’entrées ( nouveaux contrats)  + Nombre de sorties (fins de contrat) /2) </p>
        <p>Dénominateur : Effectif moyen sur le trimestre.Ainsi, plus le taux est élevé, plus le renouvellement des équipes a été important au cours du trimestre.</p>
        <p>La variation en pourcentage indique l’évolution de l’effectif total par rapport à la même période de l’année précédente, permettant de suivre la tendance d’évolution (croissance, baisse).</p>
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
