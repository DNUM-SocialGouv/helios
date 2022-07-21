import { fireEvent, screen, within } from '@testing-library/react'

import {fakeFrontDependencies, htmlNodeAndReactChildMatcher, renderFakeComponent} from '../../testHelper'
import { Recherche } from './Recherche'

const { wording } = fakeFrontDependencies

describe('La page de recherche', () => {
  it('affiche le formulaire', () => {
    // WHEN
    renderFakeComponent(<Recherche />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: wording.RECHERCHE_TITRE })
    expect(titre).toBeInTheDocument()
    const description = screen.getByText(htmlNodeAndReactChildMatcher(wording.RECHERCHE_DESCRIPTION), { selector: 'p' })
    expect(description).toBeInTheDocument()
    const formulaire = screen.getByRole('search')
    const label = within(formulaire).getByLabelText(wording.RECHERCHE_LABEL)
    expect(label).toBeInTheDocument()
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER)
    expect(input).toBeInTheDocument()
    const bouton = within(formulaire).getByRole('button', { name: wording.RECHERCHE_LABEL })
    expect(bouton).toBeInTheDocument()
  })

  it('affiche les résultats après avoir cliqué sur le bouton "Rechercher"', () => {
    // GIVEN
    renderFakeComponent(<Recherche />)
    const nombreResultat = 12
    const recherche = 'Centre hospitalier de Saint Brieuc'
    const formulaire = screen.getByRole('search')
    const bouton = within(formulaire).getByRole('button', { name: wording.RECHERCHE_LABEL })

    // WHEN
    fireEvent.click(bouton)

    // THEN
    const resultat = screen.getByLabelText(wording.RECHERCHE_RESULTAT)
    expect(resultat).toBeInTheDocument()
    const textDuRésultat = within(resultat).getByText(wording.RECHERCHE_NOMBRE_RESULTAT(nombreResultat, recherche), { selector: 'p' })
    expect(textDuRésultat).toBeInTheDocument()

  })
})
