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
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}>

export const BlocAutorisationEtCapacitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialSanitaireViewModel.lesCapacitésParActivitésSontEllesRenseignées &&
    !établissementTerritorialSanitaireViewModel.lesAutorisationsSontEllesRenseignées &&
    !établissementTerritorialSanitaireViewModel.lesAutresActivitésSontEllesRenseignées &&
    !établissementTerritorialSanitaireViewModel.lesReconnaissancesContractuellesSontEllesRenseignées &&
    !établissementTerritorialSanitaireViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés
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
          établissementTerritorialSanitaireViewModel.lesCapacitésParActivitésSontEllesRenseignées &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuCapacitéParActivités
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
              source={Sources(wording.DIAMANT, wording.SAE)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
            identifiant="capacite-sanitaire"
            nomDeLIndicateur={wording.CAPACITÉ_PAR_ACTIVITÉS}
            source={Sources(wording.DIAMANT, wording.SAE)}
          >
            {établissementTerritorialSanitaireViewModel.capacitéParActivités}
          </IndicateurGraphique>
        }
        {
          établissementTerritorialSanitaireViewModel.lesAutorisationsSontEllesRenseignées &&
          <IndicateurAutorisationEtCapacité
            contenuInfoBulle={<ContenuAutorisations
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesAutorisations}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesAutorisations}
            identifiant="autorisations-sanitaire"
            nomDeLIndicateur={wording.AUTORISATIONS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireViewModel.autorisations}
          </IndicateurAutorisationEtCapacité>
        }
        {
          établissementTerritorialSanitaireViewModel.lesAutresActivitésSontEllesRenseignées &&
          <IndicateurAutorisationEtCapacité
            contenuInfoBulle={<ContenuAutresActivités
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesAutresActivités}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesAutresActivités}
            identifiant="autres-activités-sanitaire"
            nomDeLIndicateur={wording.AUTRES_ACTIVITÉS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireViewModel.autresActivités}
          </IndicateurAutorisationEtCapacité>
        }
        {
          établissementTerritorialSanitaireViewModel.lesReconnaissancesContractuellesSontEllesRenseignées &&
            <IndicateurAutorisationEtCapacité
              contenuInfoBulle={<ContenuReconnaissancesContractuelles
                dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />}
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
              identifiant="reconnaissances-contractuelles-sanitaire"
              nomDeLIndicateur={wording.RECONNAISSANCES_CONTRACTUELLES}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            >
              {établissementTerritorialSanitaireViewModel.reconnaissancesContractuelles}
            </IndicateurAutorisationEtCapacité>
        }
        {
          établissementTerritorialSanitaireViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés &&
            <IndicateurAutorisationEtCapacité
              contenuInfoBulle={<ContenuÉquipementsMatérielsLourds
                dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />}
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
              identifiant="équipements-matériels-lourds-sanitaire"
              nomDeLIndicateur={wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            >
              {établissementTerritorialSanitaireViewModel.équipementsMatérielsLourds}
            </IndicateurAutorisationEtCapacité>
        }
      </ul>
    </Bloc>
  )
}
