import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../../commun/IndicateurIdentité/IndicateurIdentité'
import { Sources } from '../../commun/Sources/Sources'
import styles from './BlocIdentitéSanitaire.module.css'
import { ÉtablissementTerritorialSanitaireIdentitéViewModel } from './ÉtablissementTerritorialSanitaireIdentitéViewModel'

type BlocIdentitéSanitaireProps = {
  établissementTerritorialSanitaireIdentitéViewModel: ÉtablissementTerritorialSanitaireIdentitéViewModel
}

export const BlocIdentitéSanitaire = ({ établissementTerritorialSanitaireIdentitéViewModel }: BlocIdentitéSanitaireProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul className={`indicateurs ${styles['liste-indicateurs']}`}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuNomDeLÉtablissementTerritorial}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDutéléphoneEtDeLEmail}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuStatutDeLÉtablissement}
          nomDeLIndicateur={wording.STATUT_JURIDIQUE_EJ}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialSanitaireIdentitéViewModel.statutDeLÉtablissement}
        />
      </ul>
    </Bloc>
  )
}
