import styles from "./BlocRessourcesHumainesEntiteJuridique.module.css"
import { EntiteJuridiqueRessourcesHumainesViewModel } from "./EntiteJuridiqueRessourcesHumainesViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuDeDepensesInterimPm } from "../infoBulle/ContenuDeDepensesInterimPm";
import { ContenuDeJoursAbsenteismePm } from "../infoBulle/ContenuDeJoursAbsenteismePm";
import { ContenuDeJoursAbsenteismePnm } from "../infoBulle/ContenuDeJoursAbsenteismePnm";
import { ContenuDuNombreDEtpPm } from "../infoBulle/ContenuDuNombreDEtpPm";
import { ContenuDuNombreDEtpPnm } from "../infoBulle/ContenuDuNombreDEtpPnm";



type BlocRessourcesHumainesProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  entiteJuridiqueRessourcesHumainesViewModel: EntiteJuridiqueRessourcesHumainesViewModel;
  openedBloc?: boolean;
  toggleBlocs?: () => void;
}>;

export const BlocRessourcesHumainesEntiteJuridique = ({ etabFiness, etabTitle, entiteJuridiqueRessourcesHumainesViewModel, openedBloc, toggleBlocs }: BlocRessourcesHumainesProps) => {
  const { wording } = useDependencies();

  if (entiteJuridiqueRessourcesHumainesViewModel.lesDonneesRessourcesHumainesNeSontPasRenseigner) {
    return <BlocIndicateurVide opnedBloc={openedBloc} title={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggleBlocs} />;
  }
  return (
    <Bloc isMain={false} opnedBloc={openedBloc} titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggleBlocs}>
      {
        entiteJuridiqueRessourcesHumainesViewModel.lesDonnéesRHPasAutorisees.length !== 0 ?
          <NotAUthorized indicateurs={entiteJuridiqueRessourcesHumainesViewModel.lesDonnéesRHPasAutorisees} /> :
          entiteJuridiqueRessourcesHumainesViewModel.lesDonnéesRHPasRenseignees.length !== 0 ?
            <NoDataCallout indicateurs={entiteJuridiqueRessourcesHumainesViewModel.lesDonnéesRHPasRenseignees} /> : <></>
      }

      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {entiteJuridiqueRessourcesHumainesViewModel.nombreDEtpPmEstIlRenseigne && entiteJuridiqueRessourcesHumainesViewModel.nombreDEtpPmEstIlAutorise ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDEtpPm
                dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourNombreEtpPm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourNombreEtpPm}
            identifiant="ressources-humaines-nombre-etp-pm"
            nomDeLIndicateur={wording.NOMBRE_D_ETP_PM}
            source={Sources(wording.ANCRE)}
          >
            {entiteJuridiqueRessourcesHumainesViewModel.nombreEtpPmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}

        {entiteJuridiqueRessourcesHumainesViewModel.nombreDEtpPnmEstIlRenseigne && entiteJuridiqueRessourcesHumainesViewModel.nombreDEtpPnmEstIlAutorise ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDEtpPnm
                dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourNombreEtpPnm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourNombreEtpPnm}
            identifiant="ressources-humaines-nombre-etp-pnm"
            nomDeLIndicateur={wording.NOMBRE_D_ETP_PNM}
            source={Sources(wording.ANCRE)}
          >
            {entiteJuridiqueRessourcesHumainesViewModel.nombreEtpPnmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}


        {entiteJuridiqueRessourcesHumainesViewModel.depensesInterimPmSontEllesRenseignees && entiteJuridiqueRessourcesHumainesViewModel.depensesInterimPmSontEllesAutorisees ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDeDepensesInterimPm
                dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourDepensesInterimPm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourDepensesInterimPm}
            identifiant="ressources-humaines-depenses-interim-pm"
            nomDeLIndicateur={wording.DEPENSES_INTERIM_PM}
            source={Sources(wording.ANCRE)}
          >
            {entiteJuridiqueRessourcesHumainesViewModel.depensesInterimPmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}

        {entiteJuridiqueRessourcesHumainesViewModel.joursAbsenteismePmSontIlsRenseignes && entiteJuridiqueRessourcesHumainesViewModel.joursAbsenteismePmSontIlsAutorises ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDeJoursAbsenteismePm
                dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourJoursAbsenteismePm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourJoursAbsenteismePm}
            identifiant="ressources-humaines-jours-absenteisme-pm"
            nomDeLIndicateur={wording.JOURS_ABSENTEISME_PM}
            source={Sources(wording.ANCRE)}
          >
            {entiteJuridiqueRessourcesHumainesViewModel.joursAbsenteismePmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}
        {entiteJuridiqueRessourcesHumainesViewModel.joursAbsenteismePnmSontIlsRenseignes && entiteJuridiqueRessourcesHumainesViewModel.joursAbsenteismePnmSontIlsAutorises ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDeJoursAbsenteismePnm
                dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourJoursAbsenteismePnm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourJoursAbsenteismePnm}
            identifiant="ressources-humaines-jours-absenteisme-pnm"
            nomDeLIndicateur={wording.JOURS_ABSENTEISME_PNM}
            source={Sources(wording.ANCRE)}
          >
            {entiteJuridiqueRessourcesHumainesViewModel.joursAbsenteismePnmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}
      </ul>
    </Bloc>
  );
}
