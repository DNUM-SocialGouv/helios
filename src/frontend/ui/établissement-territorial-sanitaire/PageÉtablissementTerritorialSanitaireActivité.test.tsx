import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial Sanitaire - Bloc activité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording)

  it('affiche les informations de nombre de séjours Médecine, Chirurgie et Obstétrique', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const titre = within(indicateurs[0]).getByText(wording.NOMBRE_DE_SÉJOUR_MCO, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[0]).getAllByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const abréviation = within(indicateurs[0]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-0')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: wording.NOMBRE_DE_SÉJOUR_MCO })
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

  it('ferme l’info bulle après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: wording.NOMBRE_DE_SÉJOUR_MCO })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche un tableau descriptif avec les cinq années après un click sur "Afficher la transcription"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const transcription = within(indicateurs[0]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })
    // WHEN
    fireEvent.click(transcription)

    // THEN
    expect(transcription).toHaveAttribute('aria-expanded', 'true')
    const tableau = within(indicateurs[0]).getByRole('table')

    const labelsLigneDEnTête = [
      wording.ANNÉE,
      wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
      wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
      wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
      wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
      wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
      wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
    ]
    labelsLigneDEnTête.map((label) => {
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: label })
      expect(indicateurLigneDEnTête).toBeInTheDocument()
    })

    const labelsLignesValeurs = [
      {
        année: '2017',
        index: 1,
        valeur: '10',
      },
      {
        année: '2018',
        index: 2,
        valeur: '20',
      },
      {
        année: '2019',
        index: 3,
        valeur: '30',
      },
      {
        année: '2020',
        index: 4,
        valeur: '40',
      },
      {
        année: '2021',
        index: 5,
        valeur: '50',
      },
    ]
    const lignes = within(tableau).getAllByRole('row')
    labelsLignesValeurs.map((ligne) => {
      const année = within(lignes[ligne.index]).getByRole('cell', { name : ligne.année })
      expect(année).toBeInTheDocument()
      const valeur = within(lignes[ligne.index]).getAllByRole('cell', { name: ligne.valeur })
      expect(valeur[0]).toBeInTheDocument()
      expect(valeur[1]).toBeInTheDocument()
      expect(valeur[2]).toBeInTheDocument()
      expect(valeur[3]).toBeInTheDocument()
      expect(valeur[4]).toBeInTheDocument()
      expect(valeur[5]).toBeInTheDocument()
    })
  } )
})
