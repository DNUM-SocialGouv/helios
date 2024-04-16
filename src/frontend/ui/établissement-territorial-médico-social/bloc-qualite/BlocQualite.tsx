import { memo } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueReclamations from "../../indicateur-métier/qualite/GraphiqueReclamations";
import { GraphiqueEvenementsIndesirables } from "./evenements-indesirables/GraphiqueEvenementsIndesirables";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./ÉtablissementTerritorialQualiteMédicoSocialViewModel";

type BlocQualitéProps = Readonly<{
  etablissementTerritorialQualiteMédicoSocialViewModel: ÉtablissementTerritorialQualiteMédicoSocialViewModel;
}>;

const BlocQualité = ({ etablissementTerritorialQualiteMédicoSocialViewModel }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (etablissementTerritorialQualiteMédicoSocialViewModel.lesDonneesQualiteNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_QUALITE} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_QUALITE}>
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
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasAutorisées && (
            <GraphiqueReclamations
              data={etablissementTerritorialQualiteMédicoSocialViewModel.buildReclamationsData}
              dateMiseAJour={etablissementTerritorialQualiteMédicoSocialViewModel.dateMiseAJour}
            />
          )}
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesEvenementsIndesirablesNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesEvenementsIndesirablesNeSontPasAutorisées && (
            <GraphiqueEvenementsIndesirables
              annees={etablissementTerritorialQualiteMédicoSocialViewModel.anneesEIs}
              data={etablissementTerritorialQualiteMédicoSocialViewModel.buildEIsData}
              dateMiseAJour={etablissementTerritorialQualiteMédicoSocialViewModel.dateMiseAJourEvenementsIndesirables}
            />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);
