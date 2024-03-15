import { memo } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueReclamations from "../../indicateur-métier/qualite/GraphiqueReclamations";
import { GraphiqueEvenementsIndesirables } from "../../établissement-territorial-médico-social/bloc-qualite/evenements-indesirables/GraphiqueEvenementsIndesirables";
import { ÉtablissementTerritorialQualiteSanitaireViewModel } from "./ÉtablissementTerritorialQualiteSanitaireViewModel";

type BlocQualitéProps = Readonly<{
  etablissementTerritorialQualiteSanitairelViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
}>;

const BlocQualité = ({ etablissementTerritorialQualiteSanitairelViewModel }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (
    etablissementTerritorialQualiteSanitairelViewModel.lesDonneesQualiteNeSontPasRenseignées
  ) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_QUALITE} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_QUALITE}>
      {etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasRenseignees.length !== 0 ? (
        <NoDataCallout indicateurs={etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasRenseignees} />
      ) : etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasAutorisés.length !== 0 ? (
        <NotAUthorized indicateurs={etablissementTerritorialQualiteSanitairelViewModel.lesDonnéesQualitePasAutorisés} />
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
            <GraphiqueEvenementsIndesirables />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);
