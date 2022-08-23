import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial médico-social - bloc autorisation et capacité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)

  it('affiche le titre de la partie autorisations, sa source et l’accès aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    const titre = within(autorisations).getByText(wording.AUTORISATIONS, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(autorisations).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 18/08/2022 - Source : ARHGOS, FINESS')
    const abréviationSourceFournisseur = within(autorisations).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const abréviationSourceOrigine = within(autorisations).getAllByText('ARHGOS', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaire ')
    const détails = within(autorisations).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-autorisations')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: wording.AUTORISATIONS })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
    const abréviationSourceFournisseur = within(infoBulle).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const abréviationSourceOrigine = within(infoBulle).getAllByText('ARHGOS', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaire ')
    const élémentsDeCompréhension = within(infoBulle).getByRole('region', { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION })
    expect(élémentsDeCompréhension).toBeInTheDocument()
    const fréquence = within(infoBulle).getByRole('region', { name: wording.FRÉQUENCE })
    expect(fréquence).toBeInTheDocument()
    const sources = within(infoBulle).getByRole('region', { name: wording.SOURCES })
    expect(sources).toBeInTheDocument()
    const informationsComplémentaires = within(infoBulle).getByRole('region', { name: wording.INFOS_COMPLÉMENTAIRES })
    expect(informationsComplémentaires).toBeInTheDocument()
  })

  it('ferme l’info bulle après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: wording.AUTORISATIONS })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche un lien pour chaque disciplines de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    const discipline1 = within(autorisations).getByRole('link', { name: 'Accueil temporaire pour Personnes Âgées [657]' })
    expect(discipline1).toHaveAttribute('aria-expanded', 'false')
    const discipline2 = within(autorisations).getByRole('link', { name: 'Accueil temporaire pour adultes handicapés [658]' })
    expect(discipline2).toHaveAttribute('aria-expanded', 'false')
  })

  it('affiche un lien pour chaque activités d’une discipline', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    const activité1 = within(autorisations).getByRole('link', { name: 'Hébergement Complet Internat [11]' })
    expect(activité1).toHaveAttribute('aria-expanded', 'false')
    const activité2 = within(autorisations).getByRole('link', { name: 'Prestation en milieu ordinaire [16]' })
    expect(activité2).toHaveAttribute('aria-expanded', 'false')
    const activité3 = within(autorisations).getByRole('link', { name: 'Accueil de Jour [21]' })
    expect(activité3).toHaveAttribute('aria-expanded', 'false')
  })

  it('affiche le titre, les dates et les capacités pour chaque clientèle quand ces informations sont renseignées', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    const informationsDUneAutorisation = within(autorisations).getAllByRole('list', { name: 'dates-et-capacités' })[0]
    expect(within(informationsDUneAutorisation).getByText('PH vieillissantes [702]', { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_D_AUTORISATION} : 01/01/2020`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.MISE_À_JOUR_AUTORISATION} : 01/01/2020`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DERNIÈRE_INSTALLATION} : N/A`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.CAPACITÉ_AUTORISÉE} : 10`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.CAPACITÉ_INSTALLÉE} : N/A`, { selector: 'li' })).toBeInTheDocument()
  })
})
