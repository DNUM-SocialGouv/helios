import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import { ÉtablissementTerritorialViewModel } from './ÉtablissementTerritorialViewModel'

type BlocIdentitéType = {
  établissementTerritorialViewModel: ÉtablissementTerritorialViewModel
}

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialViewModel }: BlocIdentitéType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <ul>
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
      </ul>
    </Bloc>
  )
}
