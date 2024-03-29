import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreDeJournéesPSYetSSR } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeJournéesPSYetSSR";
import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";

type GraphiquePsySSRProps = Readonly<{
  nombreJournéesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  estEntitéJuridique?: boolean;
}>;

export function GraphiquePsySSR({ nombreJournéesPsySSRViewModel, estEntitéJuridique = false }: GraphiquePsySSRProps) {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeJournéesPSYetSSR
          dateDeMiseÀJour={nombreJournéesPsySSRViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={nombreJournéesPsySSRViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
      identifiant="activite-1"
      nomDeLIndicateur={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
      source={wording.PMSI}
    >
      <HistogrammeVerticalABandes
        annéesTotales={nombreJournéesPsySSRViewModel.NOMBRE_ANNEES}
        créeLeLibelléDuTooltip={nombreJournéesPsySSRViewModel.tooltipJournéesPsyEtSsr}
        data={nombreJournéesPsySSRViewModel.histogrammeDataSet}
        id={nombreJournéesPsySSRViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
        idDeLaLégende={nombreJournéesPsySSRViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
        identifiants={nombreJournéesPsySSRViewModel.identifiants}
        libellés={nombreJournéesPsySSRViewModel.années}
        valeurs={nombreJournéesPsySSRViewModel.valeurs}
      />
    </IndicateurGraphique>
  );
}
