import { AutorisationActivitesAmm, AutorisationsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { AutorisationsAmmTagMultiNiveaux, AutorisationsTagMultiNiveaux } from "../../entité-juridique/bloc-autorisations-capacites/AutorisationsTagMultiNiveaux";
import { ContenuAutorisations } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuAutorisations";

type GraphiqueAutorisationsActivitesProps = Readonly<{
  entiteJuridiqueAutorisations: AutorisationsActivités;
  entiteJuridiqueAutorisationsAmm: AutorisationActivitesAmm;
}>;

export const GraphiqueAutorisationsActivites = ({ entiteJuridiqueAutorisations, entiteJuridiqueAutorisationsAmm }: GraphiqueAutorisationsActivitesProps) => {
  const { wording } = useDependencies();

  const parseDate = (dateMiseAJour: string) => {
    const [day, month, year] = dateMiseAJour.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const dateMiseAJourRecente = parseDate(entiteJuridiqueAutorisations.dateMiseÀJourSource) > parseDate(entiteJuridiqueAutorisationsAmm.dateMiseÀJourSource)
    ? entiteJuridiqueAutorisations.dateMiseÀJourSource
    : entiteJuridiqueAutorisationsAmm.dateMiseÀJourSource;

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuAutorisations
          dateDeMiseÀJour={dateMiseAJourRecente}
          estEntitéJuridique={true}
          source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
        />
      }
      dateDeMiseÀJour={dateMiseAJourRecente}
      identifiant="autorisation-activites"
      nomDeLIndicateur={wording.AUTORISATIONS_ACTIVITES}
      source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
    >
      <>
        <AutorisationsAmmTagMultiNiveaux activites={entiteJuridiqueAutorisationsAmm.autorisations} />
        <AutorisationsTagMultiNiveaux activites={entiteJuridiqueAutorisations.autorisations} type="autorisation-activites" />
      </>
    </IndicateurGraphique>
  );
};
