import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

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

  it('affiche l’intitulé de l’indicateur du montant de la contribution aux frais de sièges, avec sa date de mise à jour et un bouton pour accéder aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const contributionAuxFraisDeSiège = indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège]
    const titre = within(contributionAuxFraisDeSiège).getByText(wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(contributionAuxFraisDeSiège).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 01/01/2022 - Source : CNSA, DIAMANT')
    const abréviationSourceFournisseur = within(contributionAuxFraisDeSiège).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const abréviationSourceOrigine = within(contributionAuxFraisDeSiège).getAllByText('CNSA', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Caisse Nationale de Solidarité pour l’Autonomie')
    const détails = within(contributionAuxFraisDeSiège).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-budget-et-finances-0')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche un tableau affichant le montant de la contribution aux frais de sièges des 3 années passées', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const contributionAuxFraisDeSiège = indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège]
    const tableauDesMontantsDesContributions = within(contributionAuxFraisDeSiège).getByRole('table')
    expect(tableauDesMontantsDesContributions).toBeInTheDocument()

    const annéeLigneDEnTête = within(tableauDesMontantsDesContributions).getByRole('columnheader', { name: wording.ANNÉE })
    const indicateurLigneDEnTête = within(tableauDesMontantsDesContributions).getByRole('columnheader', { name: wording.MONTANT })
    expect(annéeLigneDEnTête).toBeInTheDocument()
    expect(indicateurLigneDEnTête).toBeInTheDocument()

    const lignes = within(tableauDesMontantsDesContributions).getAllByRole('row')
    expect(lignes).toHaveLength(1 + 3)
    const premièreAnnée = within(lignes[1]).getByRole('cell', { name: '2019' })
    expect(premièreAnnée).toBeInTheDocument()
    const valeurDeLaPremièreAnnée = within(lignes[1]).getByRole('cell', { name: '-10 000 €' })
    expect(valeurDeLaPremièreAnnée).toBeInTheDocument()

    const deuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '2020' })
    expect(deuxièmeAnnée).toBeInTheDocument()
    const valeurDeLaDeuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '-20 000 €' })
    expect(valeurDeLaDeuxièmeAnnée).toBeInTheDocument()

    const troisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '2021' })
    expect(troisièmeAnnée).toBeInTheDocument()
    const valeurDeLaTroisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '-30 000 €' })
    expect(valeurDeLaTroisièmeAnnée).toBeInTheDocument()
  })

  it('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const contributionAuxFraisDeSiège = indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège]
    const détails = within(contributionAuxFraisDeSiège).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
    const abréviationSourceFournisseur = within(infoBulle).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const abréviationSourceOrigine = within(infoBulle).getAllByText('CNSA', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Caisse Nationale de Solidarité pour l’Autonomie')
    const élémentsDeCompréhension = within(infoBulle).getByRole('region', { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION })
    expect(élémentsDeCompréhension).toBeInTheDocument()
    const fréquence = within(infoBulle).getByRole('region', { name: wording.FRÉQUENCE })
    expect(fréquence).toBeInTheDocument()
    const modeDeCalcul = within(infoBulle).getByRole('region', { name: wording.MODE_DE_CALCUL })
    expect(modeDeCalcul).toBeInTheDocument()
    const sources = within(infoBulle).getByRole('region', { name: wording.SOURCES })
    expect(sources).toBeInTheDocument()
  })

  it('ferme l’info bulle après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const contributionAuxFraisDeSiège = indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège]
    const détails = within(contributionAuxFraisDeSiège).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche une mise en exergue si une ou plusieurs années sont manquantes', () => {
    // GIVEN
    const établissementTerritorialAvecUneAnnéeManquante = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2019 }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020 }),
      ],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecUneAnnéeManquante} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const contributionAuxFraisDeSiège = indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège]
    const exergue = within(contributionAuxFraisDeSiège).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} 2021`, { selector: 'p' })
    expect(exergue).toBeInTheDocument()
  })

  it('n’affiche pas l’indicateur du montant de la contribution si aucune valeur n’est renseigné pour aucune année', () => {
    // GIVEN
    const établissementTerritorialSansBudgetEtFinances = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2019, contributionAuxFraisDeSiège: null }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020, contributionAuxFraisDeSiège: null }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2021, contributionAuxFraisDeSiège: null }),
      ],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansBudgetEtFinances} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    expect(within(budgetEtFinances).queryByText(wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, { selector: 'p' })).not.toBeInTheDocument()
  })
})
