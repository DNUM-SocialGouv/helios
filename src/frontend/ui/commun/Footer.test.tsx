import { screen } from '@testing-library/react'

import { fakeFrontDependenciesContainer, renderFakeComponent } from '../../../../tests/testHelper'

import { Footer } from './Footer'

const { paths, wording } = fakeFrontDependenciesContainer

describe('Le pied de page', () => {
  it('permet d’accéder à la page d’accueil', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const accueil = screen.getByRole('link', { name: wording.ACCÉDER_À_L_ACCUEIL })
    expect(accueil).toBeInTheDocument()
  })

  it('permet d’accéder au plan du site', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const planeDuSite = screen.getByRole('link', { name: wording.PLAN_DU_SITE })
    expect(planeDuSite).toHaveAttribute('href', paths.PLAN_DU_SITE)
  })

  it('permet d’accéder à la page d’informations sur l’accessibilité', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const accessibilité = screen.getByRole('link', { name: wording.ACCESSIBILITÉ })
    expect(accessibilité).toHaveAttribute('href', paths.ACCESSIBILITÉ)
  })

  it('permet d’accéder aux mentions légales', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const mentionsLégales = screen.getByRole('link', { name: wording.MENTIONS_LÉGALES })
    expect(mentionsLégales).toHaveAttribute('href', paths.MENTIONS_LÉGALES)
  })

  it('permet d’accéder à la page d’informations relatives aux données personnelles', () => {
  // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const donnéesPersonnelles = screen.getByRole('link', { name: wording.DONNÉES_PERSONNELLES })
    expect(donnéesPersonnelles).toHaveAttribute('href', paths.DONNÉES_PERSONNELLES)
  })

  it('permet d’accéder à la page d’informations relatives à la gestion des cookies', () => {
    // WHEN
    renderFakeComponent(<Footer />)

    // THEN
    const gestionDesCookies = screen.getByRole('link', { name: wording.GESTION_COOKIES })
    expect(gestionDesCookies).toHaveAttribute('href', paths.GESTION_COOKIES)
  })
})
