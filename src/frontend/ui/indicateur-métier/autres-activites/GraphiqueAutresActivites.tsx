import { AutorisationsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { AutorisationsTagMultiNiveaux } from "../../entité-juridique/bloc-autorisations-capacites/AutorisationsTagMultiNiveaux";
import { ContenuAutresActivités } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuAutresActivités";

type GraphiqueAutresActivitesProps = Readonly<{
  entiteJuridiqueAutorisations: AutorisationsActivités;
}>;

export const GraphiqueAutresActivites = ({ entiteJuridiqueAutorisations }: GraphiqueAutresActivitesProps) => {
  const { wording } = useDependencies();
  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuAutresActivités
          dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
          estEntitéJuridique={true}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        />
      }
      dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
      identifiant="autorisation-activites"
      nomDeLIndicateur={wording.AUTRES_ACTIVITÉS}
      source={Sources(wording.FINESS, wording.ARHGOS)}
    >
      <AutorisationsTagMultiNiveaux activites={entiteJuridiqueAutorisations.autorisations} type="autorisation-activites" />
    </IndicateurGraphique>
  );
};
