import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial médico-social - bloc autorisation et capacité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)

  it('affiche le titre de la partie capacités, sa source et l’accès aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const capacités = indicateurs[0]
    const titre = within(capacités).getByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(capacités).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 19/08/2022 - Source : FINESS')
    const abréviationSourceFournisseur = within(capacités).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const détails = within(capacités).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-capacité-par-activités-médico-social')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche un tableau descriptif des capacités', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const capacités = indicateurs[0]
    const tableau = within(capacités).getByRole('table')
    const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ACTIVITÉ })
    const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.CAPACITÉ_INSTALLÉE })
    expect(annéeLigneDEnTête).toBeInTheDocument()
    expect(indicateurLigneDEnTête).toBeInTheDocument()

    const lignes = within(tableau).getAllByRole('row')
    const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: wording.NOMBRE_TOTAL_DE_PLACE })
    expect(annéeDeLaPremièreLigne).toBeInTheDocument()
    const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '30' })
    expect(valeurDeLaPremièreLigne).toBeInTheDocument()

    const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: 'Accueil de Jour' })
    expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
    const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '10' })
    expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

    const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: 'Hébergement Complet Internat' })
    expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
    const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '10' })
    expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()

    const annéeDeLaQuatrièmeLigne = within(lignes[4]).getByRole('cell', { name: 'Prestation en milieu ordinaire' })
    expect(annéeDeLaQuatrièmeLigne).toBeInTheDocument()
    const valeurDeLaQuatrièmeLigne = within(lignes[4]).getByRole('cell', { name: '10' })
    expect(valeurDeLaQuatrièmeLigne).toBeInTheDocument()
  })

  it('affiche le contenu de l’info bulle des capacités après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = screen.getByRole('dialog', { name: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
    const abréviationSourceFournisseur = within(infoBulle).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
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

  it('ferme l’info bulle des capacités après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = screen.getByRole('dialog', { name: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('n’affiche pas l’histogramme des capacités si elles ne sont pas renseignées', () => {
    // GIVEN
    const établissementTerritorialSansAutorisation = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: {
        autorisations: {
          dateMiseÀJourSource: '2022-05-14',
          disciplines: [
            {
              activités: [
                {
                  clientèles: [
                    {
                      code: '010',
                      datesEtCapacités: {
                        capacitéAutoriséeTotale: 10,
                        capacitéInstalléeTotale: 10,
                        dateDAutorisation: '2020-01-01',
                        dateDeDernièreInstallation: '2020-01-01',
                        dateDeMiseÀJourDAutorisation: '2020-01-01',
                        estInstallée: true,
                      },
                      libellé: 'Tous Types de Déficiences Pers.Handicap.(sans autre indic.)',
                    },
                  ],
                  code: '21',
                  libellé: 'Accueil de Jour',
                },
              ],
              code: '658',
              libellé: 'Accueil temporaire pour adultes handicapés',
            },
          ],
        },
        capacités: {
          capacitéParActivité: [],
          dateMiseÀJourSource: '2022-08-18',
        },
        numéroFinessÉtablissementTerritorial: '010000040',
      },
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansAutorisation} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    expect(within(indicateurs[0]).queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: 'p' })).not.toBeInTheDocument()
  })

  it('affiche le titre de la partie autorisations, sa source et l’accès aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const autorisations = indicateurs[1]
    const titre = within(autorisations).getByText(wording.AUTORISATIONS, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(autorisations).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe('Mise à jour : 18/08/2022 - Source : ARHGOS, FINESS')
    const abréviationSourceFournisseur = within(autorisations).getAllByText('FINESS', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const abréviationSourceOrigine = within(autorisations).getAllByText('ARHGOS', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaires')
    const détails = within(autorisations).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-autorisations-médico-social')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le contenu de l’info bulle des autorisations après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[1]).getByRole('button', { name: wording.DÉTAILS })

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

  it('ferme l’info bulle des autorisations après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    const autorisationEtCapacité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const indicateurs = within(autorisationEtCapacité).getAllByRole('listitem')
    const détails = within(indicateurs[1]).getByRole('button', { name: wording.DÉTAILS })
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
    const autorisations = indicateurs[1]
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
    const autorisations = indicateurs[1]
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
    const autorisations = indicateurs[1]
    const informationsDUneAutorisation = within(autorisations).getAllByRole('list', { name: 'dates-et-capacités' })[0]
    expect(within(informationsDUneAutorisation).getByText('PH vieillissantes [702]', { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DATE_D_AUTORISATION} : 01/01/2020`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.MISE_À_JOUR_AUTORISATION} : 01/01/2020`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.DERNIÈRE_INSTALLATION} : N/A`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.CAPACITÉ_AUTORISÉE} : 10`, { selector: 'li' })).toBeInTheDocument()
    expect(within(informationsDUneAutorisation).getByText(`${wording.CAPACITÉ_INSTALLÉE} : 0`, { selector: 'li' })).toBeInTheDocument()
  })

  it('affiche une phrase à la place des indicateurs lorsqu’aucune autorisation n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansAutorisation = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: {
        autorisations: {
          dateMiseÀJourSource: '2022-05-14',
          disciplines: [],
        },
        capacités: {
          capacitéParActivité: [],
          dateMiseÀJourSource: '2022-08-18',
        },
        numéroFinessÉtablissementTerritorial: '010000040',
      },
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansAutorisation} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ })
    const phrase = within(activité).getByText(wording.INDICATEURS_VIDES)
    expect(phrase).toBeInTheDocument()
  })
})
