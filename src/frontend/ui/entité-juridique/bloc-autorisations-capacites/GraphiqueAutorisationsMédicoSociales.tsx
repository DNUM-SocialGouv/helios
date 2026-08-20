import { AutorisationsTagMultiNiveaux } from "./AutorisationsTagMultiNiveaux";
import { AutorisationsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuAutorisations } from "../../établissement-territorial-médico-social/InfoBulle/ContenuAutorisations";

type GraphiqueAutorisationsMédicoSocialesProps = Readonly<{
  entiteJuridiqueAutorisations: AutorisationsActivités;
}>;

export const GraphiqueAutorisationsMédicoSociales = ({ entiteJuridiqueAutorisations }: GraphiqueAutorisationsMédicoSocialesProps) => {
  const { paths, wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuAutorisations
          dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        />
      }
      dateDeMiseÀJour={entiteJuridiqueAutorisations.dateMiseÀJourSource}
      identifiant="autorisations-médico-sociales-entité-juridique"
      nomDeLIndicateur={wording.AUTORISATIONS_MS}
      source={Sources(wording.FINESS, wording.ARHGOS)}
    >
      <AutorisationsTagMultiNiveaux
        activites={entiteJuridiqueAutorisations.autorisations}
        cheminÉtablissement={paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}
        type="autorisations-médico-sociales"
      />
    </IndicateurGraphique>
  );
};
