import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuAutorisationsProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  estEntitéJuridique?: boolean;
}>;

export const ContenuAutorisations = ({ dateDeMiseÀJour, source, estEntitéJuridique = false }: ContenuAutorisationsProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Seules les autorisations non caduques sont transmises à FINESS par ARHGOS et sont donc publiées.
          Hormis les autorisations en attente de première mise en œuvre, toutes les autorisations publiées peuvent donc être considérées
          comme actives.
        </p>
        <p>
          Dans le domaine sanitaire les autorisations sont données à une entité juridique puis mises en œuvre dans un établissement.
          Pour indiquer les services offerts, FINESS identifie ceux-ci à l’aide d’un triplet composé des éléments suivants :
          Activité/Modalité/Forme (AMF).
        </p>
        <p>
          Le régime des autorisations d’activités de soins et des équipements matériels lourds a été modifié au 1er juin 2023.
        </p>
        <p>
          Les autorisations délivrées avant cette date ont été prorogées jusqu’à la délivrance des nouvelles autorisations. Un cadre national de révision de ces autorisations se déroule sur les exercices 2024-2025.
        </p>
        <p>Cette réforme a notamment mené à l’élaboration d’une nouvelle nomenclature « Activité/Modalité/Mention/Pratique Thérapeutique Spécifique/Déclaration », dite « AMM ».</p>
        <p>  Elle remplace progressivement la nomenclature « Activité/Modalité/Forme », dite « AMF » et la nomenclature des « Equipements Matériels Lourds », dite « EML ». </p>
        <p>Ainsi, les autorisations « AMF » et « EML » disparaissent progressivement : elles sont remplacées par les autorisations « AMM », au fil des nouvelles autorisations délivrées, en demande initiale ou en renouvellement.</p>
        <p>
          Les activités de soins sont les activités des établissements sanitaires autorisées par arrêté du Directeur Général de l’ARS. <br />
          Les autres activités de soins sont soumises à l’autorisation du Directeur Général (DG) de l’ARS selon des modalités et des durées différentes particulières. <br />
          Une activité soumise à reconnaissance contractuelle est une activité non soumise à autorisation du DG ARS mais soumise à reconnaissance contractuelle dans le cadre et la durée du CPOM (contrat pluriannuel d’objectif et de moyens). <br />
          Les équipements matériels lourds (EML) sont mis en œuvre au sein d’établissements. Ce sont des équipements mobiliers destinés à pourvoir soit au diagnostic, soit à la thérapeutique, et dont les conditions d’installation et de fonctionnement sont particulièrement onéreuses.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Quotidien
        </p>
      </section>
      {estEntitéJuridique && (
        <section aria-label={wording.MODE_DE_CALCUL}>
          <p>
            <span className="fr-text--bold">Mode de calcul :</span> Les autorisations et capacités affichées au niveau de l’entité juridique (EJ) correspondent à l’ensemble des autorisations et capacités des établissements géographiques sanitaires rattachés à l’EJ.
          </p>
        </section>
      )}
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> Agence Régionale Hospitalière Gestion des Objectifs Sanitaire (ARHGOS) - Fichier National des Établissements Sanitaires et Sociaux (FINESS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Ces données prennent leur source dans le SI agence régionale hospitalière gestion des objectifs sanitaire (ARHGOS) et sont reprises dans le fichier
          national des établissements sanitaires et sociaux (FINESS). ARHGOS est l’outil de gestion des autorisations des activités de soins et des équipements
          matériels lourds (EML) pour les établissements sanitaires, ainsi que des activités soumises à reconnaissance contractuelle et des autres activités
          (pharmacies à usage intérieur, chirurgie esthétique, prélèvements de cellules, tissus et organes…).
        </p>
      </section>
    </>
  );
};
