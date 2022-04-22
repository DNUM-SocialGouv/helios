import { screen, within } from '@testing-library/react'

import { renderFakeComponent } from '../../../../../tests/testHelper'
import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import { FilDArianne } from './FilDArianne'

describe('Le fil d’Arianne', () => {
  it('n’est pas affiché sur la page d’accueil', () => {
    // WHEN
    renderFakeComponent(
      <>
        <FilDArianne />
        <PageDAccueil />
      </>
    )

    // THEN
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('affiche le chemin jusqu’à la page courante', () => {
    // WHEN
    renderFakeComponent(
      <>
        <FilDArianne />
        <Accessibilité />
      </>
    )

    // THEN
    const filDArianne = screen.getByRole('navigation')
    const niveaux = within(filDArianne).getAllByRole('listitem')
    expect(niveaux).toHaveLength(2)
    expect(within(niveaux[0]).getByRole('link')).toBeInTheDocument()
    expect(within(niveaux[1]).queryByRole('link')).not.toBeInTheDocument()
  })
})
