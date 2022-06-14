import { screen, within } from '@testing-library/react'

import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import DonnéesPersonnelles from '../../../../pages/donnees-personnelles'
import GestionDesCookies from '../../../../pages/gestion-des-cookies'
import MentionsLégales from '../../../../pages/mentions-legales'
import PlanDuSite from '../../../../pages/plan-du-site'
import { EntitéJuridiqueViewModelTestFactory } from '../../../test-factories/EntitéJuridiqueViewModelTestFactory'
import { ÉtablissementTerritorialMédicoSocialViewModelTestFactory } from '../../../test-factories/ÉtablissementTerritorialMédicoSocialViewModelTestFactory'
import { ÉtablissementTerritorialRattachéViewModelTestFactory } from '../../../test-factories/ÉtablissementTerritorialRattachéViewModelTestFactory'
import { ÉtablissementTerritorialSanitaireViewModelTestFactory } from '../../../test-factories/ÉtablissementTerritorialSanitaireViewModelTestFactory'
import { fakeFrontDependencies, renderFakeComponent } from '../../../testHelper'
import { ÉtablissementTerritorialRattachéViewModel } from '../../entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from '../../entité-juridique/PageEntitéJuridique'
import { PageÉtablissementTerritorialMédicoSocial } from '../../établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial'
import { PageÉtablissementTerritorialSanitaire } from '../../établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire'
import { Breadcrumb } from './Breadcrumb'

const { paths, wording } = fakeFrontDependencies

describe('Le fil d’Ariane (breadcrumb)', () => {
  it('ne s’affiche pas sur la page d’accueil', () => {
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
      [Accessibilité, wording.ACCESSIBILITÉ],
      [MentionsLégales, wording.MENTIONS_LÉGALES],
      [DonnéesPersonnelles, wording.DONNÉES_PERSONNELLES],
      [GestionDesCookies, wording.GESTION_COOKIES],
      [PlanDuSite, wording.PLAN_DU_SITE],
    ]
  )('affiche le chemin jusqu’à la page courante', (Page, expected) => {
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
    const accueil = within(levels[0]).getByText(wording.ACCUEIL)
    expect(accueil).toHaveAttribute('href', '/')
    expect(within(levels[1]).queryByRole('link')).not.toBeInTheDocument()
    const breadCrumbText = within(levels[1]).getByText(expected)
    expect(breadCrumbText).toBeInTheDocument()
  })

  it('affiche le chemin jusqu’à la page entité juridique', () => {
    // GIVEN
    const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestFactory.créeEntitéJuridiqueViewModel(wording)
    const établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[] = [
      ÉtablissementTerritorialRattachéViewModelTestFactory.créeÉtablissementTerritorialRattaché(wording),
      ÉtablissementTerritorialRattachéViewModelTestFactory.créeAutreÉtablissementTerritorialRattaché(wording),
    ]

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageEntitéJuridique
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </>
    )

    // THEN
    const breadcrumb = screen.getByRole('navigation')
    const levels = within(breadcrumb).getAllByRole('listitem')
    expect(levels).toHaveLength(2)
    expect(within(levels[0]).getByRole('link')).toBeInTheDocument()
    const accueil = within(levels[0]).getByText(wording.ACCUEIL)
    expect(accueil).toHaveAttribute('href', '/')
    expect(within(levels[1]).queryByRole('link')).not.toBeInTheDocument()
    const abréviationEj = within(levels[1]).getByText('EJ', { selector: 'abbr' })
    expect(abréviationEj).toHaveAttribute('title', 'Entité juridique')
    expect(within(levels[1]).getByText('- 220 000 020 - CENTRE HOSPITALIER DE SAINT BRIEUC')).toBeInTheDocument()
  })

  it('affiche le chemin jusqu’à la page établissement territorial médico-social', () => {
    // GIVEN
    const établissementTerritorialMédicoSocialViewModel =
        ÉtablissementTerritorialMédicoSocialViewModelTestFactory.créeÉtablissementTerritorialViewModel(wording)

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocialViewModel} />
      </>
    )

    // THEN
    const breadcrumb = screen.getByRole('navigation')
    const levels = within(breadcrumb).getAllByRole('listitem')
    expect(levels).toHaveLength(3)
    expect(within(levels[0]).getByRole('link')).toBeInTheDocument()
    const accueil = within(levels[0]).getByText(wording.ACCUEIL)
    expect(accueil).toHaveAttribute('href', '/')
    const lienEntitéJuridique = within(levels[1]).getByRole('link')
    expect(lienEntitéJuridique).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/010008407`)
    const abréviationEj = within(levels[1]).getByText('EJ', { selector: 'abbr' })
    expect(abréviationEj).toHaveAttribute('title', 'Entité juridique')
    expect(within(levels[1]).getByText('- 010 008 407 - CH DU HAUT BUGEY')).toBeInTheDocument()
    expect(within(levels[2]).queryByRole('link')).not.toBeInTheDocument()
    expect(within(levels[2]).getByText('IFAS CH DU HAUT BUGEY')).toBeInTheDocument()
  })

  it('affiche le chemin jusqu’à la page établissement territorial sanitaire', () => {
    // GIVEN
    const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestFactory.créeÉtablissementTerritorialViewModel(wording)

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaireViewModel} />
      </>
    )

    // THEN
    const breadcrumb = screen.getByRole('navigation')
    const levels = within(breadcrumb).getAllByRole('listitem')
    expect(levels).toHaveLength(3)
    expect(within(levels[0]).getByRole('link')).toBeInTheDocument()
    const accueil = within(levels[0]).getByText(wording.ACCUEIL)
    expect(accueil).toHaveAttribute('href', '/')
    const lienEntitéJuridique = within(levels[1]).getByRole('link')
    expect(lienEntitéJuridique).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/010008407`)
    const abréviationEj = within(levels[1]).getByText('EJ', { selector: 'abbr' })
    expect(abréviationEj).toHaveAttribute('title', 'Entité juridique')
    expect(within(levels[1]).getByText('- 010 008 407 - HOPITAL PRIVE DE VILLENEUVE DASCQ')).toBeInTheDocument()
    expect(within(levels[2]).queryByRole('link')).not.toBeInTheDocument()
    expect(within(levels[2]).getByText('CH NANTUA')).toBeInTheDocument()
  })
})
