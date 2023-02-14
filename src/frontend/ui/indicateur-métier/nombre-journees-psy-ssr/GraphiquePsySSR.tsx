import { Bar } from "react-chartjs-2";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { TableIndicateur } from "../../commun/TableIndicateur/TableIndicateur";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { ContenuNombreDeJournéesPSYetSSR } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeJournéesPSYetSSR";
import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";

export function GraphiquePsySSR(props: { nombreJournéesPsySSRViewModel: NombreDeJourneesPsySSRViewModel }) {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeJournéesPSYetSSR
          dateDeMiseÀJour={props.nombreJournéesPsySSRViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={props.nombreJournéesPsySSRViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
      identifiant="activite-1"
      nomDeLIndicateur={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
      source={wording.PMSI}
    >
      <>
        <Bar data={props.nombreJournéesPsySSRViewModel.histogrammeDataSet} options={props.nombreJournéesPsySSRViewModel.getOptionsHistogramme()} />
        <menu
          className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]}
          id={props.nombreJournéesPsySSRViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
        />
        <TableIndicateur
          entêteLibellé={wording.ANNÉE}
          identifiants={props.nombreJournéesPsySSRViewModel.identifiants}
          libellés={props.nombreJournéesPsySSRViewModel.années}
          valeurs={props.nombreJournéesPsySSRViewModel.valeurs}
        />
      </>
    </IndicateurGraphique>
  );
}
