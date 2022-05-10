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
            label={wording.NOM_DE_L_ÉTABLISSEMENT}
            valeur="CENTRE HOSPITALIER DE SAINT BRIEUC"
          />
          <Indicateur
            label={wording.NUMÉRO_FINESS}
            valeur="220000020"
          />
          <Indicateur
            label={wording.ADRESSE}
            valeur="10 Rue Marcel Proust 22023 ST BRIEUC CEDEX 1"
          />
          <Indicateur
            label={wording.TÉLÉPHONE_ET_EMAIL}
            valeur="02 96 01 71 23   direction@ch-stbrieuc.fr"
          />
        </div>
        <div
          className="fr-col"
        >
          <Indicateur
            label={wording.NOM_DU_DIRECTEUR}
            valeur="DVADAURE LAURE"
          />
          <Indicateur
            label={wording.STATUT_DE_L_ÉTABLISSEMENT}
            valeur="Public"
          />
          <Indicateur
            label={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
            valeur="01/01/2019"
          />
        </div>
      </div>
    </Bloc>
  )
}
