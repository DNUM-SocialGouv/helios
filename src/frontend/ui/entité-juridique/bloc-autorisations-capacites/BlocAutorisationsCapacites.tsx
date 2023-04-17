import { FEATURE_NAME } from "../../../utils/featureToggle";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { ContenuAutorisations } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuAutorisations";
import { AutorisationsTagMultiNiveaux } from "./AutorisationsTagMultiNiveaux";
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
          contenuInfoBulle={<ContenuAutorisations dateDeMiseÀJour="" estEntitéJuridique={true} source={Sources(wording.FINESS, wording.ARHGOS)} />}
          dateDeMiseÀJour=""
          identifiant="autorisation-activites"
          nomDeLIndicateur={wording.AUTORISATIONS_ACTIVITES}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        >
          <AutorisationsTagMultiNiveaux activites={entitéJuridiqueAutorisationsCapacitesViewModel.autorisations} />
        </IndicateurGraphique>
      </ul>
    </Bloc>
  );
};
