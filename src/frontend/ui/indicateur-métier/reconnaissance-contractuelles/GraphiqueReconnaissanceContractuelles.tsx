import { AutorisationsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { AutorisationsTagMultiNiveaux } from "../../entité-juridique/bloc-autorisations-capacites/AutorisationsTagMultiNiveaux";
import { ContenuReconnaissancesContractuelles } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuReconnaissancesContractuelles";

type GraphiqueReconnaissanceContractuellesProps = Readonly<{
  entiteJuridiqueAutorisations: AutorisationsActivités;
}>;

export const GraphiqueReconnaissanceContractuelles = ({ entiteJuridiqueAutorisations }: GraphiqueReconnaissanceContractuellesProps) => {
  const { wording } = useDependencies();
  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuReconnaissancesContractuelles
          dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
          estEntitéJuridique={true}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        />
      }
      dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
      identifiant="reconnaissance-contractuelles"
      nomDeLIndicateur={wording.RECONNAISSANCES_CONTRACTUELLES}
      source={Sources(wording.FINESS, wording.ARHGOS)}
    >
      <AutorisationsTagMultiNiveaux activites={entiteJuridiqueAutorisations.autorisations} type="reconnaissance-contractuelles" />
    </IndicateurGraphique>
  );
};
