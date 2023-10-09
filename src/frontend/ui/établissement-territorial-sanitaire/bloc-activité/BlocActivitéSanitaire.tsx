import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { GraphiqueNombreDeSejourMCO } from "../../indicateur-métier/nombre-de-sejour-mco/GraphiqueNombreDeSejourMCO";
import { GraphiquePsySSR } from "../../indicateur-métier/nombre-journees-psy-ssr/GraphiquePsySSR";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";
import styles from "./BlocActivitéSanitaire.module.css";
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from "./ÉtablissementTerritorialSanitaireActivitéViewModel";

type BlocActivitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireActivitéViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel;
}>;

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireActivitéViewModel }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      {établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasRenseignee.length !== 0 ? <NoDataCallout indicateurs={établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasRenseignee} /> :
        établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasAutorisés} /> : <></>}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés && établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés ? <GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel} /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés && établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé ? <GraphiquePsySSR nombreJournéesPsySSRViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel} /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlRenseigné && établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlAutorisé ? <GraphiqueNombrePassageUrgence
          nombrePassageAuxUrgencesViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesViewModel}
        /> : <></>}
      </ul>
    </Bloc>
  );
};
