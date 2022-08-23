import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurAutorisationEtCapacité } from '../commun/IndicateurAutorisationEtCapacité/IndicateurAutorisationEtCapacité'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocAutorisationEtCapacitéMédicoSocial.module.css'
import { ContenuAutorisations } from './InfoBulle/ContenuAutorisations'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocAutorisationEtCapacitéMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}>

export const BlocAutorisationEtCapacitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocAutorisationEtCapacitéMédicoSocialProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}
    >
      <ul
        className={styles['liste-indicateurs']}
      >
        <IndicateurAutorisationEtCapacité
          contenuInfoBulle={<ContenuAutorisations
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDesAutorisations}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDesAutorisations}
          identifiant="autorisations"
          nomDeLIndicateur={wording.AUTORISATIONS}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        >
          {établissementTerritorialMédicoSocialViewModel.autorisations}
        </IndicateurAutorisationEtCapacité>
      </ul>
    </Bloc>
  )
}
