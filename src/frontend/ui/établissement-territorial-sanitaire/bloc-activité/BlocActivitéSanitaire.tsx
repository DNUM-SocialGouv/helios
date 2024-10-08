import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { GraphiqueNombreDeSejourMCO } from "../../indicateur-métier/nombre-de-sejour-mco/GraphiqueNombreDeSejourMCO";
import { GraphiquePsySSR } from "../../indicateur-métier/nombre-journees-psy-ssr/GraphiquePsySSR";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";
import styles from "./BlocActivitéSanitaire.module.css";
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from "./ÉtablissementTerritorialSanitaireActivitéViewModel";

type BlocActivitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireActivitéViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel;
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireActivitéViewModel, activitéMensuelleViewModel, opnedBloc, toggelBlocs }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs}>
      {établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasAutorisés} /> :
        établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasRenseignee.length !== 0 ? <NoDataCallout indicateurs={établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasRenseignee} /> :
          <></>}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés && établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés ? <GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel} /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés && établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé ? <GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} nombreJournéesPsySSRViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel} /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlRenseigné && établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlAutorisé ? <GraphiqueNombrePassageUrgence
          nombrePassageAuxUrgencesViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesViewModel}
        /> : <></>}
      </ul>
    </Bloc>
  );
};
