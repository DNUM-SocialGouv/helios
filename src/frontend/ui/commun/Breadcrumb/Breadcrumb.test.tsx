import { screen, within } from '@testing-library/react'

import { EntitéJuridique } from '../../../../backend/métier/entities/EntitéJuridique'
import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import DonnéesPersonnelles from '../../../../pages/donnees-personnelles'
import GestionDesCookies from '../../../../pages/gestion-des-cookies'
import MentionsLégales from '../../../../pages/mentions-legales'
import PlanDuSite from '../../../../pages/plan-du-site'
import { renderFakeComponent } from '../../../testHelper'
import { PageEntitéJuridique } from '../../entité-juridique/PageEntitéJuridique'
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

  it('affiche le chemin jusqu’à la page entité juridique', () => {
    // GIVEN
    const entitéJuridique: EntitéJuridique = {
      adresseAcheminement: '22023 ST BRIEUC CEDEX 1',
      adresseNuméroVoie: '10',
      adresseTypeVoie: 'Rue',
      adresseVoie: 'Marcel Proust',
      dateMiseAJourSource: '2021-07-07',
      libelléStatutJuridique: 'Public',
      numéroFinessEntitéJuridique: '220000020',
      raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
      téléphone: '0123456789',
    }

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridique} />
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
