import { screen } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../../testHelper'
import { Footer } from './Footer'

const { paths, wording } = fakeFrontDependencies

describe('Le pied de page', () => {
  it('affiche un lien pour accéder à la page d’accueil', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const accueil = screen.getByRole('link', { name: wording.ACCUEIL })
    expect(accueil).toHaveAttribute('href', paths.ACCUEIL)
  })

  it('affiche une présentation de trois lignes', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const presentation = screen.getByText(wording.PRESENTATION)
    expect(presentation).toBeInTheDocument()
  })

  it('affiche des liens externes pour accéder à legigrance.gouv.fr, gouvernement.fr, service-public.fr et data.gouv.fr', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const legifrance = screen.getByText(wording.LEGIFRANCE)
    expect(legifrance).toHaveAttribute('href', 'https://legifrance.gouv.fr')
    expect(legifrance).toHaveAttribute('rel', 'external noopener noreferrer')
    expect(legifrance).toHaveAttribute('target', '_blank')

    const gouvernement = screen.getByText(wording.GOUVERNEMENT)
    expect(gouvernement).toHaveAttribute('href', 'https://gouvernement.fr')
    expect(gouvernement).toHaveAttribute('rel', 'external noopener noreferrer')
    expect(gouvernement).toHaveAttribute('target', '_blank')

    const servicePublic = screen.getByText(wording.SERVICE_PUBLIC)
    expect(servicePublic).toHaveAttribute('href', 'https://service-public.fr')
    expect(servicePublic).toHaveAttribute('rel', 'external noopener noreferrer')
    expect(servicePublic).toHaveAttribute('target', '_blank')

    const dataGouv = screen.getByText(wording.DATA_GOUV)
    expect(dataGouv).toHaveAttribute('href', 'https://data.gouv.fr')
    expect(dataGouv).toHaveAttribute('rel', 'external noopener noreferrer')
    expect(dataGouv).toHaveAttribute('target', '_blank')
  })

  it('affiche un lien pour accéder au plan du site', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const planeDuSite = screen.getByRole('link', { name: wording.PLAN_DU_SITE })
    expect(planeDuSite).toHaveAttribute('href', paths.PLAN_DU_SITE)
  })

  it('affiche un lien pour accéder à la page d’informations sur l’accessibilité', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const accessibilité = screen.getByRole('link', { name: wording.ACCESSIBILITÉ })
    expect(accessibilité).toHaveAttribute('href', paths.ACCESSIBILITÉ)
  })

  it('affiche un lien pour accéder aux mentions légales', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const mentionsLégales = screen.getByRole('link', { name: wording.MENTIONS_LÉGALES })
    expect(mentionsLégales).toHaveAttribute('href', paths.MENTIONS_LÉGALES)
  })

  it('affiche un lien pour accéder à la page d’informations relatives aux données personnelles', () => {
  // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const donnéesPersonnelles = screen.getByRole('link', { name: wording.DONNÉES_PERSONNELLES })
    expect(donnéesPersonnelles).toHaveAttribute('href', paths.DONNÉES_PERSONNELLES)
  })

  it('affiche un lien pour accéder à la page d’informations relatives à la gestion des cookies', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const gestionDesCookies = screen.getByRole('link', { name: wording.GESTION_COOKIES })
    expect(gestionDesCookies).toHaveAttribute('href', paths.GESTION_COOKIES)
  })
})
