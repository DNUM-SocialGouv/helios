import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDureeCddVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, periodeGlissante }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();
  const periode = periodeGlissante ?? wording.NON_RENSEIGNÉ;

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span> Repartiton des CDD selon leur durée moyenne (Moins d’1 semaine, 1 à 3 mois , 3-6 mois, etc.). Pour
          chaque durée, le décompte est réalisé sur les 12 derniers mois glissants.
        </p>
        <p>Permet de repérer la dépendance aux contrats courts et ajuster la politique d’emploi pour renforcer la stabilité des équipes.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> sur 12 derniers mois glissants ({periode})
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
