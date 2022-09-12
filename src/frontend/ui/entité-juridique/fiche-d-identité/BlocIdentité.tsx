import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../../commun/IndicateurIdentité/IndicateurIdentité'
import { Sources } from '../../commun/Sources/Sources'
import { EntitéJuridiqueViewModel } from '../EntitéJuridiqueViewModel'
import styles from './BlocIdentité.module.css'

type BlocIdentitéProps = {
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}

export const BlocIdentité = ({ entitéJuridiqueViewModel }: BlocIdentitéProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul
        className={styles['liste-indicateurs']}
      >
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuNomDeLEntitéJuridique}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={entitéJuridiqueViewModel.nomDeLEntitéJuridique}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuNuméroFiness}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
          valeur={entitéJuridiqueViewModel.numéroFiness}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
          valeur={entitéJuridiqueViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuTéléphone}
          nomDeLIndicateur={wording.TÉLÉPHONE}
          source={Sources(wording.FINESS)}
          valeur={entitéJuridiqueViewModel.téléphone}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJourDuStatutDeLEntitéJuridique}
          nomDeLIndicateur={wording.STATUT_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={entitéJuridiqueViewModel.statutDeLEntitéJuridique}
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
          valeur="À venir"
        />
      </ul>
    </Bloc>
  )
}
