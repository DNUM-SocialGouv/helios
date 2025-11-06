import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuReconnaissancesContractuellesProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  estEntitéJuridique?: boolean;
}>;

export const ContenuReconnaissancesContractuelles = ({ dateDeMiseÀJour, source, estEntitéJuridique }: ContenuReconnaissancesContractuellesProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Une activité soumise à reconnaissance contractuelle est une activité non soumise au régime juridique des autorisations mais soumise à reconnaissance contractuelle par l’ARS dans le cadre et la durée du CPOM (contrat pluriannuel d’objectif et de moyens).</p>
        <p>Les reconnaissances contractuelles sont délivrées à une entité juridique pour une mise en œuvre au sein d’un établissement géographique. Seules les reconnaissances contractuelles en cours sont actuellement affichées.</p>
        <p>Les reconnaissances contractuelles sont composées de trois niveaux : Reconnaissance contractuelle / Modalité / Forme.</p>
      </section >
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Hebdomadaire
        </p>
      </section>
      {
        estEntitéJuridique && (
          <section aria-label={wording.MODE_DE_CALCUL}>
            <p>
              <span className="fr-text--bold">Mode de calcul :</span> Les reconnaissances contractuelles affichées au niveau de l’entité juridique (EJ) correspondent à l’ensemble des reconnaissances contractuelles des établissements géographiques sanitaires rattachés à l’EJ.
            </p>
          </section>
        )
      }
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> Agence Régionale Hospitalière Gestion des Objectifs Sanitaire (ARHGOS) - Fichier National des Établissements Sanitaires et Sociaux (FINESS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Ces données prennent leur source dans ARHGOS et sont reprises dans le fichier national des établissements sanitaires et sociaux (FINESS).
          <br />
          ARHGOS est l’outil de gestion des reconnaissances contractuelles, des autres activités de soins ainsi que des pharmacies à usage intérieur (PUI).
        </p>
      </section>
    </>
  );
};
