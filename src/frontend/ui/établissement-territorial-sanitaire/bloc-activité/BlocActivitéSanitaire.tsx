import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/Indicateur/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";
import { ContenuNombreDeJournéesPSYetSSR } from "../InfoBulle/ContenuNombreDeJournéesPSYetSSR";
import { ContenuNombreDeSéjourMCO } from "../InfoBulle/ContenuNombreDeSéjourMCO";
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
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeSéjoursMCOSontIlsRenseignés && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuNombreDeSéjourMCO
                dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
                source={wording.PMSI}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
            identifiant="activite-0"
            nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
            source={wording.PMSI}
          >
            {établissementTerritorialSanitaireActivitéViewModel.nombreDeSéjoursMédecineChirurgieObstétrique}
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuNombreDeJournéesPSYetSSR
                dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
                source={wording.PMSI}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
            identifiant="activite-1"
            nomDeLIndicateur={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
            source={wording.PMSI}
          >
            {établissementTerritorialSanitaireActivitéViewModel.nombreDeJournéesPsyEtSsr}
          </IndicateurGraphique>
        )}
        <GraphiqueNombrePassageUrgence
          nombrePassageAuxUrgencesViewModel={établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesViewModel}
        />
      </ul>
    </Bloc>
  );
};
