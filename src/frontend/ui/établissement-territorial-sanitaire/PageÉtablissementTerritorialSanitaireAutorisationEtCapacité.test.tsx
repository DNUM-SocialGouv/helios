import { fireEvent, screen, within } from '@testing-library/react'

import { numéroFinessÉtablissementTerritorial } from '../../../backend/testHelper'
import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial sanitaire - bloc autorisation et capacité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  describe('L’indicateur de la capacité par activités', () => {
    it('affiche les informations de l’indicateur "Capacité par activités"', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const capacitéParActivités = indicateurs[0]
      const titre = within(capacitéParActivités).getByText(wording.CAPACITÉ_PAR_ACTIVITÉS, { selector: 'p' })
      expect(titre).toBeInTheDocument()
      const dateMiseAJour = within(capacitéParActivités).getAllByText('Mise à jour', { exact: false, selector: 'p' })
      expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 07/07/2021 - Source : SAE, DIAMANT')
      const transcription = within(capacitéParActivités).getByText(wording.AFFICHER_LA_TRANSCRIPTION)
      expect(transcription).toHaveAttribute('aria-expanded', 'false')
      expect(transcription).not.toBeDisabled()
      const abréviationSourceFournisseur = within(capacitéParActivités).getAllByText('DIAMANT', { selector: 'abbr' })
      expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
      const abréviationSourceOrigine = within(capacitéParActivités).getAllByText('SAE', { selector: 'abbr' })
      expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Statistique Annuelle des Établissements de santé')
      const détails = within(capacitéParActivités).getByRole('button', { name: wording.DÉTAILS })
      expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-capacite-sanitaire')
      expect(détails).toHaveAttribute('data-fr-opened', 'false')
    })

    it('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (Capacité par activités)', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })

      // WHEN
      fireEvent.click(détails)

      // THEN
      expect(détails).toHaveAttribute('data-fr-opened', 'true')
      const infoBulle = screen.getByRole('dialog', { name: wording.CAPACITÉ_PAR_ACTIVITÉS })
      const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
      expect(fermer).toBeInTheDocument()
      const abréviationSourceFournisseur = within(infoBulle).getAllByText('DIAMANT', { selector: 'abbr' })
      expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
      const abréviationSourceOrigine = within(infoBulle).getAllByText('SAE', { selector: 'abbr' })
      expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Statistique Annuelle des Établissements de santé')
      const élémentsDeCompréhension = within(infoBulle).getByRole('region', { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION })
      expect(élémentsDeCompréhension).toBeInTheDocument()
      const fréquence = within(infoBulle).getByRole('region', { name: wording.FRÉQUENCE })
      expect(fréquence).toBeInTheDocument()
      const modeDeCalcul = within(infoBulle).getByRole('region', { name: wording.MODE_DE_CALCUL })
      expect(modeDeCalcul).toBeInTheDocument()
      const sources = within(infoBulle).getByRole('region', { name: wording.SOURCES })
      expect(sources).toBeInTheDocument()
      const informationsComplémentaires = within(infoBulle).getByRole('region', { name: wording.INFOS_COMPLÉMENTAIRES })
      expect(informationsComplémentaires).toBeInTheDocument()
    })

    it('ferme l’info bulle après avoir cliqué sur le bouton "Fermer" (Capacité par activités)', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
      fireEvent.click(détails)
      const infoBulle = screen.getByRole('dialog', { name: wording.CAPACITÉ_PAR_ACTIVITÉS })
      const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

      // WHEN
      fireEvent.click(fermer)

      // THEN
      expect(détails).toHaveAttribute('data-fr-opened', 'false')
    })

    it('affiche un tableau descriptif avec les toutes les activités', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const tableau = within(indicateurs[0]).getByRole('table')

      const libellésLigneDEnTête = [wording.ACTIVITÉS, wording.LITS, wording.PLACES]
      libellésLigneDEnTête.forEach((libellé) => {
        const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: libellé })
        expect(indicateurLigneDEnTête).toBeInTheDocument()
      })

      const capacitésEtValeurs = [
        {
          capacité: wording.CHIRURGIE,
          index: 1,
          valeur: ['10', '20'],
        },
        {
          capacité: wording.MÉDECINE,
          index: 2,
          valeur: ['20', '50'],
        },
        {
          capacité: wording.OBSTÉTRIQUE,
          index: 3,
          valeur: ['5', '6'],
        },
        {
          capacité: wording.PSYCHIATRIE,
          index: 4,
          valeur: ['5', '13'],
        },
        {
          capacité: wording.SSR,
          index: 5,
          valeur: ['2', '7'],
        },
        {
          capacité: wording.USLD,
          index: 6,
          valeur: ['15', '0'],
        },
      ]
      const lignes = within(tableau).getAllByRole('row')
      capacitésEtValeurs.forEach((capacitéEtValeur) => {
        const capacité = within(lignes[capacitéEtValeur.index]).getByRole('cell', { name : capacitéEtValeur.capacité.trimEnd() })
        expect(capacité).toBeInTheDocument()
        const valeurLit = within(lignes[capacitéEtValeur.index]).getByRole('cell', { name: capacitéEtValeur.valeur[0] })
        expect(valeurLit).toBeInTheDocument()
        const valeurPlace = within(lignes[capacitéEtValeur.index]).getByRole('cell', { name: capacitéEtValeur.valeur[1] })
        expect(valeurPlace).toBeInTheDocument()
      })
    })

    it('n’affiche pas l’indicateur quand sa valeur est vide (Capacité par activités)', () => {
      const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
        activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
        autorisationsEtCapacités: {
          autorisations: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autorisations,
          autresActivités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autresActivités,
          capacités: {
            dateMiseÀJourSource: '2022-09-02',
            nombreDeLitsEnChirurgie: null,
            nombreDeLitsEnMédecine: null,
            nombreDeLitsEnObstétrique: null,
            nombreDeLitsEnSsr: null,
            nombreDeLitsEnUsld: null,
            nombreDeLitsOuPlacesEnPsyHospitalisationComplète: null,
            nombreDePlacesEnChirurgie: null,
            nombreDePlacesEnMédecine: null,
            nombreDePlacesEnObstétrique: null,
            nombreDePlacesEnPsyHospitalisationPartielle: null,
            nombreDePlacesEnSsr: null,
          },
          numéroFinessÉtablissementTerritorial: '123456789',
          reconnaissancesContractuelles: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.reconnaissancesContractuelles,
          équipementsMatérielsLourds: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.équipementsMatérielsLourds,
        },
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateursAutorisationsEtCapacités = within(autorisationEtCapacité).getAllByRole('list')[0]
      const titreCapacitéParActivité = within(indicateursAutorisationsEtCapacités).queryByText(wording.CAPACITÉ_PAR_ACTIVITÉS, { selector: 'p' })
      expect(titreCapacitéParActivité).not.toBeInTheDocument()
    })

    it('n’affiche pas les capacités lorsque celles-ci ne sont pas renseignées', () => {
      const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
        activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
        autorisationsEtCapacités: {
          autorisations: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autorisations,
          autresActivités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autresActivités,
          capacités: null,
          numéroFinessÉtablissementTerritorial: '123456789',
          reconnaissancesContractuelles: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.reconnaissancesContractuelles,
          équipementsMatérielsLourds: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.équipementsMatérielsLourds,
        },
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      }, wording, paths)

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateursAutorisationsEtCapacités = within(autorisationEtCapacité).getAllByRole('list')[0]
      const titreCapacitéParActivité = within(indicateursAutorisationsEtCapacités).queryByText(wording.CAPACITÉ_PAR_ACTIVITÉS, { selector: 'p' })
      expect(titreCapacitéParActivité).not.toBeInTheDocument()
    })
  })

  it.each([
    [wording.AUTORISATIONS, 'autorisations-sanitaire'],
    [wording.AUTRES_ACTIVITÉS, 'autres-activités-sanitaire'],
    [wording.RECONNAISSANCES_CONTRACTUELLES, 'reconnaissances-contractuelles-sanitaire'],
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
    [wording.RECONNAISSANCES_CONTRACTUELLES],
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

  it.each([
    [wording.AUTORISATIONS, 'autorisations'],
    [wording.AUTRES_ACTIVITÉS, 'autresActivités'],
    [wording.RECONNAISSANCES_CONTRACTUELLES, 'reconnaissancesContractuelles'],
  ])('n’affiche pas l’indicateur si l’établissement n’a pas de %s', (nomDeLIndicateur: string, champDeLaDonnéeVide: string) => {
    // GIVEN
    const établissementTerritorialSansAutorisations = new ÉtablissementTerritorialSanitaireViewModel({
      activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
      autorisationsEtCapacités: {
        ...ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
        [champDeLaDonnéeVide]: {
          activités: [],
          dateMiseÀJourSource: '2022-09-05',
        },
      },
      identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansAutorisations} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    expect(within(autorisationEtCapacité).queryByText(nomDeLIndicateur, { selector: 'p' })).not.toBeInTheDocument()
    expect(within(autorisationEtCapacité).queryByText(wording.INDICATEURS_VIDES)).not.toBeInTheDocument()
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

  it('affiche une phrase à la place des indicateurs lorsqu’aucune autorisation n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansAutorisationsNiCapacités = new ÉtablissementTerritorialSanitaireViewModel({
      activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
      autorisationsEtCapacités: {
        autorisations: {
          activités: [],
          dateMiseÀJourSource: '2022-09-05',
        },
        autresActivités: {
          activités: [],
          dateMiseÀJourSource: '2022-09-05',
        },
        capacités: {
          dateMiseÀJourSource: '2022-09-02',
          nombreDeLitsEnChirurgie: null,
          nombreDeLitsEnMédecine: null,
          nombreDeLitsEnObstétrique: null,
          nombreDeLitsEnSsr: null,
          nombreDeLitsEnUsld: null,
          nombreDeLitsOuPlacesEnPsyHospitalisationComplète: null,
          nombreDePlacesEnChirurgie: null,
          nombreDePlacesEnMédecine: null,
          nombreDePlacesEnObstétrique: null,
          nombreDePlacesEnPsyHospitalisationPartielle: null,
          nombreDePlacesEnSsr: null,
        },
        numéroFinessÉtablissementTerritorial,
        reconnaissancesContractuelles: {
          activités: [],
          dateMiseÀJourSource: '2022-09-05',
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: '2022-09-05',
          équipements: [],
        },
      },
      identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansAutorisationsNiCapacités} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    expect(within(activité).getByText(wording.INDICATEURS_VIDES)).toBeInTheDocument()
  })

  describe('L’indicateur des reconnaissances contractuelles', () => {
    it('affiche un lien pour chaque reconnaissance contractuelle de l’établissement', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs)
      const activité1 = within(reconnaissancesContractuelles).getByRole('link', { name: 'Surveillance continue [R7]' })
      expect(activité1).toHaveAttribute('aria-expanded', 'false')
    })

    it('affiche un lien pour chaque modalité d’une reconnaissance contractuelle', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs)
      const modalité1 = within(reconnaissancesContractuelles).getByRole('link', { name: 'USC polyvalente - adulte (non adossée à une unité de réanimation) [N8]' })
      expect(modalité1).toHaveAttribute('aria-expanded', 'false')
    })

    it('affiche le libellé et le code de la forme et les dates pour chacune des formes quand ces informations sont renseignées', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

      // THEN
      const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
      const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs)
      const informationsDUneAutreActivité = within(reconnaissancesContractuelles).getAllByRole('list', { name: 'reconnaissance-contractuelle' })[0]
      expect(within(informationsDUneAutreActivité).getByText('Hospitalisation complète (24 heures consécutives ou plus) [01]', { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.CAPACITÉ_AUTORISÉE} : 4`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_D_EFFET_ASR} : 30/11/2013`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_D_EFFET_CPOM} : 01/11/2013`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.DATE_DE_FIN_CPOM} : 30/11/2018`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.NUMÉRO_ARHGOS} : 18-00-RC00000`, { selector: 'li' })).toBeInTheDocument()
      expect(within(informationsDUneAutreActivité).getByText(`${wording.NUMÉRO_CPOM} : 18-00-C00000`, { selector: 'li' })).toBeInTheDocument()
    })
  })

  it('affiche les autorisations et capacités dans le bon ordre', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const partieAutorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs)
    const indexPartieAutorisations = indicateurs.indexOf(partieAutorisations)
    const partieAutresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs)
    const indexPartieAutresActivités = indicateurs.indexOf(partieAutresActivités)
    const partieReconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs)
    const indexPartieReconnaissancesContractuelles = indicateurs.indexOf(partieReconnaissancesContractuelles)

    expect(indexPartieAutorisations).toBeLessThan(indexPartieAutresActivités)
    expect(indexPartieAutresActivités).toBeLessThan(indexPartieReconnaissancesContractuelles)
  })
})

function sélectionneLIndicateur(indicateur: string, éléments: HTMLElement[]): HTMLElement {
  const partieAutorisations = éléments.filter((élément) => élément.textContent?.includes(indicateur))
  expect(partieAutorisations).toHaveLength(1)
  return partieAutorisations[0]
}
