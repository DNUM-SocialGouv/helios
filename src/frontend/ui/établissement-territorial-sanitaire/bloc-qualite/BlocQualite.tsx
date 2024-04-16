import { memo } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueReclamations from "../../indicateur-métier/qualite/GraphiqueReclamations";
import { GraphiqueEvenementsIndesirables } from "../../établissement-territorial-médico-social/bloc-qualite/evenements-indesirables/GraphiqueEvenementsIndesirables";
import { GraphiqueInspectionsControles } from "../../établissement-territorial-médico-social/bloc-qualite/inspections-controles/GraphiqueInspectionsControles";
import { ÉtablissementTerritorialQualiteSanitaireViewModel } from "./ÉtablissementTerritorialQualiteSanitaireViewModel";
import { convertDate } from "../../établissement-territorial-médico-social/bloc-qualite/inspections-controles/card-inspection-controle/CardInspectionControle";

type BlocQualitéProps = Readonly<{
  etablissementTerritorialQualiteSanitairelViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
}>;

const staticDataToReplace = [
  {
    typeMission: "Evaluation",
    themeRegional: "1 Gestion des risques sanitaires liées aux batiments dans les ESMS",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 0,
    nombreRemarque: 0,

    injonction: 0,
    recommandation: 0,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 0,
    saisineParquet: 0,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Inopinée",
  },
  {
    typeMission: "Evaluation",
    themeRegional: "2 Thème régionale 2",
    dateVisite: "2020-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 1,
    recommandation: 1,
    prescription: 1,
    saisineCng: 1,
    saisineJuridiction: 1,
    saisineParquet: 1,
    saisineAutre: 1,

    typePlannification: "Programmé",
    modaliteMission: "Inopinée",
  },
  {
    typeMission: "Evaluation",
    themeRegional: "3 Thème régionale 3",
    dateVisite: "2025-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 0,
    nombreRemarque: 0,

    injonction: 0,
    recommandation: 2,
    prescription: 0,
    saisineCng: 8,
    saisineJuridiction: 8,
    saisineParquet: 0,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Annocée",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "4 Thème régionale 4",
    dateVisite: "2028-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Hors programme",
    modaliteMission: "",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "5 Thème régionale 4",
    dateVisite: "2021-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "6 Thème régionale 4",
    dateVisite: "2020-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "7 Thème régionale 4",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "8 Thème régionale 4",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "9 Thème régionale 4",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
  {
    typeMission: "Evaluation",

    themeRegional: "10 Thème régionale 4",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },

  {
    typeMission: "Inspection",
    themeRegional: "Thème régionale A",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    nombreEcart: 5,
    nombreRemarque: 0,

    injonction: 3,
    recommandation: 2,
    prescription: 0,
    saisineCng: 0,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
  {
    typeMission: "Inspection22",
    themeRegional: "Thème régionale B",
    dateVisite: "2022-12-19",
    dateRapport: "2022-12-22",

    injonction: 0,
    recommandation: 2,
    prescription: 0,
    saisineCng: 1,
    saisineJuridiction: 8,
    saisineParquet: 9,
    saisineAutre: 0,

    typePlannification: "Programmé",
    modaliteMission: "Hors programme",
  },
];

function transformDataInspections(data) {
  console.log("data Before transform :::", data);
  const groupedData = {};

  // Parcours de chaque élément et regroupement par typeMission
  data.forEach((item) => {
    if (!(item.typeMission in groupedData)) {
      groupedData[item.typeMission] = {
        libelleTheme: item.typeMission,
        data: [],
      };
    }
    // Ajout de l'élément dans le tableau correspondant
    groupedData[item.typeMission].data.push(item);
  });

  // Tri des éléments par dateVisite
  for (const key in groupedData) {
    groupedData[key].data.sort((a, b) => {
      const dateA = new Date(a.dateVisite);
      const dateB = new Date(b.dateVisite);
      return dateB - dateA;
    });
  }

  // Conversion du dictionnaire en tableau
  const result = Object.values(groupedData);
  console.log("data after transform :::", result);
  return result;
}

const BlocQualité = ({ etablissementTerritorialQualiteSanitairelViewModel }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (etablissementTerritorialQualiteSanitairelViewModel.lesDonneesQualiteNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_QUALITE} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_QUALITE}>
      <ul className="indicateurs">
        {!etablissementTerritorialQualiteSanitairelViewModel.lesEvenementsIndesirablesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteSanitairelViewModel.lesEvenementsIndesirablesNeSontPasAutorisées && (
            <GraphiqueInspectionsControles
              data={transformDataInspections(staticDataToReplace)}
              //data={transformDataInspections(etablissementTerritorialQualiteSanitairelViewModel.getInspectionsEtControles.inspectionsEtControles)}
              dateMiseAJour={convertDate(etablissementTerritorialQualiteSanitairelViewModel.getInspectionsEtControles.dateMiseAJourSource)}
            />
          )}
      </ul>
      index 1 ---
      {etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasAutorisés.length !== 0 ? (
        <NotAUthorized indicateurs={etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasAutorisés} />
      ) : (
        <></>
      )}
      {etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasRenseignees.length !== 0 ? (
        <NoDataCallout indicateurs={etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasRenseignees} />
      ) : (
        <></>
      )}
      <ul className="indicateurs">
        {!etablissementTerritorialQualiteSanitairelViewModel.lesReclamationsNeSontPasRenseignées &&
          !etablissementTerritorialQualiteSanitairelViewModel.lesReclamationsNeSontPasAutorisées && (
            <GraphiqueReclamations
              data={etablissementTerritorialQualiteSanitairelViewModel.buildReclamationsData}
              dateMiseAJour={etablissementTerritorialQualiteSanitairelViewModel.dateMiseAJour}
            />
          )}
      </ul>
      <ul className="indicateurs">
        {!etablissementTerritorialQualiteSanitairelViewModel.lesEvenementsIndesirablesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteSanitairelViewModel.lesEvenementsIndesirablesNeSontPasAutorisées && (
            <GraphiqueEvenementsIndesirables
              annees={etablissementTerritorialQualiteSanitairelViewModel.anneesEIs}
              data={etablissementTerritorialQualiteSanitairelViewModel.buildEIsData}
              dateMiseAJour={etablissementTerritorialQualiteSanitairelViewModel.dateMiseAJourEvenementsIndesirables}
            />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);
