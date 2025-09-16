import styles from "./BlocRessourcesHumainesEntiteJuridique.module.css"
import { EntiteJuridiqueRessourcesHumainesViewModel } from "./EntiteJuridiqueRessourcesHumainesViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
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
        //TODO: Gérer les autorisation 
      }

      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {true /*TODO: Condition d'affichage*/ ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDEtpPm
                dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourNombreEtpPm}
                source={Sources(wording.ATIH)}
              />
            }
            dateDeMiseÀJour={entiteJuridiqueRessourcesHumainesViewModel.dateMiseAJourNombreEtpPm}
            identifiant="ressources-humaines-nombre-etp-réalisé"
            nomDeLIndicateur={wording.NOMBRE_D_ETP_PM}
            source={Sources(wording.ATIH)}
          >
            {entiteJuridiqueRessourcesHumainesViewModel.nombreEtpPm}
          </IndicateurGraphique>
        ) : <></>}
      </ul>
    </Bloc>
  );
}
