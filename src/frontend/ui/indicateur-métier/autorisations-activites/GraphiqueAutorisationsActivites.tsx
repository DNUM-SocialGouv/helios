import { AutorisationsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { AutorisationsTagMultiNiveaux } from "../../entité-juridique/bloc-autorisations-capacites/AutorisationsTagMultiNiveaux";
import { ContenuAutorisations } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuAutorisations";

type GraphiqueAutorisationsActivitesProps = Readonly<{
  entiteJuridiqueAutorisations: AutorisationsActivités;
}>;

export const GraphiqueAutorisationsActivites = ({ entiteJuridiqueAutorisations }: GraphiqueAutorisationsActivitesProps) => {
  const { wording } = useDependencies();
  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuAutorisations
          dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
          estEntitéJuridique={true}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        />
      }
      dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
      identifiant="autorisation-activites"
      nomDeLIndicateur={wording.AUTORISATIONS_ACTIVITES}
      source={Sources(wording.FINESS, wording.ARHGOS)}
    >
      <AutorisationsTagMultiNiveaux activites={entiteJuridiqueAutorisations.autorisations} />
    </IndicateurGraphique>
  );
};
