import { screen } from '@testing-library/react'

import { fakeFrontDependenciesContainer, renderFakeComponent } from '../../../../tests/testHelper'

import { Header } from './Header'

const { wording } = fakeFrontDependenciesContainer

describe('En-tête de page', () => {

  it('permet d’accéder à la page d’accueil', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    const accueil = screen.getByRole('link', { name: wording.ACCÉDER_À_L_ACCUEIL })
    expect(accueil).toBeInTheDocument()
  })

  it('permet de se déconnecter', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    const déconnexion = screen.getByRole('link', { name: wording.DÉCONNEXION })
    expect(déconnexion).toBeInTheDocument()
  })
})
