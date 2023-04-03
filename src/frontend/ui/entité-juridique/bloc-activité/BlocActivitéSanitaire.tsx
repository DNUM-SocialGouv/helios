import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
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
      <ul className="indicateurs">
        {entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés && (
          <GraphiqueNombreDeSejourMCO
            estEntitéJuridique={true}
            nombreDeSejourMCOViewModel={entitéJuridiqueActivitéViewModel.nombreDeSejourMCOViewModel}
          ></GraphiqueNombreDeSejourMCO>
        )}
        {entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés && (
          <GraphiquePsySSR estEntitéJuridique={true} nombreJournéesPsySSRViewModel={entitéJuridiqueActivitéViewModel.nombreJourneesPsySSRViewModel} />
        )}
        {entitéJuridiqueActivitéViewModel.nombreHADEstIlRenseigné() && (
          <GraphiqueNombreHAD nombreHADViewModel={entitéJuridiqueActivitéViewModel.nombreHADViewModel} />
        )}
        {entitéJuridiqueActivitéViewModel.nombrePassageUrgenceEstIlRenseigné() && (
          <GraphiqueNombrePassageUrgence
            estEntitéJuridique={true}
            nombrePassageAuxUrgencesViewModel={entitéJuridiqueActivitéViewModel.nombreDePassageAuxUrgencesViewModel}
          />
        )}
      </ul>
    </Bloc>
  );
};
