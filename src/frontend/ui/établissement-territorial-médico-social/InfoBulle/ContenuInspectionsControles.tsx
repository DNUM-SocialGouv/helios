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
        Les ARS mènent des missions d&#39;inspection, contrôle et évaluation sur l&#39;ensemble de leurs champs de compétence. Ces contrôles et inspections
        visent à constater un dysfonctionnement, un écart à la réglementation et aux bonnes pratiques puis ordonner ou recommander des solutions pour y
        remédier.
      </p>
      <p>
        <u>Type de mission:</u>
      </p>

      <p>
        Inspection : contrôle spécifique réalisé à partir d&#39;une démarche sur place. Elle est notamment diligentée lorsqu&#39;il existe des présomptions de
        dysfonctionnement et ses recommandations sont essentiellement de nature corrective.
      </p>
      <p>
        Contrôle : il vise à s&#39;assurer qu&#39;un service, un établissement ou un organisme se trouve dans une situation conforme à l&#39;ensemble des normes
        qui constituent le référentiel d&#39;organisation et de fonctionnement qui correspond à son statut. Le contrôle s&#39;appuie sur deux modes
        d&#39;investigation qui sont cumulables : le contrôle sur pièces et le contrôle sur site.
      </p>
      <p>
        Evaluation : démarche qui permet d&#39;apprécier si les moyens mis en œuvre permettent de répondre aux attendus. Elle ne donne pas lieu à des mesures
        coercitives.
      </p>
      <p>
        Audit : examen formel, systématique et indépendant visant à s&#39;assurer qu&#39;un produit, un processus ou un système respecte les dispositions
        établies. Il permet d&#39;identifier les écarts par rapport à un référentiel donné.
      </p>
      <p>
        Enquête administrative : contrôle dans le but d&#39;enquêter sur la conduite d&#39;un agent ou d&#39;un groupe d&#39;agents ou sur les mesures
        qu&#39;ils ont prises à l&#39;occasion d&#39;une situation ou d&#39;un événement ponctuel.
      </p>
      <p>Autres types de mission : visite de conformité, enquête médico-administrative, enquête autorisation Pharma-Bio, … </p>
      <p>
        <u>Titre de la mission :</u> thème régional de l&#39;IC.
      </p>
      <p>
        <u>Type de planification Programmée/Hors programme :</u> Mission inscrite ou non au programme annuel d&#39;inspection et de contrôle en fonction des
        orientations nationales et des priorités retenues par le PRS.
      </p>
      <div>
        <u>Nombre d&#39;écarts et remarques :</u>

        <ul>
          <li>Ecarts : les écarts traduisent une non-conformité à une référence juridique opposable ;</li>
          <li>Remarques : les remarques traduisent des dysfonctionnements porteurs de risque. </li>
        </ul>
      </div>
      <br />
      <div>
        <u>Nombre et types de décisions :</u>

        <ul>
          <li>Injonction : mesure corrective obligatoire </li>
          <li>Recommandation : mesure corrective conseillées </li>
          <li>Saisine : recours à une juridiction (juridiction ordinale, parquet, ...)</li>
        </ul>
      </div>
      <br />

      <p>Historique : 3 ans et année en cours ou les dernières données disponibles si elles remontent à plus de 3 ans. </p>

      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <b>Fréquence : </b> trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <b>Source(s): </b> Système d&#39;Information pour les Inspections Contrôles Evaluations et Audits (SIICEA).
        </p>
        SIICEA a pour objectifs de permettre un suivi de l&#39;ensemble des missions (Inspection, Contrôle, Evaluation, Audit) sur les champs d&#39;intervention
        des ARS (Sanitaire, Médico-Social et Santé Environnement).
      </section>
    </>
  );
};
