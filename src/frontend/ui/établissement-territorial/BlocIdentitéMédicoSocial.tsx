import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import styles from './BlocIdentitéMédicoSocial.module.css'
import { ÉtablissementTerritorialViewModel } from './ÉtablissementTerritorialViewModel'

type BlocIdentitéType = {
  établissementTerritorialViewModel: ÉtablissementTerritorialViewModel
}

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialViewModel }: BlocIdentitéType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.nomDeLÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.numéroFinessÉtablissementTerritorial}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ADRESSE}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.adresse}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.téléphoneEtEmail}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.entitéJuridiqueDeRattachement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.catégorieDeLÉtablissement}
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.NOM_DU_DIRECTEUR}
          valeur="À venir"
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.STATUT_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur=""
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.MONO_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.monoÉtablissement}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.principalOuSecondaire}
        />
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.SITE_INTERNET}
          source={wording.FINESS}
          valeur=""
        />
        <IndicateurIdentité
          nomDeLIndicateur={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
          valeur="À venir"
        />
      </ul>
    </Bloc>
  )
}
