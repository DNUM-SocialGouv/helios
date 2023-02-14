import { Bar } from "react-chartjs-2";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { TableIndicateur } from "../../commun/TableIndicateur/TableIndicateur";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
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
      <>
        <Bar data={nombreJournéesPsySSRViewModel.histogrammeDataSet} options={nombreJournéesPsySSRViewModel.getOptionsHistogramme()} />
        <menu
          className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]}
          id={nombreJournéesPsySSRViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
        />
        <TableIndicateur
          entêteLibellé={wording.ANNÉE}
          identifiants={nombreJournéesPsySSRViewModel.identifiants}
          libellés={nombreJournéesPsySSRViewModel.années}
          valeurs={nombreJournéesPsySSRViewModel.valeurs}
        />
      </>
    </IndicateurGraphique>
  );
}
