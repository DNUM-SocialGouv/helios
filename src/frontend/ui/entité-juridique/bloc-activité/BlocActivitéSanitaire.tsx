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
}>;

export const BlocActivitéSanitaire = ({ entitéJuridiqueActivitéViewModel }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (entitéJuridiqueActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_ACTIVITÉ} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      {entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasRenseignees.length !== 0 ? <NoDataCallout indicateurs={entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasRenseignees} /> :
        entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={entitéJuridiqueActivitéViewModel.lesDonnéesActivitéPasAutorisés} /> : <></>}

      <ul className="indicateurs">
        {entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés && entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés ?
          <GraphiqueNombreDeSejourMCO estEntitéJuridique={true} nombreDeSejourMCOViewModel={entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel} />
          : <></>
        }
        {entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé && entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés ?
          <GraphiquePsySSR estEntitéJuridique={true} nombreJournéesPsySSRViewModel={entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel} />
          : <></>
        }
        {entitéJuridiqueActivitéViewModel.nombreHADEstIlAutorisé && entitéJuridiqueActivitéViewModel.nombreHADEstIlRenseigné() ?
          <GraphiqueNombreHAD nombreHADViewModel={entitéJuridiqueActivitéViewModel.nombreHADViewModel} />
          : <></>
        }
        {entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlAutorisé && entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlRenseigné() ?
          <GraphiqueNombrePassageUrgence
            estEntitéJuridique={true}
            nombrePassageAuxUrgencesViewModel={entitéJuridiqueActivitéViewModel.nombreDePassageAuxUrgencesViewModel}
          />
          : <></>
        }
      </ul>
    </Bloc>
  );
};
