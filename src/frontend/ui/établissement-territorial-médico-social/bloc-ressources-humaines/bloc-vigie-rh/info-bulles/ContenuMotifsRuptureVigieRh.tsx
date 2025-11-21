import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuMotifsRuptureVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, periodeGlissante }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();
  const periode = periodeGlissante ?? wording.NON_RENSEIGNÉ;

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span> Répartition des fins de contrat selon les motifs déclarés dans la DSN. Pour chaque motif, le décompte
          est réalisé sur les 12 derniers mois glissants.
        </p>
        <p>Permet d’identifier les principales causes de départ et adapter les actions RH pour améliorer la rétention de main d’oeuvre.</p>
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
