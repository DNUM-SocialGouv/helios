import { fireEvent, screen, within } from '@testing-library/react'

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
    contributionAuxFraisDeSiège: 1,
    fondsDeRoulement: -1,
    recettesEtDépenses: -1,
    résultatNetComptable: 0,
    tauxDeCafNette: 2,
    tauxDeVétustéConstruction: 3,
  }

  it.each([
    [indiceDeLIndicateur.résultatNetComptable, wording.RÉSULTAT_NET_COMPTABLE, 'budget-et-finances-résultat-net-comptable'],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, 'budget-et-finances-montant-de-la-contribution'],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF, 'budget-et-finances-taux-de-caf'],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION, 'budget-et-finances-taux-de-vétusté-construction'],
  ])('affiche l’intitulé de l’indicateur %s, avec sa date de mise à jour et un bouton pour accéder aux détails', (indiceDeLIndicateur, libelléDeLIndicateur, identifiantInfoBulle) => {
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

  it.each([
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION],
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
    [indiceDeLIndicateur.résultatNetComptable, wording.RÉSULTAT_NET_COMPTABLE],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION],
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
    [indiceDeLIndicateur.résultatNetComptable],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège],
    [indiceDeLIndicateur.tauxDeCafNette],
    [indiceDeLIndicateur.tauxDeVétustéConstruction],
  ])('affiche une mise en exergue si une ou plusieurs années sont manquantes', (indiceDeLIndicateur) => {
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
    const indicateur = indicateurs[indiceDeLIndicateur]
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} 2021`, { selector: 'p' })
    expect(exergue).toBeInTheDocument()
  })

  it('affiche une phrase à la place des indicateurs lorsqu’aucune donnée n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansBudgetEtFinances = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansBudgetEtFinances} />)

    // THEN
    const budgetEtFinances = screen.getByRole('region', { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES })
    expect(within(budgetEtFinances).getByText(wording.INDICATEURS_VIDES)).toBeInTheDocument()
  })

  describe('L’indicateur du résultat net comptable', () => {
    it('affiche un tableau affichant le résultat net comptable des 3 années passées', () => {
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

    it('n’affiche pas l’indicateur du résultat net comptable si aucune valeur n’est renseigné pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansMontantDeLaContribution = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2019, résultatNetComptable: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020, résultatNetComptable: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2021, résultatNetComptable: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
        ],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansMontantDeLaContribution} />)

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

  describe('L’indicateur du montant de la contribution', () => {
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

    it('n’affiche pas l’indicateur du montant de la contribution si aucune valeur n’est renseigné pour aucune année', () => {
      // GIVEN
      const établissementTerritorialSansMontantDeLaContribution = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2019, contributionAuxFraisDeSiège: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020, contributionAuxFraisDeSiège: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2021, contributionAuxFraisDeSiège: { dateMiseÀJourSource: '2020-01-01', valeur :null } }),
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
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020 }),
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
        budgetEtFinances: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020 })],
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
  })

  describe('L’indicateur du taux de vétusté construction', () => {
    it('affiche un tableau descriptif du taux de vétusté construction avec les trois années', () => {
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

    it('affiche un tableau descriptif du taux de vétusté construction avec deux années', () => {
      // GIVEN
      const établissementTerritorialAvecDeuxAnnées = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020 }),
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

    it('affiche un tableau descriptif du taux de vétusté construction avec une seule année', () => {
      // GIVEN
      const établissementTerritorialAvecDeuxAnnées = new ÉtablissementTerritorialMédicoSocialViewModel({
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinances({ année: 2020 })],
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
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '38,8 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()
    })
  })
})
