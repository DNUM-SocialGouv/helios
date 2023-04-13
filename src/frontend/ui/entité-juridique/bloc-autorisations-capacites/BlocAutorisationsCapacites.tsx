import { FEATURE_NAME } from "../../../utils/featureToggle";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { TagMultiNiveauxMock } from "../../commun/Graphique/TagMultiNiveaux";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";

type BlocAutorisationsCapacitesProps = Readonly<{
  entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;
}>;

export const BlocAutorisationsCapacites = ({ entitéJuridiqueAutorisationsCapacitesViewModel }: BlocAutorisationsCapacitesProps) => {
  const { wording, isFeatureEnabled } = useDependencies();

  if (entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsCapacitesNeSontPasRenseignées || !isFeatureEnabled(FEATURE_NAME.CAPACITES_EJ)) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      <ul className="indicateurs">
        {isFeatureEnabled(FEATURE_NAME.CAPACITES_EJ) &&
          entitéJuridiqueAutorisationsCapacitesViewModel.graphiqueCapacitesParActivitesViewModel.lesCapacitésParActivitésSontEllesRenseignées && (
            <GraphiqueCapacitésParActivité
              estEntitéJuridique
              graphiqueCapacitésParActivitéViewModel={entitéJuridiqueAutorisationsCapacitesViewModel.graphiqueCapacitesParActivitesViewModel}
            />
          )}
        <IndicateurGraphique
          contenuInfoBulle={<></>}
          dateDeMiseÀJour="20/20/2022"
          identifiant="test bloc multi niveau"
          nomDeLIndicateur="test bloc multi niveau"
          source={<>toto</>}
        >
          <TagMultiNiveauxMock />
        </IndicateurGraphique>
      </ul>
    </Bloc>
  );
};
