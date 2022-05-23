import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import styles from './BlocIdentité.module.css'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import { Indicateur } from './Indicateur'

type BlocIdentitéType = {
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}

export const BlocIdentité = ({ entitéJuridiqueViewModel }: BlocIdentitéType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <div className={'fr-grid-row ' + styles['grille-indicateurs']}>
        <ul
          className={styles['colonne-indicateurs']}
        >
          <Indicateur
            dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
            label={wording.NOM_DE_L_ÉTABLISSEMENT}
            source={wording.FINESS}
            valeur={entitéJuridiqueViewModel.nomDeLEntitéJuridique}
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
            label={wording.NUMÉRO_FINESS}
            source={wording.FINESS}
            valeur={entitéJuridiqueViewModel.numéroFiness}
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
            label={wording.ADRESSE}
            source={wording.FINESS}
            valeur={entitéJuridiqueViewModel.adresse}
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
            label={wording.TÉLÉPHONE}
            source={wording.FINESS}
            valeur={entitéJuridiqueViewModel.téléphone}
          />
          <Indicateur
            label={wording.NOM_DU_DIRECTEUR}
            valeur="À venir"
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridiqueViewModel.dateDeMiseÀJour}
            label={wording.STATUT_DE_L_ÉTABLISSEMENT}
            source={wording.FINESS}
            valeur={entitéJuridiqueViewModel.statutDeLEntitéJuridique}
          />
          <Indicateur
            label={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
            valeur="À venir"
          />
        </ul>
      </div>
    </Bloc>
  )
}
