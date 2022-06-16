import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import styles from './BlocIdentitéSanitaire.module.css'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocIdentitéSanitaireType = {
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}

export const BlocIdentitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocIdentitéSanitaireType) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeLePrincipal={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ADRESSE}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.NOM_DU_DIRECTEUR}
          valeur="À venir"
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.STATUT_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialSanitaireViewModel.statutDeLÉtablissement}
        />
      </ul>
    </Bloc>
  )
}
