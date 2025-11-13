import { ActivitesMensuelViewModel } from "./EntitéJuridiqueActivitésMensuelsViewModel";
import { EntiteJuridiqueActivitesViewModel } from "./EntitéJuridiqueActivitésViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { GraphiqueNombreHAD } from "../../indicateur-métier/nombre-de-had/GraphiqueNombreHAD";
import { GraphiqueNombreDeSejourMCO } from "../../indicateur-métier/nombre-de-sejour-mco/GraphiqueNombreDeSejourMCO";
import { GraphiquePsySSR } from "../../indicateur-métier/nombre-journees-psy-ssr/GraphiquePsySSR";
import { GraphiqueNombreDeJourneesUsld } from "../../indicateur-métier/nombre-journees-usld/GraphiqueNombreDeJourneesUsld";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";

type BlocActivitéSanitaireProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  entitéJuridiqueActivitéViewModel: EntiteJuridiqueActivitesViewModel;
  entitéJuridiqueActivitéMensuelleViewModel: ActivitesMensuelViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocActivitéSanitaire = ({ etabTitle, etabFiness, entitéJuridiqueActivitéViewModel, entitéJuridiqueActivitéMensuelleViewModel, opnedBloc, toggelBlocs }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (entitéJuridiqueActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs}>
      {entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasAutorisés.length !== 0 ? (
        <NotAUthorized indicateurs={entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasAutorisés} />
      ) : entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasRenseignees.length !== 0 ? (
        <NoDataCallout indicateurs={entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasRenseignees} />
      ) : (
        <></>
      )}

      <ul className="indicateurs">
        {entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés &&
          entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés ? (
          <GraphiqueNombreDeSejourMCO
            activitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
            estEntitéJuridique={true}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            nombreDeSejourMCOViewModel={entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel} />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé &&
          entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés ? (
          <GraphiquePsySSR
            activitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
            estEntitéJuridique={true}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            nombreJournéesPsySSRViewModel={entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel} />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombreHADEstIlAutorisé && entitéJuridiqueActivitéViewModel.nombreHADEstIlRenseigné() ? (
          <GraphiqueNombreHAD
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            nombreHADViewModel={entitéJuridiqueActivitéViewModel.nombreHADViewModel} />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombreJourneesUsldEstIlAutorise && entitéJuridiqueActivitéViewModel.nombreJourneesUsldEstIlRenseigne() ? (
          <GraphiqueNombreDeJourneesUsld
            estEntitéJuridique={true}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            nombreDeJourneesUsldViewModel={entitéJuridiqueActivitéViewModel.nombreDeJourneesUsldViewModel}
          />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlAutorisé && entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlRenseigné() ? (
          <GraphiqueNombrePassageUrgence
            estEntitéJuridique={true}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            nombrePassageAuxUrgencesViewModel={entitéJuridiqueActivitéViewModel.nombreDePassageAuxUrgencesViewModel}
          />
        ) : (
          <></>
        )}
      </ul>
    </Bloc>
  );
};
