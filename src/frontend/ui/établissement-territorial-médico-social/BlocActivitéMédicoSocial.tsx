import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import styles from './BlocActivitéMédicoSocial.module.css'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocActivitéMédicoSocialType = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocActivitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocActivitéMédicoSocialType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={styles['liste-indicateurs']}>
        <IndicateurGraphique
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementPermanent}
        </IndicateurGraphique>
        <IndicateurGraphique
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementTemporaire}
        </IndicateurGraphique>
        <IndicateurGraphique
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_ACCUEIL_DE_JOUR}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementAccueilDeJour}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
