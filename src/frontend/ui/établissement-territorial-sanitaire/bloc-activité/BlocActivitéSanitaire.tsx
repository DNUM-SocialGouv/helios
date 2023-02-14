import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/Indicateur/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { GraphiqueNombreDeSejourMCO } from "../../indicateur-métier/nombre-de-sejour-mco/GraphiqueNombreDeSejourMCO";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";
import { ContenuNombreDeJournéesPSYetSSR } from "../InfoBulle/ContenuNombreDeJournéesPSYetSSR";
import styles from "./BlocActivitéSanitaire.module.css";
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from "./ÉtablissementTerritorialSanitaireActivitéViewModel";

type BlocActivitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireActivitéViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel;
}>;

function GraphiquePsySSR(props: { nombreJournéesPsySSRViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel }) {
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
