import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { Indicateur } from '../../commun/Indicateur/Indicateur'
import { IndicateurGraphique } from '../../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../../commun/Sources/Sources'
import { ContenuAutorisations } from '../InfoBulle/ContenuAutorisations'
import { ContenuAutresActivités } from '../InfoBulle/ContenuAutresActivités'
import { ContenuCapacitéParActivités } from '../InfoBulle/ContenuCapacitéParActivités'
import { ContenuReconnaissancesContractuelles } from '../InfoBulle/ContenuReconnaissancesContractuelles'
import { ContenuÉquipementsMatérielsLourds } from '../InfoBulle/ContenuÉquipementsMatérielsLourds'
import styles from './BlocAutorisationEtCapacitéSanitaire.module.css'
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from './ÉtablissementTerritorialSanitaireAutorisationsViewModel'

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireAutorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel
}>

export const BlocAutorisationEtCapacitéSanitaire = ({ établissementTerritorialSanitaireAutorisationsViewModel }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies()

  if (établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées) {
    return <Bloc titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>{wording.INDICATEURS_VIDES}</Bloc>
  }

  return (
    <Bloc estCeIdentité={false} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      <ul className={`indicateurs ${styles['liste-indicateurs']}`}>
        {établissementTerritorialSanitaireAutorisationsViewModel.lesCapacitésParActivitésSontEllesRenseignées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuCapacitéParActivités
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
                source={wording.SAE}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
            identifiant="capacite-sanitaire"
            nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
            source={wording.SAE}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.capacitéParActivités}
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesRenseignées && (
          <Indicateur
            contenuInfoBulle={
              <ContenuAutorisations
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
            identifiant="autorisations-sanitaire"
            nomDeLIndicateur={wording.AUTORISATIONS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autorisations}
          </Indicateur>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutresActivitésSontEllesRenseignées && (
          <Indicateur
            contenuInfoBulle={
              <ContenuAutresActivités
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
            identifiant="autres-activités-sanitaire"
            nomDeLIndicateur={wording.AUTRES_ACTIVITÉS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autresActivités}
          </Indicateur>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesReconnaissancesContractuellesSontEllesRenseignées && (
          <Indicateur
            contenuInfoBulle={
              <ContenuReconnaissancesContractuelles
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
            identifiant="reconnaissances-contractuelles-sanitaire"
            nomDeLIndicateur={wording.RECONNAISSANCES_CONTRACTUELLES}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.reconnaissancesContractuelles}
          </Indicateur>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés && (
          <Indicateur
            contenuInfoBulle={
              <ContenuÉquipementsMatérielsLourds
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
            identifiant="équipements-matériels-lourds-sanitaire"
            nomDeLIndicateur={wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.équipementsMatérielsLourds}
          </Indicateur>
        )}
      </ul>
    </Bloc>
  )
}
