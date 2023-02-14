import { Bar } from "react-chartjs-2";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { TableIndicateur } from "../../commun/TableIndicateur/TableIndicateur";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
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
      <>
        <Bar data={nombreDeSejourMCOViewModel.getHistogrammeDataSet()} options={nombreDeSejourMCOViewModel.getOptionsHistogramme()} />
        <menu
          className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]}
          id={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
        />
        <TableIndicateur
          entêteLibellé={wording.ANNÉE}
          identifiants={nombreDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
          libellés={nombreDeSejourMCOViewModel.années}
          valeurs={nombreDeSejourMCOViewModel.getValeurTableIndicateur()}
        />
      </>
    </IndicateurGraphique>
  );
};
