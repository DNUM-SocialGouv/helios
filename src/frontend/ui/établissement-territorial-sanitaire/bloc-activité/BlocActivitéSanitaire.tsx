import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/Indicateur/BlocIndicateurVide";
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

  if (établissementTerritorialSanitaireActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_ACTIVITÉ} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés && (
          <GraphiqueNombreDeSejourMCO
            nombreDeSejourMCOViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDeSejourMCOViewModel}
          ></GraphiqueNombreDeSejourMCO>
        )}
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés && (
          <GraphiquePsySSR nombreJournéesPsySSRViewModel={établissementTerritorialSanitaireActivitéViewModel} />
        )}
        <GraphiqueNombrePassageUrgence
          nombrePassageAuxUrgencesViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesViewModel}
        />
      </ul>
    </Bloc>
  );
};
