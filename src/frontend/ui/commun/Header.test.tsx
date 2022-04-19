import { screen } from '@testing-library/react'

import { fakeFrontDependenciesContainer, renderFakeComponent } from '../../../../tests/testHelper'

import { Header } from './Header'

const { wording } = fakeFrontDependenciesContainer

describe('En-tête de page', () => {
  it('affiche l’intitulé du ministère', () => {
    // WHEN
    renderFakeComponent(<Header />)

    // THEN
    expect(screen.getByText(wording.INTITULÉ_DU_MINISTÈRE_SOCIAL)).toBeInTheDocument()
  })
})
