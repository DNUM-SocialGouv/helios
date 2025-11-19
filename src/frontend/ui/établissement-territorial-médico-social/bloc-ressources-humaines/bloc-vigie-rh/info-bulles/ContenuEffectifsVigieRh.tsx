import { ContenuVigieRhInfoBulleProps, formaterMiseAJourEtDonnees } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuEffectifsVigieRh = ({ dateDeMiseAJour, dateDonneesArretees }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{formaterMiseAJourEtDonnees(wording, dateDeMiseAJour, dateDonneesArretees)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          <span className="fr-text--bold">Définition :</span> Décompte du nombre de personnes physiques présentes parmi les effectifs durant le mois, ventilés par
          filières (Médical, Soins, Social & Éducatif, Administration/Technique/Logistique). Les personnes physiques sont identifiées parmi les contrats déclarés par
          l’établissement en DSN,
        </p>
        <p>! Cet indicateur ne tient pas compte du temps de travail de chaque poste (ETP)</p>
        <p>Exemple : 1 salarié a mi temps sur le mois compte néanmoins comme 1 personne physique  parmi les effectifs.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Mensuelle
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
