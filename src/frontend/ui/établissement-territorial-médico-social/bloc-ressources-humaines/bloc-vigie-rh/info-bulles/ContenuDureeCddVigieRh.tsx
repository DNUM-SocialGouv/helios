import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDureeCddVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseAJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Répartition des CDD selon leur durée effective (nombre de jours de contrat) :  <br />
          - Moins d’1 semaine <br />
          - Entre 1 semaine et 1 mois (inclus)  <br />
          - Entre 1 mois et 3 mois (inclus)  <br />
          - Entre 3 et 6 mois (inclus)  <br />
          - Entre 6 et 12 mois (inclus)  <br />
          - Plus de 12 mois
        </p>
        <p>Le décompte est réalisé pour les CDD terminés au cours des 12 derniers mois glissants.  </p>
        <p>Permet de repérer la dépendance aux contrats courts et ajuster la politique d’emploi pour renforcer la stabilité des équipes.</p>
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
