import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial médico-social - bloc autorisation et capacité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  it('affiche le titre de la partie autres activités, sa source et l’accès aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autresActivités = indicateurs[0]
    const titre = within(autresActivités).getByText(wording.AUTRES_ACTIVITÉS, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(autresActivités).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 29/08/2022 - Source : ARHGOS, FINESS')
    const abréviationSourceFournisseur = within(autresActivités).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const abréviationSourceOrigine = within(autresActivités).getAllByText('ARHGOS', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaire ')
    const détails = within(autresActivités).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-autres-activités')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le contenu de l’info bulle des autres activités après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: wording.AUTRES_ACTIVITÉS })
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

  it('ferme l’info bulle des autres activités après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: wording.AUTRES_ACTIVITÉS })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche un lien pour chaque autre activité de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autresActivités = indicateurs[0]
    const activité1 = within(autresActivités).getByRole('link', { name: 'Installation de chirurgie esthétique [A0]' })
    expect(activité1).toHaveAttribute('aria-expanded', 'false')
    const activité2 = within(autresActivités).getByRole('link', { name: 'Dépôt de sang [A1]' })
    expect(activité2).toHaveAttribute('aria-expanded', 'false')
  })

  it('affiche un lien pour chaque modalité d’une activité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autresActivités = indicateurs[0]
    const modalité1 = within(autresActivités).getByRole('link', { name: 'Dépôt relais [M2]' })
    expect(modalité1).toHaveAttribute('aria-expanded', 'false')
    const modalité2 = within(autresActivités).getByRole('link', { name: "Dépôt d'urgence [M0]" })
    expect(modalité2).toHaveAttribute('aria-expanded', 'false')
    const modalité3 = within(autresActivités).getByRole('link', { name: 'Multi-Organes [31]' })
    expect(modalité3).toHaveAttribute('aria-expanded', 'false')
  })

  it('affiche le titre et les dates pour chaque forme quand ces informations sont renseignées', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    const informationsDUneAutreActivité = within(autorisations).getAllByRole('list', { name: 'autre-activité' })[0]
    expect(within(informationsDUneAutreActivité).getByText('Pas de forme [00]', { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutreActivité).getByText('Date de mise en oeuvre : 03/06/2019', { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutreActivité).getByText('Date de fin : N/A', { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_D_AUTORISATION} : 03/06/2019`, { selector: 'li' })).toBeInTheDocument()
  })
})
