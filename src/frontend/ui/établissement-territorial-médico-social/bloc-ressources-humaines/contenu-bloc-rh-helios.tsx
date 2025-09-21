
import { useState } from "react";

import styles from "./BlocRessourcesHumainesMédicoSocial.module.css";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuDesTauxDAbsentéismes } from "../InfoBulle/ContenuDesTauxDAbsentéismes";
import { ContenuDuNombreDeCddDeRemplacement } from "../InfoBulle/ContenuDuNombreDeCddDeRemplacement";
import { ContenuDuNombreDEtpRéalisé } from "../InfoBulle/ContenuDuNombreDEtpRéalisé";
import { ContenuDePrestationsExternes } from "../InfoBulle/ContenuDuTauxDePrestationsExternes";
import { ContenuDuTauxDeRotationDuPersonnel } from "../InfoBulle/ContenuDuTauxDeRotationDuPersonnel";
import { ContenuDuTauxDEtpVacants } from "../InfoBulle/ContenuDuTauxDEtpVacants";

type ContenuBlocRHMedicoSocialHeliosProps = Readonly<{
  etablissementTerritorialMedicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({
  etablissementTerritorialMedicoSocialRessourcesHumainesViewModel,
}: ContenuBlocRHMedicoSocialHeliosProps) => {
  if (etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesDonnéesRHPasAutorisés.length !== 0) {
    return <NotAUthorized indicateurs={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesDonnéesRHPasAutorisés} />
  } else if (etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesDonnéesRHPasRenseignees.length !== 0) {
    return <NoDataCallout indicateurs={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesDonnéesRHPasRenseignees} />
  } else {
    return <></>
  }
}

export const ContenuBlocRHMedicoSocialHelios = ({
  etablissementTerritorialMedicoSocialRessourcesHumainesViewModel,
}: ContenuBlocRHMedicoSocialHeliosProps) => {

  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.annéeInitiale);
  if (etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesDonnéesRessourcesHumainesNeSontPasRenseignées) {
    return <div>{wording.INDICATEURS_VIDES}</div>
  }

  return (
    <>
      <ListeIndicateursNonAutorisesOuNonRenseignes etablissementTerritorialMedicoSocialRessourcesHumainesViewModel={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel} />
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leNombreDEtpRéaliséEstIlRenseigné && etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leNombreDEtpRéaliséEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDEtpRéalisé
                dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuNombreDEtpRéalisé}
                source={Sources(wording.CNSA)}
              />
            }
            dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuNombreDEtpRéalisé}
            identifiant="ressources-humaines-nombre-etp-réalisé"
            nomDeLIndicateur={wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ}
            source={Sources(wording.CNSA)}
          >
            {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.nombreDEtpRéalisé}
          </IndicateurGraphique>
        ) : <></>}

        {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leNombreDeCddDeRemplacementEstIlRenseigné && etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leNombreDeCddDeRemplacementEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuNombreDeCddDeRemplacement
                dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuNombreDeCddDeRemplacement}
                source={Sources(wording.TDB_PERF)}
              />
            }
            dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuNombreDeCddDeRemplacement}
            identifiant="ressources-humaines-nombre-de-cdd-de-remplacement"
            nomDeLIndicateur={wording.NOMBRE_DE_CDD_DE_REMPLACEMENT}
            source={Sources(wording.TDB_PERF)}
          >
            {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.nombreDeCddDeRemplacement}
          </IndicateurGraphique>
        ) : <></>}


        {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leTauxDePrestationsExternesEstIlRenseigné && etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leTauxDePrestationsExternesEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDePrestationsExternes
                dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDePrestationsExternes}
                source={Sources(wording.TDB_PERF)}
              />
            }
            dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDePrestationsExternes}
            identifiant="ressources-humaines-taux-de-prestations-externes"
            nomDeLIndicateur={wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES}
            source={Sources(wording.TDB_PERF)}
          >
            {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.tauxDePrestationsExternes}
          </IndicateurGraphique>
        ) : <></>}

        {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leTauxDEtpVacantsEstIlRenseigné && etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leTauxDEtpVacantsEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuTauxDEtpVacants
                dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDEtpVacants}
                source={Sources(wording.TDB_PERF)}
              />
            }
            dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDEtpVacants}
            identifiant="ressources-humaines-taux-d-etp-vacants"
            nomDeLIndicateur={wording.TAUX_D_ETP_VACANTS_AU_31_12}
            source={Sources(wording.TDB_PERF)}
          >
            {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.tauxDEtpVacants}
          </IndicateurGraphique>
        ) : <></>}

        {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leTauxDeRotationDuPersonnelEstIlRenseigné && etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.leTauxDeRotationDuPersonnelEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuDuTauxDeRotationDuPersonnel
                dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDeRotationDuPersonnel}
                source={Sources(wording.TDB_PERF)}
              />
            }
            dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDeRotationDuPersonnel}
            identifiant="ressources-humaines-taux-de-rotation-du-personnel"
            nomDeLIndicateur={wording.TAUX_DE_ROTATION_DU_PERSONNEL}
            source={Sources(wording.TDB_PERF)}
          >
            {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.tauxDeRotationDuPersonnel}
          </IndicateurGraphique>
        ) : <></>}

        {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesTauxDAbsentéismeEstIlRenseigné && etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.lesTauxDAbsentéismeEstIlAutorisé ? (
          <IndicateurGraphique
            années={{
              liste: etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.anneesAvecTauxAbsenteisme(),
              setAnnéeEnCours,
            }}
            contenuInfoBulle={
              <ContenuDesTauxDAbsentéismes
                dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDesTauxDAbsentéismes}
                source={Sources(wording.TDB_PERF)}
              />
            }
            dateDeMiseÀJour={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDesTauxDAbsentéismes}
            identifiant="ressources-humaines-taux-d-absentéisme"
            nomDeLIndicateur={wording.TAUX_D_ABSENTÉISME}
            source={Sources(wording.TDB_PERF)}
          >
            {etablissementTerritorialMedicoSocialRessourcesHumainesViewModel.tauxDAbsentéisme(annéeEnCours)}
          </IndicateurGraphique>
        ) : <></>}
      </ul>
    </>
  );
}
