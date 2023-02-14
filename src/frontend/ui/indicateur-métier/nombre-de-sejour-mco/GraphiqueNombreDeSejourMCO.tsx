import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreDeSéjourMCO } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeSéjourMCO";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

type GraphiqueNombreDeSejourMCOProps = Readonly<{
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
}>;
export const GraphiqueNombreDeSejourMCO = ({ nombreDeSejourMCOViewModel }: GraphiqueNombreDeSejourMCOProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeSéjourMCO
          dateDeMiseÀJour={nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
      identifiant="activite-0"
      nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
      source={wording.PMSI}
    >
      {nombreDeSejourMCOViewModel.nombreDeSéjoursMédecineChirurgieObstétrique}
    </IndicateurGraphique>
  );
};
