import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTopEffectifVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseAJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Nombre de personnes physiques présentes parmi les effectifs de l’établissement durant le mois.
        </p>
        <p>
          Les personnes physiques sont identifiées parmi les contrats déclarés par l’établissement en DSN.
          Cet indicateur ne tient pas compte du temps de travail de chaque poste (concept distinct de l’emploi ETP)
        </p>
        <p>
          Exemple : 1 salarié a mi temps sur le mois compte néanmoins comme 1 personne physique parmi les effectifs.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Mensuelle
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          La variation indique l’évolution relative (en pourcentage) de l’effectif
          total par rapport à la même période de l’année précédente, permettant
          de suivre la tendance d’évolution des effectifs.
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
