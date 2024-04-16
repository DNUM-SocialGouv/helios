import { InspectionControleDataTheme } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphiqueNoYears } from "../../../commun/IndicateurGraphiqueNoYears/IndicateurGraphiqueNoYears";
import { ContenuInspectionsControles } from "../../InfoBulle/ContenuInspectionsControles";
import InspectionsControlesTagMultiNiveaux from "./InspectionsControlesTagMultiNiveaux";

type GraphiqueInspectionsControlesProps = Readonly<{
  data: InspectionControleDataTheme[];
  dateMiseAJour: string;
}>;

export const GraphiqueInspectionsControles = ({ data, dateMiseAJour }: GraphiqueInspectionsControlesProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphiqueNoYears
      contenuInfoBulle={<ContenuInspectionsControles dateDeMiseÀJour={dateMiseAJour} source={wording.SIVSS} />}
      dateDeMiseÀJour={dateMiseAJour}
      identifiant="qualite-inspections-controles"
      nomDeLIndicateur={wording.INSPECTIONS_CONTROLES}
      source={wording.SIVSS}
    >
      <InspectionsControlesTagMultiNiveaux data={data} />
    </IndicateurGraphiqueNoYears>
  );
};
