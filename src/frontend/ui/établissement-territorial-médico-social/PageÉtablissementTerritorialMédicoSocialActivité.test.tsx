import { screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestFactory } from '../../test-factories/ÉtablissementTerritorialMédicoSocialViewModelTestFactory'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial - Bloc activité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestFactory.créeÉtablissementTerritorialViewModel(wording)

  it('affiche le taux d’occupation en hébergement permanent', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementPermanent = within(indicateurs[0]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, { selector: 'p' })
    expect(tauxOccupationHébergementPermanent).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[0]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[0]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })

  it('affiche le taux d’occupation en hébergement temporaire', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementTemporaire = within(indicateurs[1]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, { selector: 'p' })
    expect(tauxOccupationHébergementTemporaire).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[1]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[1]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })

  it('affiche le taux d’occupation en accueil de jour', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementAccueilDeJour = within(indicateurs[2]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_ACCUEIL_DE_JOUR, { selector: 'p' })
    expect(tauxOccupationHébergementAccueilDeJour).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[2]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[2]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })
})
