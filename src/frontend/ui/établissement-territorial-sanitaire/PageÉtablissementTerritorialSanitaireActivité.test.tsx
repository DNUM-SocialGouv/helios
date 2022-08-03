import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page Établissement territorial Sanitaire - Bloc activité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  it.each(
    [
      [wording.NOMBRE_DE_SÉJOUR_MCO, 0],
      [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2],
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
      [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2],
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
      [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2],
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
          wording.HOSPITALISATION_PARTIELLE_SSR,
          wording.HOSPITALISATION_COMPLÈTE_SSR,
          wording.HOSPITALISATION_PARTIELLE_PSY,
          wording.HOSPITALISATION_COMPLÈTE_PSY,
        ], 1,
      ],
      [
        [
          wording.ANNÉE,
          wording.NOMBRE_DE_PASSAGES_AUX_URGENCES,
        ], 2,
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
      [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1, null, null, null, null, 1, 1, 1, 1, 1, 1],
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
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur1,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur2,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur3,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur4,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur5,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur6,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur7,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur8,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur9,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur10,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur11,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2018,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur1,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur2,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur3,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur4,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur5,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur6,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur7,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur8,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur9,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur10,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur11,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2019,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur1,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur2,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur3,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur4,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur5,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur6,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur7,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur8,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur9,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur10,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur11,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2020,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur1,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur2,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur3,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur4,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur5,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur6,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur7,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur8,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur9,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur10,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur11,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2021,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur1,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur2,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur3,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur4,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur5,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur6,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur7,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur8,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur9,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur10,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: indicateur11,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
      ],
      identité: {
        adresseAcheminement: {
          dateMiseÀJourSource: '2021-07-07',
          value: '01130 NANTUA',
        },
        adresseNuméroVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: '50',
        },
        adresseTypeVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'R',
        },
        adresseVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'PAUL PAINLEVE',
        },
        catégorieÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: '355',
        },
        courriel: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'a@example.com',
        },
        dateMiseÀJourSource: '2021-07-07',
        libelléCatégorieÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'Centre Hospitalier (C.H.)',
        },
        numéroFinessEntitéJuridique: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010008407',
        },
        numéroFinessÉtablissementPrincipal: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010045057',
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010000040',
        },
        raisonSociale: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'CH NANTUA',
        },
        raisonSocialeDeLEntitéDeRattachement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        },
        statutJuridique: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'Société Anonyme (S.A.)',
        },
        typeÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'S',
        },
        téléphone: {
          dateMiseÀJourSource: '2021-07-07',
          value: '0474754800',
        },
      },
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).queryAllByRole('listitem')
    expect(indicateurs).toHaveLength(2)
    const listes = within(activité).getAllByRole('list')
    const titre = within(listes[0]).queryByText(titreSection, { selector: 'p' })
    expect(titre).not.toBeInTheDocument()
  })

  it('affiche une phrase à la place des indicateurs lorsque des activités sont renseignées mais les indicateurs sont vides', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [
        {
          année: 2017,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2018,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2019,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2020,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2021,
          dateMiseÀJourSource: '2021-07-07',
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
      ],
      identité: {
        adresseAcheminement: {
          dateMiseÀJourSource: '2021-07-07',
          value: '01130 NANTUA',
        },
        adresseNuméroVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: '50',
        },
        adresseTypeVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'R',
        },
        adresseVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'PAUL PAINLEVE',
        },
        catégorieÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: '355',
        },
        courriel: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'a@example.com',
        },
        dateMiseÀJourSource: '2021-07-07',
        libelléCatégorieÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'Centre Hospitalier (C.H.)',
        },
        numéroFinessEntitéJuridique: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010008407',
        },
        numéroFinessÉtablissementPrincipal: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010045057',
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010000040',
        },
        raisonSociale: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'CH NANTUA',
        },
        raisonSocialeDeLEntitéDeRattachement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        },
        statutJuridique: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'Société Anonyme (S.A.)',
        },
        typeÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'S',
        },
        téléphone: {
          dateMiseÀJourSource: '2021-07-07',
          value: '0474754800',
        },
      },
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const phrase = within(activité).getByText(wording.INDICATEURS_VIDES)
    expect(phrase).toBeInTheDocument()
  })

  it('n’affiche pas le bloc activité si aucune activité n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [],
      identité: {
        adresseAcheminement: {
          dateMiseÀJourSource: '2021-07-07',
          value: '01130 NANTUA',
        },
        adresseNuméroVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: '50',
        },
        adresseTypeVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'R',
        },
        adresseVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'PAUL PAINLEVE',
        },
        catégorieÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: '355',
        },
        courriel: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'a@example.com',
        },
        dateMiseÀJourSource: '2021-07-07',
        libelléCatégorieÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'Centre Hospitalier (C.H.)',
        },
        numéroFinessEntitéJuridique: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010008407',
        },
        numéroFinessÉtablissementPrincipal: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010045057',
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseÀJourSource: '2021-07-07',
          value: '010000040',
        },
        raisonSociale: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'CH NANTUA',
        },
        raisonSocialeDeLEntitéDeRattachement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        },
        statutJuridique: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'Société Anonyme (S.A.)',
        },
        typeÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: 'S',
        },
        téléphone: {
          dateMiseÀJourSource: '2021-07-07',
          value: '0474754800',
        },
      },
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.queryByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    expect(activité).not.toBeInTheDocument()
  })
})
