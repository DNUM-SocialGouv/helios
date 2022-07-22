import { fireEvent, screen, within } from '@testing-library/react'

import { fakeFrontDependencies, htmlNodeAndReactChildMatcher, renderFakeComponent } from '../../testHelper'
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
    const résultat = screen.getByLabelText(wording.RECHERCHE_RESULTAT)
    expect(résultat).toBeInTheDocument()
    const textDuRésultat = within(résultat).getByText(wording.RECHERCHE_NOMBRE_RESULTAT(nombreResultat, recherche), { selector: 'p' })
    expect(textDuRésultat).toBeInTheDocument()
    const tuiles = screen.queryAllByRole('listitem')
    expect(tuiles).toHaveLength(12)
    const titreTuile = within(tuiles[0]).getByRole('heading', { level: 2, name: '010003598 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(titreTuile).toBeInTheDocument()
    const lienMédicoSocial = within(tuiles[0]).getByRole('link', { name: '010003598 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(lienMédicoSocial).toHaveAttribute('href', '/etablissement-territorial-medico-social/010003598')
    const lienSanitaire = within(tuiles[4]).getByRole('link', { name: '010005239 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(lienSanitaire).toHaveAttribute('href', '/etablissement-territorial-sanitaire/010005239')
    const lienEntitéJuridique = within(tuiles[8]).getByRole('link', { name: '010008407 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(lienEntitéJuridique).toHaveAttribute('href', '/entite-juridique/010008407')
    const départementCommuneTuile = within(tuiles[0]).getByText('Côtes d’Armor, Saint-Brieuc', { selector: 'p' })
    expect(départementCommuneTuile).toBeInTheDocument()
  })
})
