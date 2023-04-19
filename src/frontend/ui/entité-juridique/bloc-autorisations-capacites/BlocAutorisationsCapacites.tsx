import { FEATURE_NAME } from "../../../utils/featureToggle";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { GraphiqueAutorisationsActivites } from "../../indicateur-métier/autorisations-activites/GraphiqueAutorisationsActivites";
import { GraphiqueAutresActivites } from "../../indicateur-métier/autres-activites/GraphiqueAutresActivites";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { GraphiqueReconnaissanceContractuelles } from "../../indicateur-métier/reconnaissance-contractuelles/GraphiqueReconnaissanceContractuelles";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";

type BlocAutorisationsCapacitesProps = Readonly<{
  entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;
}>;

export const BlocAutorisationsCapacites = ({ entitéJuridiqueAutorisationsCapacitesViewModel }: BlocAutorisationsCapacitesProps) => {
  const { wording, isFeatureEnabled } = useDependencies();

  if (
    (entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsCapacitesNeSontPasRenseignées &&
      entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() &&
      entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées() &&
      entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées()) ||
    (!isFeatureEnabled(FEATURE_NAME.CAPACITES_EJ) && !isFeatureEnabled(FEATURE_NAME.ACTIVITES))
  ) {
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
        {isFeatureEnabled(FEATURE_NAME.ACTIVITES) && !entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() && (
          <GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsActivités} />
        )}
        {isFeatureEnabled(FEATURE_NAME.ACTIVITES) && !entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() && (
          <GraphiqueAutresActivites entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autresActivités} />
        )}
        {isFeatureEnabled(FEATURE_NAME.ACTIVITES) && !entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées() && (
          <GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.reconnaissanceActivités} />
        )}
      </ul>
    </Bloc>
  );
};
