import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, mockedDate, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial sanitaire - bloc activité', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  it.each(
    [
      [wording.NOMBRE_DE_SÉJOUR_MCO, 0, 'PMSI', 'Programme de Médicalisation des Systèmes d’Information'],
      [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1, 'PMSI', 'Programme de Médicalisation des Systèmes d’Information'],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2, 'PMSI', 'Programme de Médicalisation des Systèmes d’Information'],
    ]
  )('affiche les informations de l’indicateur %s', (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    expect(indicateurs).toHaveLength(3)
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[identifiant]).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe(`Mise à jour : 07/07/2021 - Source : ${sourceOrigineAttendue}, DIAMANT`)
    const transcription = within(indicateurs[identifiant]).getByText(wording.AFFICHER_LA_TRANSCRIPTION)
    expect(transcription).toHaveAttribute('aria-expanded', 'false')
    expect(transcription).not.toBeDisabled()
    const abréviation = within(indicateurs[identifiant]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const abréviationSourceOrigine = within(indicateurs[identifiant]).getAllByText(sourceOrigineAttendue, { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', abréviationSourceOrigineAttendue)
    const détails = within(indicateurs[identifiant]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', `nom-info-bulle-activite-${identifiant}`)
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
    const exergue = within(indicateurs[identifiant]).queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, { selector: 'p' })
    expect(exergue).not.toBeInTheDocument()
  })

  it.each(
    [
      [wording.NOMBRE_DE_SÉJOUR_MCO, 0, 'PMSI', 'Programme de Médicalisation des Systèmes d’Information'],
      [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1, 'PMSI', 'Programme de Médicalisation des Systèmes d’Information'],
      [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2, 'PMSI', 'Programme de Médicalisation des Systèmes d’Information'],
    ]
  )('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (%s)', (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
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
    const abréviationSourceFournisseur = within(infoBulle).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const abréviationSourceOrigine = within(infoBulle).getAllByText(sourceOrigineAttendue, { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', abréviationSourceOrigineAttendue)
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
  )('ferme l’info bulle après avoir cliqué sur le bouton "Fermer" (%s)', (titreSection, identifiant) => {
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
  )('affiche un tableau descriptif avec les cinq années après un clic sur "Afficher la transcription"', (libellésLigneDEnTête, identifiant) => {
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
    ]
  )('n’affiche pas l’indicateur quand sa valeur est vide (%s)', (
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
      autorisationsEtCapacités: {
        autorisations: {
          activités: [
            {
              code:'16',
              libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
              modalités : [
                {
                  code: '42',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2005-10-11',
                        dateDeFin: '2026-05-03',
                        dateDeMiseEnOeuvre: '2008-01-04',
                        numéroArhgos: '01-00-000',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: 'Hémodialyse en unité médicalisée',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        autresActivités: {
          activités: [
            {
              code:'A1',
              libellé: 'Dépôt de sang',
              modalités : [
                {
                  code: 'M0',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2019-06-03',
                        dateDeFin: '2024-08-31',
                        dateDeMiseEnOeuvre: '2019-06-03',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: "Dépôt d'urgence",
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        numéroFinessÉtablissementTerritorial: '123456789',
        reconnaissancesContractuelles: {
          activités: [
            {
              code:'R7',
              libellé: 'Surveillance continue',
              modalités : [
                {
                  code: 'N8',
                  formes: [
                    {
                      code: '01',
                      dates: {
                        capacitéAutorisée: 4,
                        dateDEffetAsr: '2013-11-30',
                        dateDEffetCpom: '2013-11-01',
                        dateDeFinCpom: '2018-11-30',
                        numéroArhgos: '18-00-RC00000',
                        numéroCpom: '18-00-C00000',
                      },
                      libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                    },
                  ],
                  libellé: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: '2022-08-29',
          équipements: [
            {
              autorisations : [
                {
                  dateDAutorisation: '2006-05-02',
                  dateDeFin: '2027-02-16',
                  dateDeMiseEnOeuvre: '2009-01-20',
                  numéroArhgos: '01-00-0000',
                },
              ],
              code:'06201',
              libellé: "Appareil d'IRM à utilisation clinique",
            },
          ],
        },
      },
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

  it('n’affiche pas le graphique de l’indicateur mais une mise en exergue quand sa valeur de toutes les années sont vides (Nombre de passages aux urgences)', () => {
    mockedDate('2022-01-01T23:00:00.135Z')
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [
        {
          année: 2017,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2018,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2019,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2020,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
        {
          année: 2021,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2021-07-07',
            value: null,
          },
          nombreJournéesCompletePsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreJournéesPartielsSsr: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: '2021-07-07',
            value: 1,
          },
          numéroFinessÉtablissementTerritorial: '010000040',
        },
      ],
      autorisationsEtCapacités: {
        autorisations: {
          activités: [
            {
              code:'16',
              libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
              modalités : [
                {
                  code: '42',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2005-10-11',
                        dateDeFin: '2026-05-03',
                        dateDeMiseEnOeuvre: '2008-01-04',
                        numéroArhgos: '01-00-000',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: 'Hémodialyse en unité médicalisée',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        autresActivités: {
          activités: [
            {
              code:'A1',
              libellé: 'Dépôt de sang',
              modalités : [
                {
                  code: 'M0',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2019-06-03',
                        dateDeFin: '2024-08-31',
                        dateDeMiseEnOeuvre: '2019-06-03',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: "Dépôt d'urgence",
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        numéroFinessÉtablissementTerritorial: '123456789',
        reconnaissancesContractuelles: {
          activités: [
            {
              code:'R7',
              libellé: 'Surveillance continue',
              modalités : [
                {
                  code: 'N8',
                  formes: [
                    {
                      code: '01',
                      dates: {
                        capacitéAutorisée: 4,
                        dateDEffetAsr: '2013-11-30',
                        dateDEffetCpom: '2013-11-01',
                        dateDeFinCpom: '2018-11-30',
                        numéroArhgos: '18-00-RC00000',
                        numéroCpom: '18-00-C00000',
                      },
                      libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                    },
                  ],
                  libellé: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: '2022-08-29',
          équipements: [
            {
              autorisations : [
                {
                  dateDAutorisation: '2006-05-02',
                  dateDeFin: '2027-02-16',
                  dateDeMiseEnOeuvre: '2009-01-20',
                  numéroArhgos: '01-00-0000',
                },
              ],
              code:'06201',
              libellé: "Appareil d'IRM à utilisation clinique",
            },
          ],
        },
      },
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

    const exergue = within(indicateurs[2]).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} 2017, 2018, 2019, 2020, 2021`, { selector: 'p' })
    expect(exergue).toBeInTheDocument()
    const transcription = within(indicateurs[2]).getByText(wording.AFFICHER_LA_TRANSCRIPTION)
    expect(transcription).toBeDisabled()
  })

  it('affiche une phrase à la place des indicateurs lorsque des activités sont renseignées mais les indicateurs sont vides', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [
        {
          année: 2017,
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
      autorisationsEtCapacités: {
        autorisations: {
          activités: [
            {
              code:'16',
              libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
              modalités : [
                {
                  code: '42',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2005-10-11',
                        dateDeFin: '2026-05-03',
                        dateDeMiseEnOeuvre: '2008-01-04',
                        numéroArhgos: '01-00-000',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: 'Hémodialyse en unité médicalisée',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        autresActivités: {
          activités: [
            {
              code:'A1',
              libellé: 'Dépôt de sang',
              modalités : [
                {
                  code: 'M0',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2019-06-03',
                        dateDeFin: '2024-08-31',
                        dateDeMiseEnOeuvre: '2019-06-03',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: "Dépôt d'urgence",
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        numéroFinessÉtablissementTerritorial: '123456789',
        reconnaissancesContractuelles: {
          activités: [
            {
              code:'R7',
              libellé: 'Surveillance continue',
              modalités : [
                {
                  code: 'N8',
                  formes: [
                    {
                      code: '01',
                      dates: {
                        capacitéAutorisée: 4,
                        dateDEffetAsr: '2013-11-30',
                        dateDEffetCpom: '2013-11-01',
                        dateDeFinCpom: '2018-11-30',
                        numéroArhgos: '18-00-RC00000',
                        numéroCpom: '18-00-C00000',
                      },
                      libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                    },
                  ],
                  libellé: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: '2022-08-29',
          équipements: [
            {
              autorisations : [
                {
                  dateDAutorisation: '2006-05-02',
                  dateDeFin: '2027-02-16',
                  dateDeMiseEnOeuvre: '2009-01-20',
                  numéroArhgos: '01-00-0000',
                },
              ],
              code:'06201',
              libellé: "Appareil d'IRM à utilisation clinique",
            },
          ],
        },
      },
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

  it('affiche une phrase à la place des indicateurs lorsqu’aucune activité n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel({
      activités: [],

      autorisationsEtCapacités: {
        autorisations: {
          activités: [
            {
              code:'16',
              libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
              modalités : [
                {
                  code: '42',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2005-10-11',
                        dateDeFin: '2026-05-03',
                        dateDeMiseEnOeuvre: '2008-01-04',
                        numéroArhgos: '01-00-000',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: 'Hémodialyse en unité médicalisée',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        autresActivités: {
          activités: [
            {
              code:'A1',
              libellé: 'Dépôt de sang',
              modalités : [
                {
                  code: 'M0',
                  formes: [
                    {
                      code: '00',
                      dates: {
                        dateDAutorisation: '2019-06-03',
                        dateDeFin: '2024-08-31',
                        dateDeMiseEnOeuvre: '2019-06-03',
                      },
                      libellé: 'Pas de forme',
                    },
                  ],
                  libellé: "Dépôt d'urgence",
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        numéroFinessÉtablissementTerritorial: '123456789',
        reconnaissancesContractuelles: {
          activités: [
            {
              code:'R7',
              libellé: 'Surveillance continue',
              modalités : [
                {
                  code: 'N8',
                  formes: [
                    {
                      code: '01',
                      dates: {
                        capacitéAutorisée: 4,
                        dateDEffetAsr: '2013-11-30',
                        dateDEffetCpom: '2013-11-01',
                        dateDeFinCpom: '2018-11-30',
                        numéroArhgos: '18-00-RC00000',
                        numéroCpom: '18-00-C00000',
                      },
                      libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                    },
                  ],
                  libellé: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
                },
              ],
            },
          ],
          dateMiseÀJourSource: '2022-08-29',
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: '2022-08-29',
          équipements: [
            {
              autorisations : [
                {
                  dateDAutorisation: '2006-05-02',
                  dateDeFin: '2027-02-16',
                  dateDeMiseEnOeuvre: '2009-01-20',
                  numéroArhgos: '01-00-0000',
                },
              ],
              code:'06201',
              libellé: "Appareil d'IRM à utilisation clinique",
            },
          ],
        },
      },
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
})
