import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocIdentitéSanitaire.module.css'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocIdentitéSanitaireProps = {
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}

export const BlocIdentitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocIdentitéSanitaireProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNomDeLÉtablissementTerritorial}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDutéléphoneEtDeLEmail}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuStatutDeLÉtablissement}
          nomDeLIndicateur={wording.STATUT_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireViewModel.statutDeLÉtablissement}
        />
      </ul>
    </Bloc>
  )
}
