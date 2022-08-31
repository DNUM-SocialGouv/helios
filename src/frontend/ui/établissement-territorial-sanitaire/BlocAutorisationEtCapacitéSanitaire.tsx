import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurAutorisationEtCapacité } from '../commun/IndicateurAutorisationEtCapacité/IndicateurAutorisationEtCapacité'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocAutorisationEtCapacitéSanitaire.module.css'
import { ContenuAutorisations } from './InfoBulle/ContenuAutorisations'
import { ContenuAutresActivités } from './InfoBulle/ContenuAutresActivités'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}>

export const BlocAutorisationEtCapacitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialSanitaireViewModel.lesAutorisationsSontEllesRenseignées
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
        <IndicateurAutorisationEtCapacité
          contenuInfoBulle={<ContenuAutresActivités
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesAutresActivités}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          />}
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDesAutresActivités}
          identifiant="autres-activités"
          nomDeLIndicateur={wording.AUTRES_ACTIVITÉS}
          source={Sources(wording.FINESS, wording.ARHGOS)}
        >
          {établissementTerritorialSanitaireViewModel.autresActivités}
        </IndicateurAutorisationEtCapacité>
      </ul>
    </Bloc>
  )
}
