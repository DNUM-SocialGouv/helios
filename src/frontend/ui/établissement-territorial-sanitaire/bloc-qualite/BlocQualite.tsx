import { memo } from "react";

import { ÉtablissementTerritorialQualiteSanitaireViewModel } from "./ÉtablissementTerritorialQualiteSanitaireViewModel";
import { convertDateDDMMYYYY } from "../../../utils/dateUtils";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueReclamations from "../../indicateur-métier/qualite/GraphiqueReclamations";
import { GraphiqueEvenementsIndesirables } from "../../établissement-territorial-médico-social/bloc-qualite/evenements-indesirables/GraphiqueEvenementsIndesirables";
import { GraphiqueInspectionsControles } from "../../établissement-territorial-médico-social/bloc-qualite/inspections-controles/GraphiqueInspectionsControles";

type BlocQualitéProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  etablissementTerritorialQualiteSanitairelViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

const BlocQualité = ({ etabFiness, etabTitle, etablissementTerritorialQualiteSanitairelViewModel, opnedBloc, toggelBlocs }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (etablissementTerritorialQualiteSanitairelViewModel.lesDonneesQualiteNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_QUALITE} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_QUALITE} toggelBlocs={toggelBlocs}>

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
        {!etablissementTerritorialQualiteSanitairelViewModel.lesInspectionsEtControlesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteSanitairelViewModel.lesInspectionsEtControlesNeSontPasAutorisées && (
            <GraphiqueInspectionsControles
              data={etablissementTerritorialQualiteSanitairelViewModel.getInspectionsEtControles}
              dateMiseAJour={convertDateDDMMYYYY(etablissementTerritorialQualiteSanitairelViewModel.dateMiseAJourSourceInspectionsEtControles)}
            />
          )}
      </ul>

      <ul className="indicateurs">
        {!etablissementTerritorialQualiteSanitairelViewModel.lesReclamationsNeSontPasRenseignées &&
          !etablissementTerritorialQualiteSanitairelViewModel.lesReclamationsNeSontPasAutorisées && (
            <GraphiqueReclamations
              annéesTotales={5}
              data={etablissementTerritorialQualiteSanitairelViewModel.buildReclamationsData}
              dateMiseAJour={etablissementTerritorialQualiteSanitairelViewModel.dateMiseAJour}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
            />
          )}
      </ul>
      <ul className="indicateurs">
        {!etablissementTerritorialQualiteSanitairelViewModel.lesEvenementsIndesirablesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteSanitairelViewModel.lesEvenementsIndesirablesNeSontPasAutorisées && (
            <GraphiqueEvenementsIndesirables
              annees={etablissementTerritorialQualiteSanitairelViewModel.anneesEIs}
              annéesTotales={5}
              data={etablissementTerritorialQualiteSanitairelViewModel.buildEIsData}
              dateMiseAJour={etablissementTerritorialQualiteSanitairelViewModel.dateMiseAJourEvenementsIndesirables}
            />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);
