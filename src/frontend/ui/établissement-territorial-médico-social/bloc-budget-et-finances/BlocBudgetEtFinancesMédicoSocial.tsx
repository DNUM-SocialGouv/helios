import { useState } from 'react'

import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { Indicateur } from '../../commun/Indicateur/Indicateur'
import { IndicateurGraphique } from '../../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../../commun/Sources/Sources'
import { ContenuCompteDeRésultat } from '../InfoBulle/ContenuCompteDeRésultat'
import { ContenuMontantDeLaContributionAuxFraisDeSiège } from '../InfoBulle/ContenuMontantDeLaContributionAuxFraisDeSiège'
import { ContenuRésultatNetComptable } from '../InfoBulle/ContenuRésultatNetComptable'
import { ContenuTauxDeCaf } from '../InfoBulle/ContenuTauxDeCaf'
import { ContenuTauxDeVétustéConstruction } from '../InfoBulle/ContenuTauxDeVétustéConstruction'
import style from './BlocBudgetEtFinancesMédicoSocial.module.css'
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from './ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel'

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel
}>

export const BlocBudgetEtFinancesMédicoSocial = (
  { établissementTerritorialMédicoSocialBudgetEtFinancesViewModel }: BlocBudgetEtFinancesMédicoSocialProps
) => {
  const { wording } = useDependencies()
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.annéeInitiale)

  if (!établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.desDonnéesBudgetEtFinancesSontRenseignées) {
    return (
      <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    )
  }

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}
    >
      <ul className={style['liste-indicateurs']}>
        <IndicateurGraphique
          années={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.listeDéroulanteDesAnnéesDuCompteDeRésultat(setAnnéeEnCours)}
          contenuInfoBulle={<ContenuCompteDeRésultat
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
          identifiant="budget-et-finances-compte-de-résultat"
          nomDeLIndicateur={<>
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.intituléDuCompteDeRésultat(annéeEnCours)}
            {' '}
          </>}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.compteDeRésultat(annéeEnCours)}
        </IndicateurGraphique>
        {
          établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leRésultatNetComptableEstIlRenseigné &&
          <Indicateur
            contenuInfoBulle={<ContenuRésultatNetComptable
              dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourRésultatNetComptable}
              source={Sources(wording.DIAMANT, wording.CNSA)}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourRésultatNetComptable}
            identifiant="budget-et-finances-résultat-net-comptable"
            nomDeLIndicateur={wording.RÉSULTAT_NET_COMPTABLE}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          >
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.résultatNetComptable}
          </Indicateur>
        }
        {
          établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné &&
          <Indicateur
            contenuInfoBulle={<ContenuMontantDeLaContributionAuxFraisDeSiège
              dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
              source={Sources(wording.DIAMANT, wording.CNSA)}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
            identifiant="budget-et-finances-montant-de-la-contribution"
            nomDeLIndicateur={wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          >
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.montantDeLaContributionAuxFraisDeSiège}
          </Indicateur>
        }
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxDeCaf
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeCaf}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeCaf}
          identifiant="budget-et-finances-taux-de-caf"
          nomDeLIndicateur={wording.TAUX_DE_CAF}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.tauxDeCaf}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxDeVétustéConstruction
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
          identifiant="budget-et-finances-taux-de-vétusté-construction"
          nomDeLIndicateur={wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.tauxDeVétustéConstruction}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
