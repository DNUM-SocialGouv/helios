import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocIdentitéMédicoSocial.module.css'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocIdentitéMédicoSocialProps = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocIdentitéMédicoSocialProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuNomDeLÉtablissementTerritorial}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTéléphoneEtDeLEmail}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuStatutDeLÉtablissement}
          nomDeLIndicateur={wording.STATUT_JURIDIQUE_EJ}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.statutDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuMonoÉtablissement}
          nomDeLIndicateur={wording.MONO_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.monoÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuPrincipalOuDuSecondaire}
          nomDeLIndicateur={wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialMédicoSocialViewModel.principalOuSecondaire}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLEntréeEnVigueurDuCpom}
          nomDeLIndicateur={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
          source={Sources(wording.DIAMANT)}
          valeur={établissementTerritorialMédicoSocialViewModel.dateDeLEntréeEnVigueurDuCpom}
        />
      </ul>
    </Bloc>
  )
}
