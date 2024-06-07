import { InspectionControleDataTheme } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuInspectionsControles } from "../../InfoBulle/ContenuInspectionsControles";
import InspectionsControlesTagMultiNiveaux from "./InspectionsControlesTagMultiNiveaux";

type GraphiqueInspectionsControlesProps = Readonly<{
  data: InspectionControleDataTheme[];
  dateMiseAJour: string;
}>;

export const GraphiqueInspectionsControles = ({ data, dateMiseAJour }: GraphiqueInspectionsControlesProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuInspectionsControles dateDeMiseÀJour={dateMiseAJour} source={wording.SIICEA} />}
      dateDeMiseÀJour={dateMiseAJour}
      identifiant="qualite-inspections-controles"
      nomDeLIndicateur={wording.INSPECTIONS_CONTROLES}
      source={wording.SIICEA}
    >
      <InspectionsControlesTagMultiNiveaux data={data} />
    </IndicateurGraphique>
  );
};
