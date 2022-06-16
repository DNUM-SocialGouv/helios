import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import styles from './BlocIdentitéMédicoSocial.module.css'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocIdentitéMédicoSocialType = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocIdentitéMédicoSocialType) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeLePrincipal={true}
      titre={wording.TITRE_BLOC_IDENTITÉ}
    >
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ADRESSE}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.NOM_DU_DIRECTEUR}
          valeur="À venir"
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.STATUT_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.statutDeLÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.MONO_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.monoÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE}
          source={wording.FINESS}
          valeur={établissementTerritorialMédicoSocialViewModel.principalOuSecondaire}
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
          valeur="À venir"
        />
      </ul>
    </Bloc>
  )
}
