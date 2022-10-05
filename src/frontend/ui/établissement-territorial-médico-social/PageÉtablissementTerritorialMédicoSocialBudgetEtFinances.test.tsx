import { screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial - bloc budget et finances', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)
  const indiceDeLIndicateur: Record<keyof ÉtablissementTerritorialMédicoSocialBudgetEtFinances, number> = {
    année: -1,
    cadreBudgétaire: -1,
    chargesEtProduits: -1,
    contributionAuxFraisDeSiège: 0,
    fondsDeRoulement: -1,
    recettesEtDépenses: -1,
    résultatNetComptable: -1,
    tauxDeCafNette: -1,
    tauxDeVétustéConstruction: -1,
  }

  it('affiche le titre de l’indicateur du montant de la contribution aux frais de sièges', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    expect(indicateurs).toHaveLength(1)
    const titre = within(indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège]).getByText(wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, { selector: 'p' })
    expect(titre).toBeInTheDocument()
  })
})
