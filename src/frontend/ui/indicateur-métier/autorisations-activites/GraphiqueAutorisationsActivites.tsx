import { AutorisationActivites } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { AutorisationsTagMultiNiveaux } from "../../entité-juridique/bloc-autorisations-capacites/AutorisationsTagMultiNiveaux";
import { ContenuAutorisations } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuAutorisations";

type GraphiqueAutorisationsActivitesProps = Readonly<{
  entiteJuridiqueAutorisations: AutorisationActivites[];
}>;

export const GraphiqueAutorisationsActivites = ({ entiteJuridiqueAutorisations }: GraphiqueAutorisationsActivitesProps) => {
  const { wording } = useDependencies();
  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuAutorisations dateDeMiseÀJour="" estEntitéJuridique={true} source={Sources(wording.FINESS, wording.ARHGOS)} />}
      dateDeMiseÀJour=""
      identifiant="autorisation-activites"
      nomDeLIndicateur={wording.AUTORISATIONS_ACTIVITES}
      source={Sources(wording.FINESS, wording.ARHGOS)}
    >
      <AutorisationsTagMultiNiveaux activites={entiteJuridiqueAutorisations} />
    </IndicateurGraphique>
  );
};
