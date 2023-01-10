import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../../commun/IndicateurIdentité/IndicateurIdentité'
import { Sources } from '../../commun/Sources/Sources'
import { EntitéJuridiqueViewModel } from '../EntitéJuridiqueViewModel'
import styles from './BlocIdentité.module.css'

type BlocIdentitéProps = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}>

export const BlocIdentité = ({ entitéJuridiqueViewModel }: BlocIdentitéProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc estCeIdentité={true} titre={wording.TITRE_BLOC_IDENTITÉ}>
      <ul className={`indicateurs ${styles['liste-indicateurs']}`}>
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuNomDeLEntitéJuridique}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
        >
          {entitéJuridiqueViewModel.nomDeLEntitéJuridique}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuNuméroFiness}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
        >
          {entitéJuridiqueViewModel.numéroFiness}
        </IndicateurIdentité>
        <IndicateurIdentité dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDusiren} nomDeLIndicateur={wording.SIREN} source={Sources(wording.FINESS)}>
          {entitéJuridiqueViewModel.siren}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
        >
          {entitéJuridiqueViewModel.adresse}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuTéléphone}
          nomDeLIndicateur={wording.TÉLÉPHONE}
          source={Sources(wording.FINESS)}
        >
          {entitéJuridiqueViewModel.téléphone}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuStatutDeLEntitéJuridique}
          nomDeLIndicateur={wording.STATUT_JURIDIQUE}
          source={Sources(wording.FINESS)}
        >
          {entitéJuridiqueViewModel.statutDeLEntitéJuridique}
        </IndicateurIdentité>
      </ul>
    </Bloc>
  )
}
