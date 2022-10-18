import { fireEvent, screen, within } from '@testing-library/react'

import { CadreBudgétaire } from '../../../../../database/models/BudgetEtFinancesMédicoSocialModel'
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from '../PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ÉtablissementTerritorialMédicoSocialViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial - bloc budget et finances', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)
  const indiceDeLIndicateur: Record<keyof ÉtablissementTerritorialMédicoSocialBudgetEtFinances, number> = {
    année: -1,
    cadreBudgétaire: -1,
    chargesEtProduits: -1,
    contributionAuxFraisDeSiège: 2,
    fondsDeRoulement: 5,
    recettesEtDépenses: 0,
    résultatNetComptable: 1,
    tauxDeCafNette: 3,
    tauxDeVétustéConstruction: 4,
  }

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses, wording.COMPTE_DE_RÉSULTAT_ERRD, 'budget-et-finances-compte-de-résultat'],
    [indiceDeLIndicateur.résultatNetComptable, wording.RÉSULTAT_NET_COMPTABLE, 'budget-et-finances-résultat-net-comptable'],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, 'budget-et-finances-montant-de-la-contribution'],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF, 'budget-et-finances-taux-de-caf'],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION, 'budget-et-finances-taux-de-vétusté-construction'],
    [indiceDeLIndicateur.fondsDeRoulement, wording.FONDS_DE_ROULEMENT_NET_GLOBAL, 'budget-et-finances-fond-de-roulement-net-global'],
  ])('affiche l’intitulé de l’indicateur %s, avec sa date de mise à jour, ses sources  et un bouton pour accéder aux détails', (indiceDeLIndicateur, libelléDeLIndicateur, identifiantInfoBulle) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur]
    const titre = within(indicateur).getByText(libelléDeLIndicateur, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateur).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 01/01/2022 - Source : CNSA, DIAMANT')
    const abréviationSourceFournisseur = within(indicateur).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const abréviationSourceOrigine = within(indicateur).getAllByText('CNSA', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Caisse Nationale de Solidarité pour l’Autonomie')
    const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', `nom-info-bulle-${identifiantInfoBulle}`)
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche l’intitulé de l’indicateur dans le cas du compte de résultat CA', () => {
    // GIVEN
    const établissementTerritorialCaPa = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activités,
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: 2019 })],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialCaPa} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur.recettesEtDépenses]
    const titre = within(indicateur).getByText(wording.COMPTE_DE_RÉSULTAT_CA, { selector: 'p' })
    expect(titre).toBeInTheDocument()
  })

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses, wording.COMPTE_DE_RÉSULTAT_ERRD],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION],
    [indiceDeLIndicateur.fondsDeRoulement, wording.FONDS_DE_ROULEMENT_NET_GLOBAL],
  ])('affiche le contenu de l’info bulle %s après avoir cliqué sur le bouton "détails"', (indiceDeLIndicateur, libelléDeLIndicateur) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur]
    const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: libelléDeLIndicateur })
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

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses, wording.COMPTE_DE_RÉSULTAT_ERRD],
    [indiceDeLIndicateur.résultatNetComptable, wording.RÉSULTAT_NET_COMPTABLE],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION],
    [indiceDeLIndicateur.fondsDeRoulement, wording.FONDS_DE_ROULEMENT_NET_GLOBAL],
  ])('ferme l’info bulle %s après avoir cliqué sur le bouton "Fermer"', (indiceDeLIndicateur, libelléDeLIndicateur) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur]
    const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: libelléDeLIndicateur })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses],
    [indiceDeLIndicateur.résultatNetComptable],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège],
    [indiceDeLIndicateur.tauxDeCafNette],
    [indiceDeLIndicateur.tauxDeVétustéConstruction],
    [indiceDeLIndicateur.fondsDeRoulement],
  ])('affiche une mise en exergue si une ou plusieurs années sont manquantes', (indiceDeLIndicateur) => {
    // GIVEN
    const établissementTerritorialAvecUneAnnéeManquante = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: 2019 }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 }),
      ],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecUneAnnéeManquante} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur]
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} 2021`, { selector: 'p' })
    expect(exergue).toBeInTheDocument()
  })

  it('affiche une phrase à la place des indicateurs lorsqu’aucune donnée n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansBudgetEtFinances = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activités,
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [
        {
          année: 2019,
          cadreBudgétaire: CadreBudgétaire.ERRD,
          chargesEtProduits: {
            charges: null,
            dateMiseÀJourSource: '2022-01-01',
            produits: null,
          },
          contributionAuxFraisDeSiège: {
            dateMiseÀJourSource: '2022-01-01',
            valeur: null,
          },
          fondsDeRoulement: {
            dateMiseÀJourSource: '2022-03-03',
            valeur: null,
          },
          recettesEtDépenses: {
            dateMiseÀJourSource: '2022-01-01',
            dépensesGroupe1: null,
            dépensesGroupe2: null,
            dépensesGroupe3: null,
            recettesGroupe1: null,
            recettesGroupe2: null,
            recettesGroupe3: null,
          },
          résultatNetComptable: {
            dateMiseÀJourSource: '2022-01-01',
            valeur: null,
          },
          tauxDeCafNette: {
            dateMiseÀJourSource: '2022-03-03',
            valeur: null,
          },
          tauxDeVétustéConstruction: {
            dateMiseÀJourSource: '2022-03-03',
            valeur: null,
          },
        },
      ],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansBudgetEtFinances} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    expect(within(budgetEtFinances).getByText(wording.INDICATEURS_VIDES)).toBeInTheDocument()
  })

  describe('L’indicateur de compte de résultat', () => {
    it('affiche les années dans une liste déroulante par ordre anté-chronologique quand le budget et finances est ERRD', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const année = within(budgetEtFinances).getByLabelText(wording.ANNÉE)
      expect(année).toBeInTheDocument()
      const années = within(année).getAllByRole('option')
      expect(années[0]).toHaveAttribute('value', '2021')
      expect(années[0].textContent).toBe('2021')
      expect(années[1]).toHaveAttribute('value', '2020')
      expect(années[1].textContent).toBe('2020')
      expect(années[2]).toHaveAttribute('value', '2019')
      expect(années[2].textContent).toBe('2019')
    })

    it('affiche les années dans une liste déroulante par ordre anté-chronologique quand le budget et finances est CA PA', () => {
      // GIVEN
      const établissementTerritorialCaPa = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: 2020 }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialCaPa} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const année = within(budgetEtFinances).getByLabelText(wording.ANNÉE)
      expect(année).toBeInTheDocument()
      const années = within(année).getAllByRole('option')
      expect(années[0]).toHaveAttribute('value', '2020')
      expect(années[0].textContent).toBe('2020')
      expect(années[1]).toHaveAttribute('value', '2019')
      expect(années[1].textContent).toBe('2019')
    })

    it('n’affiche pas les années dans une liste déroulante quand aucune donnée n’est renseignée', () => {
      // GIVEN
      const établissementTerritorialSansValeursDansLesAnnéesDeBudgetEtFinances = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({
            année: 2019,
            chargesEtProduits: {
              charges: null,
              dateMiseÀJourSource: '2022-01-01',
              produits: null,
            },
          }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({
            année: 2020,
            recettesEtDépenses: {
              dateMiseÀJourSource: '2022-01-01',
              dépensesGroupe1: null,
              dépensesGroupe2: null,
              dépensesGroupe3: null,
              recettesGroupe1: null,
              recettesGroupe2: null,
              recettesGroupe3: null,
            },
          }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial
        établissementTerritorialViewModel={établissementTerritorialSansValeursDansLesAnnéesDeBudgetEtFinances}
      />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const année = within(budgetEtFinances).queryByLabelText(wording.ANNÉE)
      expect(année).not.toBeInTheDocument()
    })

    it('affiche un tableau descriptif sur la dernière année qui est ERRD', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses]
      const tableau = within(recettesEtDépenses).getByRole('table')
      const titreBudgétaire = within(tableau).getByRole('columnheader', { name: wording.TITRE_BUDGÉTAIRE })
      expect(titreBudgétaire).toBeInTheDocument()
      const dépensesLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.DÉPENSES })
      expect(dépensesLigneDEnTête).toBeInTheDocument()
      const recettesLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.RECETTES })
      expect(recettesLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const colonne1Ligne1 = within(lignes[1]).getByRole('cell', { name: wording.TOTAL })
      expect(colonne1Ligne1).toBeInTheDocument()
      const colonne2Ligne1 = within(lignes[1]).getByRole('cell', { name: '−3 254 417 €' })
      expect(colonne2Ligne1).toBeInTheDocument()
      const colonne3Ligne1 = within(lignes[1]).getByRole('cell', { name: '3 540 117 €' })
      expect(colonne3Ligne1).toBeInTheDocument()
      const colonne1Ligne2 = within(lignes[2]).getByRole('cell', { name: wording.GROUPE_I })
      expect(colonne1Ligne2).toBeInTheDocument()
      const colonne2Ligne2 = within(lignes[2]).getByRole('cell', { name: '−129 491 €' })
      expect(colonne2Ligne2).toBeInTheDocument()
      const colonne3Ligne2 = within(lignes[2]).getByRole('cell', { name: '3 388 394 €' })
      expect(colonne3Ligne2).toBeInTheDocument()
      const colonne1Ligne3 = within(lignes[3]).getByRole('cell', { name: wording.GROUPE_II })
      expect(colonne1Ligne3).toBeInTheDocument()
      const colonne2Ligne3 = within(lignes[3]).getByRole('cell', { name: '−2 718 457 €' })
      expect(colonne2Ligne3).toBeInTheDocument()
      const colonne3Ligne3 = within(lignes[3]).getByRole('cell', { name: '22 231 €' })
      expect(colonne3Ligne3).toBeInTheDocument()
      const colonne1Ligne4 = within(lignes[4]).getByRole('cell', { name: wording.GROUPE_III })
      expect(colonne1Ligne4).toBeInTheDocument()
      const colonne2Ligne4 = within(lignes[4]).getByRole('cell', { name: '−406 469 €' })
      expect(colonne2Ligne4).toBeInTheDocument()
      const colonne3Ligne4 = within(lignes[4]).getByRole('cell', { name: '129 491 €' })
      expect(colonne3Ligne4).toBeInTheDocument()
    })

    it('affiche un tableau descriptif sur la dernière année qui est CA', () => {
      // GIVEN
      const établissementTerritorialCaPa = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa()],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialCaPa} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses]
      const tableau = within(recettesEtDépenses).getByRole('table')
      const dépensesLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.CHARGES })
      expect(dépensesLigneDEnTête).toBeInTheDocument()
      const recettesLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.PRODUITS })
      expect(recettesLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const colonne1Ligne1 = within(lignes[1]).getByRole('cell', { name: wording.TOTAL })
      expect(colonne1Ligne1).toBeInTheDocument()
      const colonne2Ligne1 = within(lignes[1]).getByRole('cell', { name: '−1 613 142 €' })
      expect(colonne2Ligne1).toBeInTheDocument()
      const colonne3Ligne1 = within(lignes[1]).getByRole('cell', { name: '1 633 422 €' })
      expect(colonne3Ligne1).toBeInTheDocument()
    })

    it('affiche un tableau descriptif en fonction de l’année sélectionnée', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const année = within(budgetEtFinances).getByLabelText(wording.ANNÉE)

      // WHEN
      fireEvent.change(année, { target: { value: '2019' } })

      // THEN
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses]
      const tableau = within(recettesEtDépenses).getByRole('table')

      const lignes = within(tableau).getAllByRole('row')
      const colonne2Ligne1 = within(lignes[1]).getByRole('cell', { name: '−1 392 795 €' })
      expect(colonne2Ligne1).toBeInTheDocument()
      const colonne3Ligne1 = within(lignes[1]).getByRole('cell', { name: '1 400 085 €' })
      expect(colonne3Ligne1).toBeInTheDocument()
      const colonne2Ligne2 = within(lignes[2]).getByRole('cell', { name: '−161 786 €' })
      expect(colonne2Ligne2).toBeInTheDocument()
      const colonne3Ligne2 = within(lignes[2]).getByRole('cell', { name: '1 376 745 €' })
      expect(colonne3Ligne2).toBeInTheDocument()
      const colonne2Ligne3 = within(lignes[3]).getByRole('cell', { name: '−1 222 577 €' })
      expect(colonne2Ligne3).toBeInTheDocument()
      const colonne3Ligne3 = within(lignes[3]).getByRole('cell', { name: '23 340 €' })
      expect(colonne3Ligne3).toBeInTheDocument()
      const colonne2Ligne4 = within(lignes[4]).getByRole('cell', { name: '−8 433 €' })
      expect(colonne2Ligne4).toBeInTheDocument()
      const colonne3Ligne4 = within(lignes[4]).getByRole('cell', { name: '0 €' })
      expect(colonne3Ligne4).toBeInTheDocument()
    })

    it('n’affiche rien si aucune valeur n’est renseignée pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansRésultatNetComptable = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({
            année: 2019,
            chargesEtProduits: {
              charges: null,
              dateMiseÀJourSource: '2022-01-01',
              produits: null,
            },
          }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({
            année: 2020,
            recettesEtDépenses: {
              dateMiseÀJourSource: '2022-01-01',
              dépensesGroupe1: null,
              dépensesGroupe2: null,
              dépensesGroupe3: null,
              recettesGroupe1: null,
              recettesGroupe2: null,
              recettesGroupe3: null,
            },
          }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansRésultatNetComptable} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      expect(within(budgetEtFinances).queryByText(wording.COMPTE_DE_RÉSULTAT_ERRD, { selector: 'p' })).not.toBeInTheDocument()
    })
  })

  describe('L’indicateur du résultat net comptable', () => {
    it('affiche un tableau affichant les 3 années passées', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const résultatNetComptable = indicateurs[indiceDeLIndicateur.résultatNetComptable]
      const tableauDesRésultatNetComptable = within(résultatNetComptable).getByRole('table')
      expect(tableauDesRésultatNetComptable).toBeInTheDocument()

      const annéeLigneDEnTête = within(tableauDesRésultatNetComptable).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableauDesRésultatNetComptable).getByRole('columnheader', { name: wording.MONTANT })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableauDesRésultatNetComptable).getAllByRole('row')
      expect(lignes).toHaveLength(1 + 3)
      const premièreAnnée = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(premièreAnnée).toBeInTheDocument()
      const valeurDeLaPremièreAnnée = within(lignes[1]).getByRole('cell', { name: '7 290 €' })
      expect(valeurDeLaPremièreAnnée).toBeInTheDocument()

      const deuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(deuxièmeAnnée).toBeInTheDocument()
      const valeurDeLaDeuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '3 034 €' })
      expect(valeurDeLaDeuxièmeAnnée).toBeInTheDocument()

      const troisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(troisièmeAnnée).toBeInTheDocument()
      const valeurDeLaTroisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '−38 331 €' })
      expect(valeurDeLaTroisièmeAnnée).toBeInTheDocument()
    })

    it('n’affiche rien si aucune valeur n’est renseignée pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansRésultatNetComptable = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2019, résultatNetComptable: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020, résultatNetComptable: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2021, résultatNetComptable: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansRésultatNetComptable} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      expect(within(budgetEtFinances).queryByText(wording.RÉSULTAT_NET_COMPTABLE, { selector: 'p' })).not.toBeInTheDocument()
    })

    it('affiche le contenu de l’info bulle %s après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const indicateur = indicateurs[indiceDeLIndicateur.résultatNetComptable]
      const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })

      // WHEN
      fireEvent.click(détails)

      // THEN
      expect(détails).toHaveAttribute('data-fr-opened', 'true')
      const infoBulle = screen.getByRole('dialog', { name: wording.RÉSULTAT_NET_COMPTABLE })
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
      const sources = within(infoBulle).getByRole('region', { name: wording.SOURCES })
      expect(sources).toBeInTheDocument()
    })
  })

  describe('L’indicateur du montant de la contribution aux frais de siège et/ou groupement', () => {
    it('affiche un tableau des 3 années passées', () => {
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
      const valeurDeLaPremièreAnnée = within(lignes[1]).getByRole('cell', { name: '−10 000 €' })
      expect(valeurDeLaPremièreAnnée).toBeInTheDocument()

      const deuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(deuxièmeAnnée).toBeInTheDocument()
      const valeurDeLaDeuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '−20 000 €' })
      expect(valeurDeLaDeuxièmeAnnée).toBeInTheDocument()

      const troisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(troisièmeAnnée).toBeInTheDocument()
      const valeurDeLaTroisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '−30 000 €' })
      expect(valeurDeLaTroisièmeAnnée).toBeInTheDocument()
    })

    it('n’affiche rien si aucune valeur n’est renseignée pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansMontantDeLaContribution = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2019, contributionAuxFraisDeSiège: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020, contributionAuxFraisDeSiège: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2021, contributionAuxFraisDeSiège: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansMontantDeLaContribution} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      expect(within(budgetEtFinances).queryByText(wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, { selector: 'p' })).not.toBeInTheDocument()
    })
  })

  describe('L’indicateur du taux de caf', () => {
    it('affiche un tableau descriptif du taux de caf avec les trois années', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const tauxDeCaf = indicateurs[indiceDeLIndicateur.tauxDeCafNette]
      const tableau = within(tauxDeCaf).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_DE_CAF })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '13,5 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '16,5 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '38,3 %' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })

    it('affiche un tableau descriptif du taux de caf avec deux années', () => {
      // GIVEN
      const établissementTerritorialAvecDeuxAnnées = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecDeuxAnnées} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const tauxDeCaf = indicateurs[indiceDeLIndicateur.tauxDeCafNette]
      const tableau = within(tauxDeCaf).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_DE_CAF })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '13,5 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '13,5 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()
    })

    it('affiche un tableau descriptif du taux de caf avec une seule année', () => {
      // GIVEN
      const établissementTerritorialAvecDeuxAnnées = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 })],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecDeuxAnnées} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const tauxDeCaf = indicateurs[indiceDeLIndicateur.tauxDeCafNette]
      const tableau = within(tauxDeCaf).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_DE_CAF })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '13,5 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()
    })

    it('n’affiche rien si aucune valeur n’est renseignée pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansRésultatNetComptable = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({
            année: 2020,
            tauxDeCafNette: {
              dateMiseÀJourSource: '2022-03-03',
              valeur: null,
            },
          }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansRésultatNetComptable} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      expect(within(budgetEtFinances).queryByText(wording.TAUX_DE_CAF, { selector: 'p' })).not.toBeInTheDocument()
    })
  })

  describe('L’indicateur du taux de vétusté construction', () => {
    it('affiche un tableau descriptif avec les trois années', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const tauxDeVétustéConstruction = indicateurs[indiceDeLIndicateur.tauxDeVétustéConstruction]
      const tableau = within(tauxDeVétustéConstruction).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '38,8 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '53,2 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '31,2 %' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })

    it('affiche un tableau descriptif avec deux années', () => {
      // GIVEN
      const établissementTerritorialAvecDeuxAnnées = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecDeuxAnnées} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const tauxDeVétustéConstruction = indicateurs[indiceDeLIndicateur.tauxDeVétustéConstruction]
      const tableau = within(tauxDeVétustéConstruction).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '38,8 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '38,8 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()
    })

    it('affiche un tableau descriptif avec une seule année', () => {
      // GIVEN
      const établissementTerritorialAvecUneAnnée = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 })],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecUneAnnée} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const tauxDeVétustéConstruction = indicateurs[indiceDeLIndicateur.tauxDeVétustéConstruction]
      const tableau = within(tauxDeVétustéConstruction).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '38,8 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()
    })

    it('n’affiche rien si aucune valeur n’est renseignée pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansRésultatNetComptable = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({
            année: 2020,
            tauxDeVétustéConstruction: {
              dateMiseÀJourSource: '2022-03-03',
              valeur: null,
            },
          }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansRésultatNetComptable} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      expect(within(budgetEtFinances).queryByText(wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION, { selector: 'p' })).not.toBeInTheDocument()
    })
  })

  describe('L’indicateur du fonds de roulement net global', () => {

    it('affiche un tableau affichant le fonds de roulement net global des 3 années passées d’un établissement sous cadre ERRD', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const fondsDeRoulement = indicateurs[indiceDeLIndicateur.fondsDeRoulement]
      const tableauDesRésultatNetComptable = within(fondsDeRoulement).getByRole('table')
      expect(tableauDesRésultatNetComptable).toBeInTheDocument()

      const annéeLigneDEnTête = within(tableauDesRésultatNetComptable).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableauDesRésultatNetComptable).getByRole('columnheader', { name: wording.MONTANT })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableauDesRésultatNetComptable).getAllByRole('row')
      expect(lignes).toHaveLength(1 + 3)
      const premièreAnnée = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(premièreAnnée).toBeInTheDocument()
      const valeurDeLaPremièreAnnée = within(lignes[1]).getByRole('cell', { name: '1 057 218 €' })
      expect(valeurDeLaPremièreAnnée).toBeInTheDocument()

      const deuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(deuxièmeAnnée).toBeInTheDocument()
      const valeurDeLaDeuxièmeAnnée = within(lignes[2]).getByRole('cell', { name: '3 988 284 €' })
      expect(valeurDeLaDeuxièmeAnnée).toBeInTheDocument()

      const troisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(troisièmeAnnée).toBeInTheDocument()
      const valeurDeLaTroisièmeAnnée = within(lignes[3]).getByRole('cell', { name: '2 206 969 €' })
      expect(valeurDeLaTroisièmeAnnée).toBeInTheDocument()
    })

    it('n’affiche pas de mise en exergue pour les années sous un autre cadre budgétaire que ERRD', () => {
      // GIVEN
      const établissementTerritorialAvecDeuxAnnéesEnCa = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPh({ année: 2020 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2021 }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecDeuxAnnéesEnCa} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      const indicateurs = within(budgetEtFinances).getAllByRole('listitem')
      const indicateur = indicateurs[indiceDeLIndicateur.fondsDeRoulement]
      expect(within(indicateur).queryByText(wording.AUCUNE_DONNÉE_RENSEIGNÉE, { selector: 'p' })).not.toBeInTheDocument()
    })

    it('n’affiche pas l’indicateur du résultat net comptable si aucune valeur n’est renseigné pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansFondsDeRoulement = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2019, fondsDeRoulement: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020, fondsDeRoulement: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2021, fondsDeRoulement: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansFondsDeRoulement} />)

      // THEN
      const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
      expect(within(budgetEtFinances).queryByText(wording.FONDS_DE_ROULEMENT_NET_GLOBAL, { selector: 'p' })).not.toBeInTheDocument()
    })
  })
})
