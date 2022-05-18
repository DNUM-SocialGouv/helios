import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import styles from './BlocIdentité.module.css'
import { Indicateur } from './Indicateur'

export const BlocIdentité = () => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <div className={'fr-grid-row ' + styles['grille-indicateurs']}>
        <div
          className={'fr-col ' + styles['colonne-indicateurs']}
        >
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.NOM_DE_L_ÉTABLISSEMENT}
            source="FINESS"
            valeur="CENTRE HOSPITALIER DE SAINT BRIEUC"
          />
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.NUMÉRO_FINESS}
            source="FINESS"
            valeur="220000020"
          />
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.ADRESSE}
            source="FINESS"
            valeur="10 Rue Marcel Proust 22023 ST BRIEUC CEDEX 1"
          />
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.TÉLÉPHONE}
            source="FINESS"
            valeur="02 96 01 71 23"
          />
        </div>
        <div
          className={'fr-col ' + styles['colonne-indicateurs']}
        >
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.NOM_DU_DIRECTEUR}
            source="FINESS"
            valeur="À venir"
          />
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.STATUT_DE_L_ÉTABLISSEMENT}
            source="FINESS"
            valeur="Public"
          />
          <Indicateur
            dateDeMiseÀJour="07/07/2021"
            label={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
            source="FINESS"
            valeur="01/01/2019"
          />
        </div>
      </div>
    </Bloc>
  )
}
