import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocIdentitéMédicoSocial.module.css'
import { ÉtablissementTerritorialMédicoSocialIdentitéViewModel } from './ÉtablissementTerritorialMédicoSocialIdentitéViewModel'

type BlocIdentitéMédicoSocialProps = {
  établissementTerritorialIdentitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialIdentitéViewModel
}

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialIdentitéMédicoSocialViewModel }: BlocIdentitéMédicoSocialProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuNomDeLÉtablissementTerritorial}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuTéléphoneEtDeLEmail}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuStatutDeLÉtablissement}
          nomDeLIndicateur={wording.STATUT_JURIDIQUE_EJ}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.statutDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuMonoÉtablissement}
          nomDeLIndicateur={wording.MONO_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.monoÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuPrincipalOuDuSecondaire}
          nomDeLIndicateur={wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE}
          source={Sources(wording.FINESS)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.principalOuSecondaire}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLEntréeEnVigueurDuCpom}
          nomDeLIndicateur={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
          source={Sources(wording.DIAMANT)}
          valeur={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeLEntréeEnVigueurDuCpom}
        />
      </ul>
    </Bloc>
  )
}
