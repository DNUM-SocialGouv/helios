import { screen } from '@testing-library/react'

import { fakeFrontDependenciesContainer, renderFakeComponent } from '../../../../tests/testHelper'

import { Footer } from './Footer'

const { wording } = fakeFrontDependenciesContainer

describe('Le pied de page', () => {
  it('permet d’accéder à la page d’accueil', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const accueil = screen.getByRole('link', { name: wording.ACCÉDER_À_L_ACCUEIL })
    expect(accueil).toBeInTheDocument()
  })
})
