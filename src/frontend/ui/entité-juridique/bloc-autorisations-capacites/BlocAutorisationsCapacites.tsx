import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { GraphiqueAutorisationsActivites } from "../../indicateur-métier/autorisations-activites/GraphiqueAutorisationsActivites";
import { GraphiqueAutresActivites } from "../../indicateur-métier/autres-activites/GraphiqueAutresActivites";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { GraphiqueEquipementMateriauxLourds } from "../../indicateur-métier/equipements-materiaux-lourds/GraphiqueEquipementMateriauxLourds";
import { GraphiqueReconnaissanceContractuelles } from "../../indicateur-métier/reconnaissance-contractuelles/GraphiqueReconnaissanceContractuelles";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";

type BlocAutorisationsCapacitesProps = Readonly<{
  entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;
}>;

export const BlocAutorisationsCapacites = ({ entitéJuridiqueAutorisationsCapacitesViewModel }: BlocAutorisationsCapacitesProps) => {
  const { wording } = useDependencies();

  if (
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsCapacitesNeSontPasRenseignées &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées() &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées() &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasRenseignées()
  ) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      <ul className="indicateurs">
        <GraphiqueCapacitésParActivité
          estEntitéJuridique
          estSanitaire={false}
          graphiqueCapacitésParActivitéViewModel={entitéJuridiqueAutorisationsCapacitesViewModel.graphiqueCapacitesParActivitesViewModel}
        />
        {!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() && (
          <GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsActivités} />
        )}
        {!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées() && (
          <GraphiqueAutresActivites entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autresActivités} />
        )}
        {!entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées() && (
          <GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.reconnaissanceActivités} />
        )}
        {!entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasRenseignées() && (
          <GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={entitéJuridiqueAutorisationsCapacitesViewModel.equipementsLourds} />
        )}
      </ul>
    </Bloc>
  );
};
