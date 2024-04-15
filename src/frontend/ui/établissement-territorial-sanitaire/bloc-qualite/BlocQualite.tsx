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

type BlocQualitéProps = Readonly<{
  etablissementTerritorialQualiteSanitairelViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
}>;

export const staticDataToReplace = [
  {
    libelleTheme: "Evaluation",

    data: [
      {
        typeMission: "Evaluation",
        themeRegional: "1 Gestion des risques sanitaires liées aux batiments dans les ESMS",
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

        nombreEcart: 4,
        nombreRemarque: 12,

        injonction: 3,
        recommandation: 2,
        prescription: 0,
        saisineCng: 8,
        nb_saisines_juridiction_CN: 8,
        saisineJuridiction: 8,
        saisineParquet: 9,
        saisineAutre: 0,

        typePlannification: "Programmé",
        modaliteMission: "Inopinée",
      },
      {
        typeMission: "Evaluation",
        themeRegional: "2 Thème régionale 2",
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
    ],
  },

  {
    libelleTheme: "Inspection",
    data: [
      {
        typeMission: "Inspection",
        themeRegional: "Thème régionale A",
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
        themeRegional: "Thème régionale B",
        dateVisite: "17/11/2021",
        dateRapport: "03/12/2021",

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
    ],
  },

  {
    libelleTheme: "Controle sur pièce",
    data: [],
  },
];

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
            <GraphiqueInspectionsControles data={staticDataToReplace} dateMiseAJour="22/01/2027" />
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
