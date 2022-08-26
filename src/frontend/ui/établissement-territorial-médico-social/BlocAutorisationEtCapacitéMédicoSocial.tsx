import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurAutorisationEtCapacité } from '../commun/IndicateurAutorisationEtCapacité/IndicateurAutorisationEtCapacité'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocAutorisationEtCapacitéMédicoSocial.module.css'
import { ContenuAutorisations } from './InfoBulle/ContenuAutorisations'
import { ContenuCapacitéParActivité } from './InfoBulle/ContenuCapacitéParActivité'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocAutorisationEtCapacitéMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}>

export const BlocAutorisationEtCapacitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocAutorisationEtCapacitéMédicoSocialProps) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialMédicoSocialViewModel.lesAutorisationsSontEllesRenseignées &&
    !établissementTerritorialMédicoSocialViewModel.lesCapacitésSontEllesRenseignées
  ) {
    return (
      <Bloc titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    )
  }

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}
    >
      <ul
        className={styles['liste-indicateurs']}
      >
        {établissementTerritorialMédicoSocialViewModel.lesCapacitésSontEllesRenseignées &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuCapacitéParActivité
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDesCapacitésParActivités}
              source={Sources(wording.FINESS)}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDesCapacitésParActivités}
            identifiant="capacité-par-activités"
            nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
            source={Sources(wording.FINESS)}
          >
            {établissementTerritorialMédicoSocialViewModel.capacitéParActivités}
          </IndicateurGraphique>
        }
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
