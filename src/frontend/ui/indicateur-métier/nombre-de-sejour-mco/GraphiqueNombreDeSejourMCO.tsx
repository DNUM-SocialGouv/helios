import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreDeSéjourMCO } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeSéjourMCO";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

type GraphiqueNombreDeSejourMCOProps = Readonly<{
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombreDeSejourMCO = ({ nombreDeSejourMCOViewModel, estEntitéJuridique = false }: GraphiqueNombreDeSejourMCOProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeSéjourMCO
          dateDeMiseÀJour={nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
      identifiant="activite-0"
      nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
      source={wording.PMSI}
    >
      <HistogrammeVerticalABandes
        annéesTotales={nombreDeSejourMCOViewModel.NOMBRE_ANNEES}
        créeLeLibelléDuTooltip={nombreDeSejourMCOViewModel.tooltipSéjoursMCO}
        data={nombreDeSejourMCOViewModel.getHistogrammeDataSet()}
        id={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
        idDeLaLégende={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
        identifiants={nombreDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
        libellés={nombreDeSejourMCOViewModel.années}
        valeurs={nombreDeSejourMCOViewModel.getValeurTableIndicateur()}
      />
    </IndicateurGraphique>
  );
};
