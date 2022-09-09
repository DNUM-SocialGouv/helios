import { screen, within } from '@testing-library/react'

import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import DonnéesPersonnelles from '../../../../pages/donnees-personnelles'
import MentionsLégales from '../../../../pages/mentions-legales'
import { EntitéJuridiqueViewModelTestBuilder } from '../../../test-builder/EntitéJuridiqueViewModelTestBuilder'
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { ÉtablissementTerritorialRattachéViewModelTestBuilder } from '../../../test-builder/ÉtablissementTerritorialRattachéViewModelTestBuilder'
import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../../testHelper'
import { ÉtablissementTerritorialRattachéViewModel } from '../../entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from '../../entité-juridique/PageEntitéJuridique'
import { PageRégion } from '../../région/PageRégion'
import { régions } from '../../région/régions'
import { PageÉtablissementTerritorialMédicoSocial } from '../../établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial'
import { PageÉtablissementTerritorialSanitaire } from '../../établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire'
import { Breadcrumb } from './Breadcrumb'

jest.mock('next/router', () => require('next-router-mock'))
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
    const breadcrumbText = within(levels[1]).getByText(expected)
    expect(breadcrumbText).toBeInTheDocument()
  })

  it('affiche le chemin jusqu’à la page entité juridique', () => {
    // GIVEN
    const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestBuilder.crée(wording)
    const établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[] = [
      ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialRattaché(wording),
      ÉtablissementTerritorialRattachéViewModelTestBuilder.créeAutreÉtablissementTerritorialRattaché(wording),
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
      ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)

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
    const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

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

  it('affiche le chemin jusqu’à la page d’une région', () => {
    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageRégion région="bretagne" />
      </>
    )

    // THEN
    const breadcrumb = screen.getByRole('navigation')
    const levels = within(breadcrumb).getAllByRole('listitem')
    expect(levels).toHaveLength(2)
    expect(within(levels[0]).getByRole('link')).toBeInTheDocument()
    const accueil = within(levels[0]).getByText(wording.ACCUEIL)
    expect(accueil).toHaveAttribute('href', '/')
    const région = within(levels[1]).getByText(wording.régionBreadcrumb(régions['bretagne'].label))
    expect(région).toBeInTheDocument()
  })
})
