import { memo } from "react";

import { GraphiqueEvenementsIndesirables } from "./evenements-indesirables/GraphiqueEvenementsIndesirables";
import { GraphiqueInspectionsControles } from "./inspections-controles/GraphiqueInspectionsControles";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./ÉtablissementTerritorialQualiteMédicoSocialViewModel";
import { convertDateDDMMYYYY } from "../../../utils/dateUtils";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueReclamations from "../../indicateur-métier/qualite/GraphiqueReclamations";
import { GraphiqueCertificationQualiscope } from "../../établissement-territorial-sanitaire/bloc-qualite/CertificationHAS/GraphiqueCertificationQualiscope";

type BlocQualitéProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  etablissementTerritorialQualiteMédicoSocialViewModel: ÉtablissementTerritorialQualiteMédicoSocialViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

const BlocQualité = ({ etabFiness, etabTitle, etablissementTerritorialQualiteMédicoSocialViewModel, opnedBloc, toggelBlocs }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (etablissementTerritorialQualiteMédicoSocialViewModel.lesDonneesQualiteNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_QUALITE} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_QUALITE} toggelBlocs={toggelBlocs}>

      {etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasAutorisés.length !== 0 ? (
        <NotAUthorized indicateurs={etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasAutorisés} />
      ) : (
        <></>
      )}

      {etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasRenseignees.length !== 0 ? (
        <NoDataCallout indicateurs={etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasRenseignees} />
      ) : (
        <></>
      )}

      <ul className="indicateurs">
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesInspectionsEtControlesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesInspectionsEtControlesNeSontPasAutorisées && (
            <GraphiqueInspectionsControles
              data={etablissementTerritorialQualiteMédicoSocialViewModel.getInspectionsEtControles}
              dateMiseAJour={convertDateDDMMYYYY(etablissementTerritorialQualiteMédicoSocialViewModel.dateMiseAJourSourceInspectionsEtControles)}
            />
          )}
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasAutorisées && (
            <GraphiqueReclamations
              annéesTotales={3}
              data={etablissementTerritorialQualiteMédicoSocialViewModel.buildReclamationsData}
              dateMiseAJour={etablissementTerritorialQualiteMédicoSocialViewModel.dateMiseAJour}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
            />
          )}
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesEvenementsIndesirablesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesEvenementsIndesirablesNeSontPasAutorisées && (
            <GraphiqueEvenementsIndesirables
              annees={etablissementTerritorialQualiteMédicoSocialViewModel.anneesEIs}
              annéesTotales={3}
              data={etablissementTerritorialQualiteMédicoSocialViewModel.buildEIsData}
              dateMiseAJour={etablissementTerritorialQualiteMédicoSocialViewModel.dateMiseAJourEvenementsIndesirables}
            />
          )}
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesDonneesHASNeSontPasAutorisees &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesDonneesHASNeSontPasRenseignees && (
            <GraphiqueCertificationQualiscope
              hasFichePath={wording.HAS_FICHE_MS_PATH + etabFiness}
            />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);
