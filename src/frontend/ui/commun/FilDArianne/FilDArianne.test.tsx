import { screen, within } from '@testing-library/react'

import { renderFakeComponent } from '../../../../../tests/testHelper'
import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import DonnéesPersonnelles from '../../../../pages/donnees-personnelles'
import PageEntite from '../../../../pages/entite'
import GestionDesCookies from '../../../../pages/gestion-des-cookies'
import MentionsLégales from '../../../../pages/mentions-legales'
import PlanDuSite from '../../../../pages/plan-du-site'
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

  it.each(
    [
      Accessibilité,
      MentionsLégales,
      DonnéesPersonnelles,
      GestionDesCookies,
      PlanDuSite,
      PageEntite,
    ]
  )('affiche le chemin jusqu’à la page courante', (Page) => {
    // WHEN
    renderFakeComponent(
      <>
        <FilDArianne />
        <Page />
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
