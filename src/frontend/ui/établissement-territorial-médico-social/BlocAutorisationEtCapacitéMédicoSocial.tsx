import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { Indicateur } from '../commun/Indicateur/Indicateur'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocAutorisationEtCapacitéMédicoSocial.module.css'
import { ContenuAutorisations } from './InfoBulle/ContenuAutorisations'
import { ContenuCapacitéParActivité } from './InfoBulle/ContenuCapacitéParActivité'
import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from './ÉtablissementTerritorialMédicoSocialAutorisationsViewModel'

type BlocAutorisationEtCapacitéMédicoSocialProps = Readonly<{
  établissementTerritorialAutorisationsMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel
}>

export const BlocAutorisationEtCapacitéMédicoSocial = (
  { établissementTerritorialAutorisationsMédicoSocialViewModel }: BlocAutorisationEtCapacitéMédicoSocialProps
) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialAutorisationsMédicoSocialViewModel.lesAutorisationsSontEllesRenseignées &&
    !établissementTerritorialAutorisationsMédicoSocialViewModel.lesCapacitésSontEllesRenseignées
  ) {
    return <Bloc titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      {wording.INDICATEURS_VIDES}
    </Bloc>
  }

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}
    >
      <ul className={styles['liste-indicateurs']}>
        {établissementTerritorialAutorisationsMédicoSocialViewModel.lesCapacitésSontEllesRenseignées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuCapacitéParActivité
                dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesCapacitésParActivités}
                source={Sources(wording.FINESS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesCapacitésParActivités}
            identifiant="capacité-par-activités-médico-social"
            nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
            source={Sources(wording.FINESS)}
          >
            {établissementTerritorialAutorisationsMédicoSocialViewModel.capacitéParActivités}
          </IndicateurGraphique>
        )}
        <Indicateur
          contenuInfoBulle={
            <ContenuAutorisations
              dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesAutorisations}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            />
          }
          dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesAutorisations}
          identifiant="autorisations-médico-social"
          nomDeLIndicateur={wording.AUTORISATIONS}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        >
          {établissementTerritorialAutorisationsMédicoSocialViewModel.autorisations}
        </Indicateur>
      </ul>
    </Bloc>
  )
}
