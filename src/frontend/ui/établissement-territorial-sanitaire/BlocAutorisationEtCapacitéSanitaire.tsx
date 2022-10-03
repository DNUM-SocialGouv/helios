import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurAutorisationEtCapacité } from '../commun/IndicateurAutorisationEtCapacité/IndicateurAutorisationEtCapacité'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocAutorisationEtCapacitéSanitaire.module.css'
import { ContenuAutorisations } from './InfoBulle/ContenuAutorisations'
import { ContenuAutresActivités } from './InfoBulle/ContenuAutresActivités'
import { ContenuCapacitéParActivités } from './InfoBulle/ContenuCapacitéParActivités'
import { ContenuReconnaissancesContractuelles } from './InfoBulle/ContenuReconnaissancesContractuelles'
import { ContenuÉquipementsMatérielsLourds } from './InfoBulle/ContenuÉquipementsMatérielsLourds'
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from './ÉtablissementTerritorialSanitaireAutorisationsViewModel'

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireAutorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel
}>

export const BlocAutorisationEtCapacitéSanitaire = ({ établissementTerritorialSanitaireAutorisationsViewModel }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialSanitaireAutorisationsViewModel.lesCapacitésParActivitésSontEllesRenseignées &&
    !établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesRenseignées &&
    !établissementTerritorialSanitaireAutorisationsViewModel.lesAutresActivitésSontEllesRenseignées &&
    !établissementTerritorialSanitaireAutorisationsViewModel.lesReconnaissancesContractuellesSontEllesRenseignées &&
    !établissementTerritorialSanitaireAutorisationsViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés
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
        {
          établissementTerritorialSanitaireAutorisationsViewModel.lesCapacitésParActivitésSontEllesRenseignées &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuCapacitéParActivités
              dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
              source={Sources(wording.DIAMANT, wording.SAE)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
            identifiant="capacite-sanitaire"
            nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
            source={Sources(wording.DIAMANT, wording.SAE)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.capacitéParActivités}
          </IndicateurGraphique>
        }
        {
          établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesRenseignées &&
          <IndicateurAutorisationEtCapacité
            contenuInfoBulle={<ContenuAutorisations
              dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
            identifiant="autorisations-sanitaire"
            nomDeLIndicateur={wording.AUTORISATIONS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autorisations}
          </IndicateurAutorisationEtCapacité>
        }
        {
          établissementTerritorialSanitaireAutorisationsViewModel.lesAutresActivitésSontEllesRenseignées &&
          <IndicateurAutorisationEtCapacité
            contenuInfoBulle={<ContenuAutresActivités
              dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
            identifiant="autres-activités-sanitaire"
            nomDeLIndicateur={wording.AUTRES_ACTIVITÉS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autresActivités}
          </IndicateurAutorisationEtCapacité>
        }
        {
          établissementTerritorialSanitaireAutorisationsViewModel.lesReconnaissancesContractuellesSontEllesRenseignées &&
            <IndicateurAutorisationEtCapacité
              contenuInfoBulle={<ContenuReconnaissancesContractuelles
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />}
              dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
              identifiant="reconnaissances-contractuelles-sanitaire"
              nomDeLIndicateur={wording.RECONNAISSANCES_CONTRACTUELLES}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            >
              {établissementTerritorialSanitaireAutorisationsViewModel.reconnaissancesContractuelles}
            </IndicateurAutorisationEtCapacité>
        }
        {
          établissementTerritorialSanitaireAutorisationsViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés &&
            <IndicateurAutorisationEtCapacité
              contenuInfoBulle={<ContenuÉquipementsMatérielsLourds
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />}
              dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
              identifiant="équipements-matériels-lourds-sanitaire"
              nomDeLIndicateur={wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            >
              {établissementTerritorialSanitaireAutorisationsViewModel.équipementsMatérielsLourds}
            </IndicateurAutorisationEtCapacité>
        }
      </ul>
    </Bloc>
  )
}
