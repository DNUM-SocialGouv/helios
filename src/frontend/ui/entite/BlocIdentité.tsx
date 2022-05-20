import { EntitéJuridique } from '../../../backend/métier/entities/EntitéJuridique'
import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import styles from './BlocIdentité.module.css'
import { Indicateur } from './Indicateur'

type BlocIdentitéType = {
  entitéJuridique: EntitéJuridique
}

export const BlocIdentité = ({ entitéJuridique }: BlocIdentitéType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <div className={'fr-grid-row ' + styles['grille-indicateurs']}>
        <div
          className={'fr-col ' + styles['colonne-indicateurs']}
        >
          <Indicateur
            dateDeMiseÀJour={entitéJuridique.dateMiseAJourSource}
            label={wording.NOM_DE_L_ÉTABLISSEMENT}
            source="FINESS"
            valeur={entitéJuridique.raisonSociale}
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridique.dateMiseAJourSource}
            label={wording.NUMÉRO_FINESS}
            source="FINESS"
            valeur={entitéJuridique.numéroFinessEntitéJuridique}
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridique.dateMiseAJourSource}
            label={wording.ADRESSE}
            source="FINESS"
            valeur={entitéJuridique.adresseNuméroVoie + ' ' + entitéJuridique.adresseTypeVoie + ' ' + entitéJuridique.adresseVoie + ' ' + entitéJuridique.adresseAcheminement}
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridique.dateMiseAJourSource}
            label={wording.TÉLÉPHONE}
            source="FINESS"
            valeur={entitéJuridique.téléphone}
          />
        </div>
        <div
          className={'fr-col ' + styles['colonne-indicateurs']}
        >
          <Indicateur
            label={wording.NOM_DU_DIRECTEUR}
            valeur="À venir"
          />
          <Indicateur
            dateDeMiseÀJour={entitéJuridique.dateMiseAJourSource}
            label={wording.STATUT_DE_L_ÉTABLISSEMENT}
            source="FINESS"
            valeur={entitéJuridique.libelléStatutJuridique}
          />
          <Indicateur
            label={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
            valeur="À venir"
          />
        </div>
      </div>
    </Bloc>
  )
}
