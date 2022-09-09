import { fireEvent, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import mockRouter from 'next-router-mock'

import { RésultatDeRecherche } from '../../../backend/métier/entities/RésultatDeRecherche'
import { fakeFrontDependencies, htmlNodeAndReactChildMatcher, renderFakeComponent } from '../../testHelper'
import { régions } from '../région/régions'
import { PageRecherche } from './PageRecherche'

jest.mock('next/router', () => require('next-router-mock'))

const { paths, wording } = fakeFrontDependencies

describe('La page de recherche', () => {
  it('affiche un bandeau d’information mentionnant le développement du site', () => {
    // WHEN
    renderFakeComponent(<PageRecherche />)

    // THEN
    expect(screen.getByText(wording.SITE_EN_CONSTRUCTION, { selector: 'p' })).toBeInTheDocument()
  })

  it('affiche le formulaire', () => {
    // WHEN
    renderFakeComponent(<PageRecherche />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: wording.RECHERCHE_TITRE })
    expect(titre).toBeInTheDocument()
    const description = screen.getByText(htmlNodeAndReactChildMatcher(wording.RECHERCHE_DESCRIPTION), { selector: 'p' })
    expect(description).toBeInTheDocument()
    const formulaire = screen.getByRole('search')
    const label = within(formulaire).getByLabelText(wording.RECHERCHE_LABEL)
    expect(label).toBeInTheDocument()
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER)
    expect(input).toBeInTheDocument()
    const rechercher = within(formulaire).getByRole('button', { name: wording.RECHERCHE_LABEL })
    expect(rechercher).toBeInTheDocument()
  })

  it('affiche la cartographie', () => {
    // WHEN
    renderFakeComponent(<PageRecherche />)

    // THEN
    const cartographie = screen.getByLabelText(wording.CARTOGRAPHIE)
    const titre = within(cartographie).getByRole('heading', { level: 2, name: wording.CARTOGRAPHIE })
    expect(titre).toBeInTheDocument()
    const sousTitre = within(cartographie).getByRole('heading', { level: 3, name: wording.OFFRE_SANTÉ_PAR_REGION })
    expect(sousTitre).toBeInTheDocument()
    const description = within(cartographie).getByText(wording.CARTOGRAPHIE_DESCRIPTION, { selector: 'p' })
    expect(description).toBeInTheDocument()
    const listeRégions = within(cartographie).getAllByRole('listitem')
    const auvergneRhôneAlpes = within(listeRégions[0]).getByRole('link', { name: régions['auvergne-rhone-alpes'].label })
    expect(auvergneRhôneAlpes).toHaveAttribute('href', paths.RÉGION + '/auvergne-rhone-alpes')
    const occitanie = within(listeRégions[1]).getByRole('link', { name: régions['occitanie'].label })
    expect(occitanie).toHaveAttribute('href', paths.RÉGION + '/occitanie')
    const bretagne = within(listeRégions[2]).getByRole('link', { name: régions['bretagne'].label })
    expect(bretagne).toHaveAttribute('href', paths.RÉGION + '/bretagne')
    const paysDeLaLoire = within(listeRégions[3]).getByRole('link', { name: régions['pays-de-la-loire'].label })
    expect(paysDeLaLoire).toHaveAttribute('href', paths.RÉGION + '/pays-de-la-loire')
  })

  it('affiche les résultats après avoir cliqué sur le bouton "Rechercher"', async () => {
    // GIVEN
    const nombreDeRésultats = 3
    const résultats = [
      {
        commune: 'SAINT-BRIEUC',
        département: 'CÔTES D’ARMOR',
        numéroFiness: '010003598',
        raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
        type: 'Médico-social',
      },
      {
        commune: 'SAINT-BRIEUC',
        département: 'CÔTES D’ARMOR',
        numéroFiness: '010005239',
        raisonSociale: 'CENTRE HOSPITALIER DU HAUT BUGEY',
        type: 'Sanitaire',
      },
      {
        commune: 'SAINT-BRIEUC',
        département: 'CÔTES D’ARMOR',
        numéroFiness: '010008407',
        raisonSociale: 'CENTRE HOSPITALIER DE VILLENEUVE DASCQ',
        type: 'Entité Juridique',
      },
    ]
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve<RésultatDeRecherche>({
        nombreDeRésultats,
        résultats,
      }),
    })
    renderFakeComponent(<PageRecherche />)
    const terme = 'hospitalier'
    const formulaire = screen.getByRole('search')
    const rechercher = within(formulaire).getByRole('button', { name: wording.RECHERCHE_LABEL })
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER)
    fireEvent.change(input, { target: { value: terme } })

    // WHEN
    fireEvent.click(rechercher)

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: 'p' })
    expect(enAttente).toBeInTheDocument()
    await waitForElementToBeRemoved(enAttente)
    const résultatsDeRecherche = screen.getByLabelText(wording.RÉSULTAT_DE_RECHERCHE)
    const textDuRésultat = within(résultatsDeRecherche).getByText(wording.rechercheNombreRésultats(nombreDeRésultats, terme), { selector: 'p' })
    expect(textDuRésultat).toBeInTheDocument()
    const tuiles = within(résultatsDeRecherche).queryAllByRole('listitem')
    expect(tuiles).toHaveLength(3)
    const titreTuile = within(tuiles[0]).getByRole('heading', { level: 2, name: '010003598 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(titreTuile).toBeInTheDocument()
    const lienMédicoSocial = within(tuiles[0]).getByRole('link', { name: '010003598 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(lienMédicoSocial).toHaveAttribute('href', paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + '/' + résultats[0].numéroFiness)
    const lienSanitaire = within(tuiles[1]).getByRole('link', { name: '010005239 - CENTRE HOSPITALIER DU HAUT BUGEY' })
    expect(lienSanitaire).toHaveAttribute('href', paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + '/' + résultats[1].numéroFiness)
    const lienEntitéJuridique = within(tuiles[2]).getByRole('link', { name: '010008407 - CENTRE HOSPITALIER DE VILLENEUVE DASCQ' })
    expect(lienEntitéJuridique).toHaveAttribute('href', paths.ENTITÉ_JURIDIQUE + '/' + résultats[2].numéroFiness)
    const départementCommuneTuile = within(tuiles[0]).getByText('côtes d’armor, saint-brieuc', { selector: 'p' })
    expect(départementCommuneTuile).toBeInTheDocument()
  })

  it('affiche une phrase explicite si la recherche n’aboutit à aucun résultat', async () => {
    // GIVEN
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve<RésultatDeRecherche>({
        nombreDeRésultats: 0,
        résultats: [],
      }),
    })
    renderFakeComponent(<PageRecherche />)
    const terme = 'hospitalier'
    const formulaire = screen.getByRole('search')
    const rechercher = within(formulaire).getByRole('button', { name: wording.RECHERCHE_LABEL })
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER)
    fireEvent.change(input, { target: { value: terme } })

    // WHEN
    fireEvent.click(rechercher)

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: 'p' })
    expect(enAttente).toBeInTheDocument()
    await waitForElementToBeRemoved(enAttente)
    const textDuRésultat = screen.getByText(wording.aucunRésultat(terme), { selector: 'p' })
    expect(textDuRésultat).toBeInTheDocument()
  })

  it('affiche les résultats quand on recherche à partir du header', async () => {
    const terme = 'hospitalier'
    const router = mockRouter
    router.query = { terme }
    const nombreDeRésultats = 3
    const résultats = [
      {
        commune: 'SAINT-BRIEUC',
        département: 'CÔTES D’ARMOR',
        numéroFiness: '010003598',
        raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
        type: 'Médico-social',
      },
      {
        commune: 'SAINT-BRIEUC',
        département: 'CÔTES D’ARMOR',
        numéroFiness: '010005239',
        raisonSociale: 'CENTRE HOSPITALIER DU HAUT BUGEY',
        type: 'Sanitaire',
      },
      {
        commune: 'SAINT-BRIEUC',
        département: 'CÔTES D’ARMOR',
        numéroFiness: '010008407',
        raisonSociale: 'CENTRE HOSPITALIER DE VILLENEUVE DASCQ',
        type: 'Entité Juridique',
      },
    ]
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve<RésultatDeRecherche>({
        nombreDeRésultats,
        résultats,
      }),
    })

    // WHEN
    renderFakeComponent(<PageRecherche />)

    // THEN
    const formulaire = screen.getByRole('search')
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER)
    expect(input).toHaveAttribute('value', terme)
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: 'p' })
    expect(enAttente).toBeInTheDocument()
    await waitForElementToBeRemoved(enAttente)
    const résultatsDeRecherche = screen.getByLabelText(wording.RÉSULTAT_DE_RECHERCHE)
    const textDuRésultat = within(résultatsDeRecherche).getByText(wording.rechercheNombreRésultats(nombreDeRésultats, terme), { selector: 'p' })
    expect(textDuRésultat).toBeInTheDocument()
    const tuiles = within(résultatsDeRecherche).queryAllByRole('listitem')
    expect(tuiles).toHaveLength(3)
    const titreTuile = within(tuiles[0]).getByRole('heading', { level: 2, name: '010003598 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(titreTuile).toBeInTheDocument()
    const lienMédicoSocial = within(tuiles[0]).getByRole('link', { name: '010003598 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(lienMédicoSocial).toHaveAttribute('href', paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + '/' + résultats[0].numéroFiness)
    const lienSanitaire = within(tuiles[1]).getByRole('link', { name: '010005239 - CENTRE HOSPITALIER DU HAUT BUGEY' })
    expect(lienSanitaire).toHaveAttribute('href', paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + '/' + résultats[1].numéroFiness)
    const lienEntitéJuridique = within(tuiles[2]).getByRole('link', { name: '010008407 - CENTRE HOSPITALIER DE VILLENEUVE DASCQ' })
    expect(lienEntitéJuridique).toHaveAttribute('href', paths.ENTITÉ_JURIDIQUE + '/' + résultats[2].numéroFiness)
    const départementCommuneTuile = within(tuiles[0]).getByText('côtes d’armor, saint-brieuc', { selector: 'p' })
    expect(départementCommuneTuile).toBeInTheDocument()
  })
})
