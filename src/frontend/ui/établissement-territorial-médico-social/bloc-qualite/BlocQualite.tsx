import { memo } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueReclamations from "../../indicateur-métier/qualite/GraphiqueReclamations";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./ÉtablissementTerritorialQualiteMédicoSocialViewModel";

type BlocQualitéProps = Readonly<{
  etablissementTerritorialQualiteMédicoSocialViewModel: ÉtablissementTerritorialQualiteMédicoSocialViewModel;
}>;

const BlocQualité = ({ etablissementTerritorialQualiteMédicoSocialViewModel }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (
    etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasRenseignées
  ) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_QUALITE} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_QUALITE}>
      {etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasRenseignees.length !== 0 ? (
        <NoDataCallout indicateurs={etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasRenseignees} />
      ) : etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasAutorisés.length !== 0 ? (
        <NotAUthorized indicateurs={etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasAutorisés} />
      ) : (
        <></>
      )}

      <ul className="indicateurs">
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasAutorisées && (
            <GraphiqueReclamations
              data={etablissementTerritorialQualiteMédicoSocialViewModel.buildReclamationsData}
            />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);
