import { screen, within } from '@testing-library/react'

import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import DonnéesPersonnelles from '../../../../pages/donnees-personnelles'
import GestionDesCookies from '../../../../pages/gestion-des-cookies'
import MentionsLégales from '../../../../pages/mentions-legales'
import PlanDuSite from '../../../../pages/plan-du-site'
import { renderFakeComponent } from '../../../testHelper'
import { PageEntitéJuridique } from '../../entite/PageEntitéJuridique'
import { Breadcrumb } from './Breadcrumb'

describe('Le fil d’Ariane (breadcrumb)', () => {
  it('n’est pas affiché sur la page d’accueil', () => {
    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
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
      PageEntitéJuridique,
    ]
  )('affiche le chemin jusqu’à la page courante', (Page) => {
    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <Page />
      </>
    )

    // THEN
    const breadcrumb = screen.getByRole('navigation')
    const levels = within(breadcrumb).getAllByRole('listitem')
    expect(levels).toHaveLength(2)
    expect(within(levels[0]).getByRole('link')).toBeInTheDocument()
    expect(within(levels[1]).queryByRole('link')).not.toBeInTheDocument()
  })
})
