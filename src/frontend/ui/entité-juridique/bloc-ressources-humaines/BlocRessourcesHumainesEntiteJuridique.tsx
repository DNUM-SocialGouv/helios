import styles from "./BlocRessourcesHumainesEntiteJuridique.module.css"
import { EntiteJuridiqueRessourcesHumainesViewModel } from "./EntiteJuridiqueRessourcesHumainesViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuDuNombreDEtpPm } from "../infoBulle/ContenuDuNombreDEtpPm";



type BlocRessourcesHumainesProps = Readonly<{
  entiteJuridiqueRessourcesHumainesViewModel: EntiteJuridiqueRessourcesHumainesViewModel;
  openedBloc?: boolean;
  toggleBlocs?: () => void;
}>;

export const BlocRessourcesHumainesEntiteJuridique = ({ entiteJuridiqueRessourcesHumainesViewModel, openedBloc, toggleBlocs }: BlocRessourcesHumainesProps) => {
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
            {entiteJuridiqueRessourcesHumainesViewModel.nombreEtpPm}
          </IndicateurGraphique>
        ) : <></>}
      </ul>
    </Bloc>
  );
}
