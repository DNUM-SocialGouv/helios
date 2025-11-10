
import styles from "./BlocRessourcesHumainesEtablissementSanitaire.module.css"
import { EtablissementTerritorialSanitaireRHViewModel } from "./EtablissementTerritorialSanitaireRHViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuDeDepensesInterimPm } from "../../entité-juridique/infoBulle/ContenuDeDepensesInterimPm";
import { ContenuDeJoursAbsenteismePm } from "../../entité-juridique/infoBulle/ContenuDeJoursAbsenteismePm";
import { ContenuDeJoursAbsenteismePnm } from "../../entité-juridique/infoBulle/ContenuDeJoursAbsenteismePnm";
import { ContenuDuNombreDEtpPm } from "../../entité-juridique/infoBulle/ContenuDuNombreDEtpPm";
import { ContenuDuNombreDEtpPnm } from "../../entité-juridique/infoBulle/ContenuDuNombreDEtpPnm";

type BlocRessourcesHumainesProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  etSanRhviewModel: EtablissementTerritorialSanitaireRHViewModel;
  openedBloc?: boolean;
  toggleBlocs?: () => void;
}>;



export const BlocRessourcesHumainesEtablissementSanitaire = ({ etabFiness, etabTitle, etSanRhviewModel, openedBloc, toggleBlocs }: BlocRessourcesHumainesProps) => {
  const { wording } = useDependencies();
  if (etSanRhviewModel.lesDonneesRessourcesHumainesNeSontPasRenseigner) {
    return <BlocIndicateurVide opnedBloc={openedBloc} title={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggleBlocs} />;
  }
  return (
    <Bloc isMain={false} opnedBloc={openedBloc} titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggleBlocs}>
      {
        etSanRhviewModel.lesDonnéesRHPasAutorisees.length !== 0 ?
          <NotAUthorized indicateurs={etSanRhviewModel.lesDonnéesRHPasAutorisees} /> :
          etSanRhviewModel.lesDonnéesRHPasRenseignees.length !== 0 ?
            <NoDataCallout indicateurs={etSanRhviewModel.lesDonnéesRHPasRenseignees} /> : <></>
      }

      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {etSanRhviewModel.nombreDEtpPmEstIlRenseigne && etSanRhviewModel.nombreDEtpPmEstIlAutorise ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDEtpPm
                dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourNombreEtpPm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourNombreEtpPm}
            identifiant="ressources-humaines-nombre-etp-pm"
            nomDeLIndicateur={wording.NOMBRE_D_ETP_PM}
            source={Sources(wording.ANCRE)}
          >
            {etSanRhviewModel.nombreEtpPmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}

        {etSanRhviewModel.nombreDEtpPnmEstIlRenseigne && etSanRhviewModel.nombreDEtpPnmEstIlAutorise ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDEtpPnm
                dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourNombreEtpPnm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourNombreEtpPnm}
            identifiant="ressources-humaines-nombre-etp-pnm"
            nomDeLIndicateur={wording.NOMBRE_D_ETP_PNM}
            source={Sources(wording.ANCRE)}
          >
            {etSanRhviewModel.nombreEtpPnmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}


        {etSanRhviewModel.depensesInterimPmSontEllesRenseignees && etSanRhviewModel.depensesInterimPmSontEllesAutorisees ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDeDepensesInterimPm
                dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourDepensesInterimPm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourDepensesInterimPm}
            identifiant="ressources-humaines-depenses-interim-pm"
            nomDeLIndicateur={wording.DEPENSES_INTERIM_PM}
            source={Sources(wording.ANCRE)}
          >
            {etSanRhviewModel.depensesInterimPmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}

        {etSanRhviewModel.joursAbsenteismePmSontIlsRenseignes && etSanRhviewModel.joursAbsenteismePmSontIlsAutorises ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDeJoursAbsenteismePm
                dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourJoursAbsenteismePm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourJoursAbsenteismePm}
            identifiant="ressources-humaines-jours-absenteisme-pm"
            nomDeLIndicateur={wording.JOURS_ABSENTEISME_PM}
            source={Sources(wording.ANCRE)}
          >
            {etSanRhviewModel.joursAbsenteismePmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}

        {etSanRhviewModel.joursAbsenteismePnmSontIlsRenseignes && etSanRhviewModel.joursAbsenteismePnmSontIlsAutorises ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDeJoursAbsenteismePnm
                dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourJoursAbsenteismePnm}
                source={Sources(wording.ANCRE)}
              />
            }
            dateDeMiseÀJour={etSanRhviewModel.dateMiseAJourJoursAbsenteismePnm}
            identifiant="ressources-humaines-jours-absenteisme-pnm"
            nomDeLIndicateur={wording.JOURS_ABSENTEISME_PNM}
            source={Sources(wording.ANCRE)}
          >
            {etSanRhviewModel.joursAbsenteismePnmHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>

        ) : <></>}
      </ul>
    </Bloc>
  );
};
