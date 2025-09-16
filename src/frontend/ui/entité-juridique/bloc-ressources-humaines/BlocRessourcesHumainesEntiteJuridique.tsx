import styles from "./BlocRessourcesHumainesEntiteJuridique.module.css"
import { EntiteJuridiqueRessourcesHumainesViewModel } from "./EntiteJuridiqueRessourcesHumainesViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuDuNombreDEtpPm } from "../infoBulle/ContenuDuNombreDEtpPm";



type BlocRessourcesHumainesProps = Readonly<{
  entiteJuridiqueRessourcesHumainesViewModel: EntiteJuridiqueRessourcesHumainesViewModel;
  openedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocRessourcesHumainesEntiteJuridique = ({ entiteJuridiqueRessourcesHumainesViewModel, openedBloc, toggelBlocs }: BlocRessourcesHumainesProps) => {
  const { wording } = useDependencies();

  //TODO: Gérer le cas de bloc vide

  return (
    <Bloc isMain={false} opnedBloc={openedBloc} titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggelBlocs}>
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
