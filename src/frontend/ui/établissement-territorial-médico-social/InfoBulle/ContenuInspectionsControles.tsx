import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuEvenementsIndesirablesProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuInspectionsControles = ({ dateDeMiseÀJour, source }: ContenuEvenementsIndesirablesProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <p>
        Les ARS mènent des missions d’inspection, contrôle et évaluation sur l’ensemble de leurs champs de compétence. Ces contrôles et inspections visent à
        constater un dysfonctionnement, un écart à la réglementation et aux bonnes pratiques puis ordonner ou recommander des solutions pour y remédier.
      </p>
      <p>
        <u>Type de mission:</u>
      </p>

      <p>
        Inspection : contrôle spécifique réalisé à partir d’une démarche sur place. Elle est notamment diligentée lorsqu'il existe des présomptions de
        dysfonctionnement et ses recommandations sont essentiellement de nature corrective.
      </p>
      <p>
        Contrôle : il vise à s'assurer qu’un service, un établissement ou un organisme se trouve dans une situation conforme à l'ensemble des normes qui
        constituent le référentiel d'organisation et de fonctionnement qui correspond à son statut. Le contrôle s'appuie sur deux modes d'investigation qui sont
        cumulables : le contrôle sur pièces et le contrôle sur site.
      </p>
      <p>
        Evaluation : démarche qui permet d’apprécier si les moyens mis en œuvre permettent de répondre aux attendus. Elle ne donne pas lieu à des mesures
        coercitives.
      </p>
      <p>
        Audit : examen formel, systématique et indépendant visant à s’assurer qu'un produit, un processus ou un système respecte les dispositions établies. Il
        permet d’identifier les écarts par rapport à un référentiel donné.
      </p>
      <p>
        Enquête administrative : contrôle dans le but d'enquêter sur la conduite d’un agent ou d’un groupe d'agents ou sur les mesures qu’ils ont prises à
        l'occasion d'une situation ou d'un événement ponctuel.
      </p>
      <p>Autres types de mission : visite de conformité, enquête médico-administrative, enquête autorisation Pharma-Bio, … </p>
      <p>
        <u>Titre de la mission :</u> thème régional de l’IC.
      </p>
      <p>
        <u>Type de planification Programmée/Hors programme :</u> Mission inscrite ou non au programme annuel d'inspection et de contrôle en fonction des
        orientations nationales et des priorités retenues par le PRS.
      </p>
      <p>
        <u>Nombre d’écarts et remarques :</u>

        <ul>
          <li>Ecarts : les écarts traduisent une non-conformité à une référence juridique opposable ;</li>
          <li>Remarques : les remarques traduisent des dysfonctionnements porteurs de risque. </li>
        </ul>
      </p>
      <p>
        <u>Nombre et types de décisions :</u>

        <ul>
          <li>Injonction : mesure corrective obligatoire </li>
          <li>Recommandation : mesure corrective conseillées </li>
          <li>Saisine : recours à une juridiction (juridiction ordinale, parquet, ...)</li>
        </ul>
      </p>

      <p>Historique : 3 ans et année en cours ou les dernières données disponibles si elles remontent à plus de 3 ans. </p>

      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <b>Fréquence : </b> trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <b>Source(s): </b> Système d’Information pour les Inspections Contrôles Evaluations et Audits (SIICEA).
        </p>
        SIICEA a pour objectifs de permettre un suivi de l'ensemble des missions (Inspection, Contrôle, Evaluation, Audit) sur les champs d'intervention des ARS
        (Sanitaire, Médico-Social et Santé Environnement).
      </section>
    </>
  );
};
