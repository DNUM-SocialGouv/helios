import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial - Bloc activité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording)

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 3],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6],
    ]
  )('affiche les informations d’un indicateurs', (titreSection, identifiant) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[identifiant]).getAllByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const transcription = within(indicateurs[identifiant]).getByText(wording.AFFICHER_LA_TRANSCRIPTION)
    expect(transcription).toHaveAttribute('aria-expanded', 'false')
    const abréviation = within(indicateurs[identifiant]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[identifiant]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', `nom-info-bulle-activite-${identifiant}`)
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  describe('Taux d’occupation en hébergement permanent', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[0]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[0]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '94 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '97 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '101 %' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  describe('Taux d’occupation en hébergement temporaire', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[1]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[1]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '70 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '121 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '67 %' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  describe('Taux d’occupation en accueil de jour', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[2]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[2]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '0 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '15 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '20 %' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  describe('Taux de réalisation de l’activité', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[3]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[3]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.TAUX_RÉALISATION_ACTIVITÉ })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '100 %' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '94 %' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '96 %' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  describe('File active des personnes accompagnées sur la période', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[4]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[4]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '340' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '280' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '300' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  describe('Nombre moyen de journées d’absence des personnes accompagnées sur la période', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[5]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[5]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '87' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '90' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '22' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  describe('Durée moyenne de séjour/d’accompagnement des personnes sorties définitivement au cours de l’année (en nombre de jours)', () => {
    it('affiche un tableau descriptif après un click sur "Afficher la transcription"', () => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
      const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
      const indicateur = within(activité).getAllByRole('listitem')
      const transcription = within(indicateur[6]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

      // WHEN
      fireEvent.click(transcription)

      // THEN
      expect(transcription).toHaveAttribute('aria-expanded', 'true')

      const tableau = within(indicateur[6]).getByRole('table')
      const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES })
      expect(annéeLigneDEnTête).toBeInTheDocument()
      expect(indicateurLigneDEnTête).toBeInTheDocument()

      const lignes = within(tableau).getAllByRole('row')
      const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
      expect(annéeDeLaPremièreLigne).toBeInTheDocument()
      const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '1013' })
      expect(valeurDeLaPremièreLigne).toBeInTheDocument()

      const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
      expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
      const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '994' })
      expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

      const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
      expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
      const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '990' })
      expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
    })
  })

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 3],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6],
    ]
  )('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails"', (titreSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const détails = within(indicateurs[identifiant]).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: titreSection })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
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

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 3],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6],
    ]
  )('ferme l’info bulle après avoir cliqué sur le bouton "Fermer"', (titreSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const détails = within(indicateurs[identifiant]).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: titreSection })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })
})
