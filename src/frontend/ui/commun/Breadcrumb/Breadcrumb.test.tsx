import { screen, within } from '@testing-library/react'

import { EntitéJuridique } from '../../../../backend/métier/entities/EntitéJuridique'
import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../../../backend/métier/entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import PageDAccueil from '../../../../pages'
import Accessibilité from '../../../../pages/accessibilite'
import DonnéesPersonnelles from '../../../../pages/donnees-personnelles'
import GestionDesCookies from '../../../../pages/gestion-des-cookies'
import MentionsLégales from '../../../../pages/mentions-legales'
import PlanDuSite from '../../../../pages/plan-du-site'
import { fakeFrontDependencies, renderFakeComponent } from '../../../testHelper'
import { EntitéJuridiqueViewModel } from '../../entité-juridique/EntitéJuridiqueViewModel'
import { PageEntitéJuridique } from '../../entité-juridique/PageEntitéJuridique'
import { PageÉtablissementTerritorial } from '../../établissement-territorial/PageÉtablissementTerritorial'
import { ÉtablissementTerritorialViewModel } from '../../établissement-territorial/ÉtablissementTerritorialViewModel'
import { Breadcrumb } from './Breadcrumb'

const { paths, wording } = fakeFrontDependencies

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
    const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording)

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
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

  it('affiche le chemin jusqu’à la page établissement territorial', () => {
    // GIVEN
    const établissementTerritorial: ÉtablissementTerritorialMédicoSocialIdentité = {
      adresseAcheminement: '01130 NANTUA',
      adresseNuméroVoie : '50',
      adresseTypeVoie : 'R',
      adresseVoie : 'PAUL PAINLEVE',
      catégorieÉtablissement : '355',
      courriel : 'a@example.com',
      dateMiseAJourSource : '2021-07-07',
      estMonoÉtablissement: true,
      libelléCatégorieÉtablissement : 'Centre Hospitalier (C.H.)',
      numéroFinessEntitéJuridique : '010008407',
      numéroFinessÉtablissementPrincipal : '010000057',
      numéroFinessÉtablissementTerritorial: '010000040',
      raisonSociale : 'CH NANTUA',
      raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique : 'Société Anonyme (S.A.)',
      typeÉtablissement : 'S',
      téléphone : '0474754800',
    }
    const établissementTerritorialViewModel = new ÉtablissementTerritorialViewModel(établissementTerritorial, wording)

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorialViewModel} />
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
