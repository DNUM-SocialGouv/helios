import { screen } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../../../../tests/testHelper'
import { Header } from './Header'

const { paths, wording } = fakeFrontDependencies

describe('En-tête de page', () => {
  it('affiche un lien pour accéder à la page d’accueil', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    const accueil = screen.getByRole('link', { name: wording.ACCUEIL })
    expect(accueil).toHaveAttribute('href', paths.ACCUEIL)
  })

  it('affiche un menu en mobile pour afficher la déconnexion', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    const menu = screen.getByRole('button', { name: wording.MENU })
    expect(menu).toHaveAttribute('title', wording.MENU)
    const fermer = screen.getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
  })

  it('affiche un lien pour se déconnecter', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    const déconnexion = screen.getByRole('link', { name: wording.DÉCONNEXION })
    expect(déconnexion).toBeInTheDocument()
  })
})
