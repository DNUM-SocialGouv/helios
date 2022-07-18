import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial Sanitaire - Bloc activité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording)

  it.each(
    [
      [wording.NOMBRE_DE_SÉJOUR_MCO, 0],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 1],
    ]
  )('affiche les informations d’un indicateurs', (titreSection, identifiant) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[identifiant]).getAllByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const abréviation = within(indicateurs[identifiant]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[identifiant]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', `nom-info-bulle-activite-${identifiant}`)
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it.each(
    [
      [wording.NOMBRE_DE_SÉJOUR_MCO, 0],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 1],
    ]
  )('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails"', (titreSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
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
      [wording.NOMBRE_DE_SÉJOUR_MCO, 0],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 1],
    ]
  )('ferme l’info bulle après avoir cliqué sur le bouton "Fermer"', (titreSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
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

  it.each(
    [
      [
        [
          wording.ANNÉE,
          wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
          wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
          wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
          wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
          wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
          wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
        ], 0,
      ],
      [
        [
          wording.ANNÉE,
          wording.NOMBRE_DE_PASSAGES_AUX_URGENCES,
        ], 1,
      ],
    ]
  )('affiche un tableau descriptif avec les cinq années après un click sur "Afficher la transcription"', (titresSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const transcription = within(indicateurs[identifiant]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

    // WHEN
    fireEvent.click(transcription)

    // THEN
    expect(transcription).toHaveAttribute('aria-expanded', 'true')
    const tableau = within(indicateurs[identifiant]).getByRole('table')

    const libellésLigneDEnTête = titresSection
    libellésLigneDEnTête.map((libellé) => {
      const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: libellé })
      expect(indicateurLigneDEnTête).toBeInTheDocument()
    })

    const annéesEtValeurs = [
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
        valeur: (5000).toLocaleString('fr'),
      },
    ]
    const lignes = within(tableau).getAllByRole('row')
    annéesEtValeurs.map((annéeEtValeur) => {
      const année = within(lignes[annéeEtValeur.index]).getByRole('cell', { name : annéeEtValeur.année })
      expect(année).toBeInTheDocument()
      const valeurs = within(lignes[annéeEtValeur.index]).getAllByRole('cell', { name: annéeEtValeur.valeur })
      valeurs.forEach((valeur) => {
        expect(valeur).toBeInTheDocument()
      })
    })
  })

  it.each(
    [
      [wording.NOMBRE_DE_SÉJOUR_MCO, 1, 1, 1, 1, 1, null, null, null, null, null, null],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  )('n’affiche pas l’indicateur quand sa valeur est vide', (
    titreSection,
    indicateur1,
    indicateur2,
    indicateur3,
    indicateur4,
    indicateur5,
    indicateur6,
    indicateur7,
    indicateur8,
    indicateur9,
    indicateur10,
    indicateur11
  ) => {
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [
        {
          année: 2017,
          dateMiseAJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: indicateur1,
          nombreJournéesCompletePsy: indicateur2,
          nombreJournéesCompletesSsr: indicateur3,
          nombreJournéesPartiellesPsy: indicateur4,
          nombreJournéesPartielsSsr: indicateur5,
          nombreSéjoursCompletsChirurgie: indicateur6,
          nombreSéjoursCompletsMédecine: indicateur7,
          nombreSéjoursCompletsObstétrique: indicateur8,
          nombreSéjoursPartielsChirurgie: indicateur9,
          nombreSéjoursPartielsMédecine: indicateur10,
          nombreSéjoursPartielsObstétrique: indicateur11,
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2018,
          dateMiseAJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: indicateur1,
          nombreJournéesCompletePsy: indicateur2,
          nombreJournéesCompletesSsr: indicateur3,
          nombreJournéesPartiellesPsy: indicateur4,
          nombreJournéesPartielsSsr: indicateur5,
          nombreSéjoursCompletsChirurgie: indicateur6,
          nombreSéjoursCompletsMédecine: indicateur7,
          nombreSéjoursCompletsObstétrique: indicateur8,
          nombreSéjoursPartielsChirurgie: indicateur9,
          nombreSéjoursPartielsMédecine: indicateur10,
          nombreSéjoursPartielsObstétrique: indicateur11,
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2019,
          dateMiseAJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: indicateur1,
          nombreJournéesCompletePsy: indicateur2,
          nombreJournéesCompletesSsr: indicateur3,
          nombreJournéesPartiellesPsy: indicateur4,
          nombreJournéesPartielsSsr: indicateur5,
          nombreSéjoursCompletsChirurgie: indicateur6,
          nombreSéjoursCompletsMédecine: indicateur7,
          nombreSéjoursCompletsObstétrique: indicateur8,
          nombreSéjoursPartielsChirurgie: indicateur9,
          nombreSéjoursPartielsMédecine: indicateur10,
          nombreSéjoursPartielsObstétrique: indicateur11,
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2020,
          dateMiseAJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: indicateur1,
          nombreJournéesCompletePsy: indicateur2,
          nombreJournéesCompletesSsr: indicateur3,
          nombreJournéesPartiellesPsy: indicateur4,
          nombreJournéesPartielsSsr: indicateur5,
          nombreSéjoursCompletsChirurgie: indicateur6,
          nombreSéjoursCompletsMédecine: indicateur7,
          nombreSéjoursCompletsObstétrique: indicateur8,
          nombreSéjoursPartielsChirurgie: indicateur9,
          nombreSéjoursPartielsMédecine: indicateur10,
          nombreSéjoursPartielsObstétrique: indicateur11,
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2021,
          dateMiseAJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: indicateur1,
          nombreJournéesCompletePsy: indicateur2,
          nombreJournéesCompletesSsr: indicateur3,
          nombreJournéesPartiellesPsy: indicateur4,
          nombreJournéesPartielsSsr: indicateur5,
          nombreSéjoursCompletsChirurgie: indicateur6,
          nombreSéjoursCompletsMédecine: indicateur7,
          nombreSéjoursCompletsObstétrique: indicateur8,
          nombreSéjoursPartielsChirurgie: indicateur9,
          nombreSéjoursPartielsMédecine: indicateur10,
          nombreSéjoursPartielsObstétrique: indicateur11,
          numéroFinessÉtablissementTerritorial: '010000040',
        },
      ],
      identité: {
        adresseAcheminement: '01130 NANTUA',
        adresseNuméroVoie : '50',
        adresseTypeVoie : 'R',
        adresseVoie : 'PAUL PAINLEVE',
        catégorieÉtablissement : '355',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        libelléCatégorieÉtablissement : 'Centre Hospitalier (C.H.)',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010045057',
        numéroFinessÉtablissementTerritorial: '010000040',
        raisonSociale : 'CH NANTUA',
        raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        statutJuridique : 'Société Anonyme (S.A.)',
        typeÉtablissement : 'S',
        téléphone : '0474754800',
      },
    }, wording)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).queryAllByRole('listitem')
    expect(indicateurs).toHaveLength(1)
    const listes = within(activité).getAllByRole('list')
    const titre = within(listes[0]).queryByText(titreSection, { selector: 'p' })
    expect(titre).not.toBeInTheDocument()
  })

  it('n’affiche pas le bloc activité si aucune activité n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [],
      identité: {
        adresseAcheminement: '01130 NANTUA',
        adresseNuméroVoie : '50',
        adresseTypeVoie : 'R',
        adresseVoie : 'PAUL PAINLEVE',
        catégorieÉtablissement : '355',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        libelléCatégorieÉtablissement : 'Centre Hospitalier (C.H.)',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010045057',
        numéroFinessÉtablissementTerritorial: '010000040',
        raisonSociale : 'CH NANTUA',
        raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        statutJuridique : 'Société Anonyme (S.A.)',
        typeÉtablissement : 'S',
        téléphone : '0474754800',
      },
    }, wording)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.queryByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    expect(activité).not.toBeInTheDocument()
  })
})
