import { useState } from 'react'

import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../../commun/Sources/Sources'
import { ContenuDesTauxDAbsentéismes } from '../InfoBulle/ContenuDesTauxDAbsentéismes'
import { ContenuDuNombreDEtpRéalisé } from '../InfoBulle/ContenuDuNombreDEtpRéalisé'
import { ContenuDuTauxDeRotationDuPersonnel } from '../InfoBulle/ContenuDuTauxDeRotationDuPersonnel'
import styles from './BlocRessourcesHumainesMédicoSocial.module.css'
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from './ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel'

type BlocRessourcesHumainesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel
}>

export const BlocRessourcesHumainesMédicoSocial = (
  { établissementTerritorialMédicoSocialRessourcesHumainesViewModel }: BlocRessourcesHumainesMédicoSocialProps
) => {
  const { wording } = useDependencies()
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(établissementTerritorialMédicoSocialRessourcesHumainesViewModel.annéeInitiale)

  if (établissementTerritorialMédicoSocialRessourcesHumainesViewModel.lesDonnéesRessourcesHumainesNeSontPasRenseignées) {
    return (
      <Bloc titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    )
  }

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES}
    >
      <ul className={`indicateurs ${styles['liste-indicateurs']}`}>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuDuNombreDEtpRéalisé
            dateDeMiseÀJour={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuNombreDEtpRéalisé}
            source={Sources(wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuNombreDEtpRéalisé}
          identifiant="ressources-humaines-nombre-etp-réalisé"
          nomDeLIndicateur={wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ}
          source={Sources(wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialRessourcesHumainesViewModel.nombreDEtpRéalisé}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuDuTauxDeRotationDuPersonnel
            dateDeMiseÀJour={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDeRotationDuPersonnel}
            source={Sources(wording.TDB_PERF)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDuTauxDeRotationDuPersonnel}
          identifiant="ressources-humaines-taux-de-rotation-du-personnel"
          nomDeLIndicateur={wording.TAUX_DE_ROTATION_DU_PERSONNEL}
          source={Sources(wording.TDB_PERF)}
        >
          {établissementTerritorialMédicoSocialRessourcesHumainesViewModel.tauxDeRotationDuPersonnel}
        </IndicateurGraphique>
        <IndicateurGraphique
          années={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.listeDéroulanteDesAnnéesDesTauxDAbsentéismes(setAnnéeEnCours)}
          contenuInfoBulle={<ContenuDesTauxDAbsentéismes
            dateDeMiseÀJour={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDesTauxDAbsentéismes}
            source={Sources(wording.TDB_PERF)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialRessourcesHumainesViewModel.dateDeMiseÀJourDesTauxDAbsentéismes}
          identifiant="ressources-humaines-taux-d-absentéisme"
          nomDeLIndicateur={wording.TAUX_D_ABSENTÉISME}
          source={Sources(wording.TDB_PERF)}
        >
          {établissementTerritorialMédicoSocialRessourcesHumainesViewModel.tauxDAbsentéisme(annéeEnCours)}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
