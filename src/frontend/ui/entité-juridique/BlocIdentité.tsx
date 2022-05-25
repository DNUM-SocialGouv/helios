import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import styles from './BlocIdentité.module.css'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'

type BlocIdentitéType = {
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}

export const BlocIdentité = ({ entitéJuridiqueViewModel }: BlocIdentitéType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <ul
        className={styles['liste-indicateurs']}
      >
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={entitéJuridiqueViewModel.nomDeLEntitéJuridique}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={wording.FINESS}
          valeur={entitéJuridiqueViewModel.numéroFiness}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ADRESSE}
          source={wording.FINESS}
          valeur={entitéJuridiqueViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TÉLÉPHONE}
          source={wording.FINESS}
          valeur={entitéJuridiqueViewModel.téléphone}
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.NOM_DU_DIRECTEUR}
          valeur="À venir"
        />
        <IndicateurIdentité
          dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.STATUT_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
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
