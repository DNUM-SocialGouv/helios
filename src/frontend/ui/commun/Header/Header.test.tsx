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

  it('affiche un lien pour se déconnecter', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    const déconnexion = screen.getByRole('link', { name: wording.DÉCONNEXION })
    expect(déconnexion).toBeInTheDocument()
  })
})
