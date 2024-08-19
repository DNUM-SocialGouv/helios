import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { GraphiqueNombreHAD } from "../../indicateur-métier/nombre-de-had/GraphiqueNombreHAD";
import { GraphiqueNombreDeSejourMCO } from "../../indicateur-métier/nombre-de-sejour-mco/GraphiqueNombreDeSejourMCO";
import { GraphiquePsySSR } from "../../indicateur-métier/nombre-journees-psy-ssr/GraphiquePsySSR";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";
import { EntitéJuridiqueActivitésViewModel } from "./EntitéJuridiqueActivitésViewModel";

type BlocActivitéSanitaireProps = Readonly<{
  entitéJuridiqueActivitéViewModel: EntitéJuridiqueActivitésViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocActivitéSanitaire = ({ entitéJuridiqueActivitéViewModel, opnedBloc, toggelBlocs }: BlocActivitéSanitaireProps) => {
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
<<<<<<< HEAD
          entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés ? (
=======
          entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés ? (
>>>>>>> origin/master
          <GraphiqueNombreDeSejourMCO estEntitéJuridique={true} nombreDeSejourMCOViewModel={entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel} />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé &&
<<<<<<< HEAD
          entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés ? (
=======
          entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés ? (
>>>>>>> origin/master
          <GraphiquePsySSR estEntitéJuridique={true} nombreJournéesPsySSRViewModel={entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel} />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombreHADEstIlAutorisé && entitéJuridiqueActivitéViewModel.nombreHADEstIlRenseigné() ? (
          <GraphiqueNombreHAD nombreHADViewModel={entitéJuridiqueActivitéViewModel.nombreHADViewModel} />
        ) : (
          <></>
        )}
        {entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlAutorisé && entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlRenseigné() ? (
          <GraphiqueNombrePassageUrgence
            estEntitéJuridique={true}
            nombrePassageAuxUrgencesViewModel={entitéJuridiqueActivitéViewModel.nombreDePassageAuxUrgencesViewModel}
          />
        ) : (
          <></>
        )}
      </ul>
    </Bloc>
  );
};
