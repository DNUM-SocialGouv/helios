import styles from "./BlocActivitéSanitaire.module.css";
import { EtablissementTerritorialSanitaireActiviteViewModel } from "./ÉtablissementTerritorialSanitaireActivitéViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { GraphiqueNombreDeSejourMCO } from "../../indicateur-métier/nombre-de-sejour-mco/GraphiqueNombreDeSejourMCO";
import { GraphiquePsySSR } from "../../indicateur-métier/nombre-journees-psy-ssr/GraphiquePsySSR";
import { GraphiqueNombreDeJourneesUsld } from "../../indicateur-métier/nombre-journees-usld/GraphiqueNombreDeJourneesUsld";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";

type BlocActivitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireActivitéViewModel: EtablissementTerritorialSanitaireActiviteViewModel;
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;
type ListeIndicateursNonAutorisesOuNonRenseignesProps = Readonly<{
  établissementTerritorialSanitaireActivitéViewModel: EtablissementTerritorialSanitaireActiviteViewModel;
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({
  établissementTerritorialSanitaireActivitéViewModel
}: ListeIndicateursNonAutorisesOuNonRenseignesProps) => {
  if (établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasAutorisés.length !== 0) {
    return <NotAUthorized indicateurs={établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasAutorisés} />;
  } else if (établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasRenseignee.length !== 0) {
    return <NoDataCallout indicateurs={établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitésPasRenseignee} />;
  } else {
    return <></>;
  }
}

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireActivitéViewModel, activitéMensuelleViewModel, opnedBloc, toggelBlocs }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs}>
      <ListeIndicateursNonAutorisesOuNonRenseignes établissementTerritorialSanitaireActivitéViewModel={établissementTerritorialSanitaireActivitéViewModel} />
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
          établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés ?
          <GraphiqueNombreDeSejourMCO
            activitéMensuelleViewModel={activitéMensuelleViewModel}
            nombreDeSejourMCOViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel}
          /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
          établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé ?
          <GraphiquePsySSR
            activitéMensuelleViewModel={activitéMensuelleViewModel}
            nombreJournéesPsySSRViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreJourneesPsySSRViewModel}
          /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeJourneesUsldEstIlRenseigne &&
          établissementTerritorialSanitaireActivitéViewModel.nombreDeJourneesUsldEstIlAutorise ?
          <GraphiqueNombreDeJourneesUsld
            nombreDeJourneesUsldViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDeJourneesUsldViewModel}
          /> : <></>}
        {établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlRenseigné &&
          établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlAutorisé ?
          <GraphiqueNombrePassageUrgence
            nombrePassageAuxUrgencesViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesViewModel}
          /> : <></>}
      </ul>
    </Bloc>
  );
};
