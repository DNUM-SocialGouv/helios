import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { ContenuNombreDeJournéesPSYetSSR } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeJournéesPSYetSSR";
import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";
import { NombreDeJournneesPsySsrHistogrammes } from "./NombreDeJournneePsySsrHistogrammes";

type GraphiquePsySSRProps = Readonly<{
  nombreJournéesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  estEntitéJuridique?: boolean;
}>;

export function GraphiquePsySSR({ nombreJournéesPsySSRViewModel, activitéMensuelleViewModel, estEntitéJuridique = false }: GraphiquePsySSRProps) {
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
      <NombreDeJournneesPsySsrHistogrammes
        activitéMensuelleViewModel={activitéMensuelleViewModel}
        nombreDeJourneePsySsrViewModel={nombreJournéesPsySSRViewModel}
      />
    </IndicateurGraphique>
  );
}
