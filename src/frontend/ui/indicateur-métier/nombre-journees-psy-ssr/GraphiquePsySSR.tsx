import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from "../../établissement-territorial-sanitaire/bloc-activité/ÉtablissementTerritorialSanitaireActivitéViewModel";
import { ContenuNombreDeJournéesPSYetSSR } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeJournéesPSYetSSR";

export function GraphiquePsySSR(props: { nombreJournéesPsySSRViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel }) {
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
      {props.nombreJournéesPsySSRViewModel.nombreDeJournéesPsyEtSsr}
    </IndicateurGraphique>
  );
}
