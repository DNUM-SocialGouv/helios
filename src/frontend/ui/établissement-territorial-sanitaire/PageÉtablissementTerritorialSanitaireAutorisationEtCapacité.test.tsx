import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial sanitaire - bloc autorisation et capacité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  it('affiche le titre de la partie autorisations, sa source et l’accès aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

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
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-autorisations-sanitiare')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('a une infobulle avec le contenu relatif aux autorisations', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

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

  it('affiche un lien pour chaque activité de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    expect(within(autorisations).getByRole('link', { name: 'Traitement de l\'insuffisance rénale chronique par épuration extrarénale [16]' })).toBeInTheDocument()
  })

  it('affiche un lien pour chaque modalité d’une activité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    expect(within(autorisations).getByRole('link', { name: 'Hémodialyse en unité médicalisée [16]' })).toBeInTheDocument()
  })

  it('affiche le libellé et le code de la forme, les dates et le numéro arhgos pour chacune des formes quand ces informations sont renseignées', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[0]
    const informationsDUneAutorisation = within(autorisations).getAllByRole('list', { name: 'autorisations' })[0]
    expect(within(informationsDUneAutorisation).getByText('Pas de forme [00]', { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_D_AUTORISATION} : 11/10/2005`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_DE_FIN} : 03/05/2026`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_DE_MISE_EN_OEUVRE} : N/A`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.NUMÉRO_ARHGOS} : 01-00-000`, { selector: 'li' })).toBeInTheDocument()
  })
})
