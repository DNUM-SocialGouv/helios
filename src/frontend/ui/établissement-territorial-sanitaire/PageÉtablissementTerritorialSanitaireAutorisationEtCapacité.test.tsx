import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial sanitaire - bloc autorisation et capacité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  it.each([
    [wording.AUTORISATIONS, 'autorisations-sanitaire'],
    [wording.AUTRES_ACTIVITÉS, 'autres-activités-sanitaire'],
  ])('affiche le titre de la partie %s, sa source et l’accès aux détails', (nomDeLIndicateur: string, suffixeDeLInfoBulle: string) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = sélectionneLIndicateur(nomDeLIndicateur, indicateurs)
    const titre = within(autorisations).getByText(nomDeLIndicateur, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(autorisations).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 29/08/2022 - Source : ARHGOS, FINESS')
    const abréviationSourceFournisseur = within(autorisations).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const abréviationSourceOrigine = within(autorisations).getAllByText('ARHGOS', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaires')
    const détails = within(autorisations).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', `nom-info-bulle-${suffixeDeLInfoBulle}`)
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it.each([
    [wording.AUTORISATIONS],
    [wording.AUTRES_ACTIVITÉS],
  ])('a une infobulle avec le contenu relatif aux %s', (nomDeLIndicateur: string) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = sélectionneLIndicateur(nomDeLIndicateur, indicateurs)
    const détails = within(autorisations).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: nomDeLIndicateur })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
    const abréviationSourceFournisseur = within(infoBulle).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const abréviationSourceOrigine = within(infoBulle).getAllByText('ARHGOS', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaires')
    const élémentsDeCompréhension = within(infoBulle).getByRole('region', { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION })
    expect(élémentsDeCompréhension).toBeInTheDocument()
    const fréquence = within(infoBulle).getByRole('region', { name: wording.FRÉQUENCE })
    expect(fréquence).toBeInTheDocument()
    const sources = within(infoBulle).getByRole('region', { name: wording.SOURCES })
    expect(sources).toBeInTheDocument()
    const informationsComplémentaires = within(infoBulle).getByRole('region', { name: wording.INFOS_COMPLÉMENTAIRES })
    expect(informationsComplémentaires).toBeInTheDocument()
  })

  describe('L’indicateur des autorisations', () => {
    it('affiche un lien pour chaque activité de l’établissement', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs)
      expect(within(autorisations).getByRole('link', { name: 'Traitement de l\'insuffisance rénale chronique par épuration extrarénale [16]' })).toBeInTheDocument()
    })

    it('affiche un lien pour chaque modalité d’une activité', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs)
      expect(within(autorisations).getByRole('link', { name: 'Hémodialyse en unité médicalisée [42]' })).toBeInTheDocument()
    })

    it('affiche le libellé et le code de la forme, les dates et le numéro arhgos pour chacune des formes quand ces informations sont renseignées', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs)
      const informationsDUneAutorisation = within(autorisations).getAllByRole('list', { name: 'autorisations' })[0]
      expect(within(informationsDUneAutorisation).getByText('Pas de forme [00]', { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_D_AUTORISATION} : 11/10/2005`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_DE_FIN} : 03/05/2026`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_DE_MISE_EN_OEUVRE} : N/A`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutorisation).getByText(`${wording.NUMÉRO_ARHGOS} : 01-00-000`, { selector: 'li' })).toBeInTheDocument()
    })
  })

  describe('L’indicateur des autres activités', () => {
    it('affiche un lien pour chaque autre activité de l’établissement', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const autresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs)
      const activité1 = within(autresActivités).getByRole('link', { name: 'Installation de chirurgie esthétique [A0]' })
      expect(activité1).toHaveAttribute('aria-expanded', 'false')
      const activité2 = within(autresActivités).getByRole('link', { name: 'Dépôt de sang [A1]' })
      expect(activité2).toHaveAttribute('aria-expanded', 'false')
    })

    it('affiche un lien pour chaque modalité d’une autre activité', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const autresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs)
      const modalité1 = within(autresActivités).getByRole('link', { name: 'Dépôt relais [M2]' })
      expect(modalité1).toHaveAttribute('aria-expanded', 'false')
      const modalité2 = within(autresActivités).getByRole('link', { name: "Dépôt d'urgence [M0]" })
      expect(modalité2).toHaveAttribute('aria-expanded', 'false')
      const modalité3 = within(autresActivités).getByRole('link', { name: 'Multi-Organes [31]' })
      expect(modalité3).toHaveAttribute('aria-expanded', 'false')
    })

    it('affiche le libellé et le code de la forme et les dates pour chacune des formes quand ces informations sont renseignées', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const autresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs)
      const informationsDUneAutreActivité = within(autresActivités).getAllByRole('list', { name: 'autre-activité' })[0]
      expect(within(informationsDUneAutreActivité).getByText('Pas de forme [00]', { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_DE_MISE_EN_OEUVRE} : 03/06/2019`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_DE_FIN} : N/A`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_D_AUTORISATION} : 03/06/2019`, { selector: 'li' })).toBeInTheDocument()
    })
  })
})

function sélectionneLIndicateur(indicateur: string, éléments: HTMLElement[]): HTMLElement {
  switch (indicateur) {
    case wording.AUTRES_ACTIVITÉS:
      return éléments[9]
    default:
      return éléments[0]
  }
}
