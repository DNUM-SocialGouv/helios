import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines'
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent, textMatch } from '../../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from '../PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ÉtablissementTerritorialMédicoSocialViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial - bloc ressources humaines', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)
  const indiceDeLIndicateur: Record<keyof ÉtablissementTerritorialMédicoSocialRessourcesHumaines, number> = {
    année: -1,
    nombreDEtpRéalisés: 0,
    nombreDeCddDeRemplacement: -1,
    tauxDAbsentéisme: -1,
    tauxDEtpVacants: -1,
    tauxDePrestationsExternes: -1,
    tauxDeRotationDuPersonnel: -1,
  }

  it('affiche l’intitulé de l’indicateur du nombre d’ETP réalisé, avec sa date de mise à jour, ses sources et un bouton pour accéder aux détails', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const titre = within(indicateur).getByText(textMatch(wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION), { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour('06/06/2022')} - Source : CNSA`), { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const abréviationSourceOrigine = within(indicateur).getAllByText('CNSA', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', wording.CNSA_TITLE)
    const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-ressources-humaines-nombre-etp-réalisé')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le contenu de l’info bulle du nombre d’ETP réalisé après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })

    // WHEN
    fireEvent.click(détails)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'true')
    const infoBulle = within(indicateur).getByRole('dialog', { name: 'Nombre d’ Équivalent Temps Plein Total réalisé' })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })
    expect(fermer).toBeInTheDocument()
    const abréviationSourceOrigine = within(infoBulle).getAllByText('CNSA', { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', wording.CNSA_TITLE)
    const élémentsDeCompréhension = within(infoBulle).getByRole('region', { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION })
    expect(élémentsDeCompréhension).toBeInTheDocument()
    const fréquence = within(infoBulle).getByRole('region', { name: wording.FRÉQUENCE })
    expect(fréquence).toBeInTheDocument()
    const sources = within(infoBulle).getByRole('region', { name: wording.SOURCES })
    expect(sources).toBeInTheDocument()
    const infosComplémentaires = within(infoBulle).getByRole('region', { name: wording.INFOS_COMPLÉMENTAIRES })
    expect(infosComplémentaires).toBeInTheDocument()
  })

  it('ferme l’info bulle du nombre d’ETP réalisé après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const détails = within(indicateur).getByRole('button', { name: wording.DÉTAILS })
    fireEvent.click(détails)
    const infoBulle = within(indicateur).getByRole('dialog', { name: 'Nombre d’ Équivalent Temps Plein Total réalisé' })
    const fermer = within(infoBulle).getByRole('button', { name: wording.FERMER })

    // WHEN
    fireEvent.click(fermer)

    // THEN
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche une mise en exergue sur l’indicateur du nombre d’ETP réalisé si un année est manquante', () => {
    // GIVEN
    const établissementTerritorialAvecUneAnnéeManquante = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      ressourcesHumaines: [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2019 }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 }),
      ],
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecUneAnnéeManquante} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} 2021`, { selector: 'p' })
    expect(exergue).toBeInTheDocument()
  })

  it('affiche une mise en exergue sur l’indicateur du nombre d’ETP réalisé si deux années sont manquantes', () => {
    // GIVEN
    const établissementTerritorialAvecUneAnnéeManquante = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      ressourcesHumaines: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 })],
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecUneAnnéeManquante} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} 2019, 2021`, { selector: 'p' })
    expect(exergue).toBeInTheDocument()
  })

  it('affiche une phrase à la place des indicateurs lorsqu’aucune donnée n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansBlocRessourcesHumaines = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activités,
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.budgetEtFinances,
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      ressourcesHumaines: [],
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansBlocRessourcesHumaines} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    expect(within(ressourcesHumaines).getByText(wording.INDICATEURS_VIDES)).toBeInTheDocument()
  })

  it('affiche un tableau descriptif avec les trois années', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const tauxDeCaf = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const tableau = within(tauxDeCaf).getByRole('table')
    const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
    const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION })
    expect(annéeLigneDEnTête).toBeInTheDocument()
    expect(indicateurLigneDEnTête).toBeInTheDocument()

    const lignes = within(tableau).getAllByRole('row')
    const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
    expect(annéeDeLaPremièreLigne).toBeInTheDocument()
    const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '47,42' })
    expect(valeurDeLaPremièreLigne).toBeInTheDocument()

    const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
    expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
    const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '9,71' })
    expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

    const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
    expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
    const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '10,44' })
    expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
  })

  it('affiche un tableau descriptif avec deux années', () => {
    // GIVEN
    const établissementTerritorialAvecDeuxAnnées = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      ressourcesHumaines: [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2019 }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 }),
      ],
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecDeuxAnnées} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const tauxDeCaf = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const tableau = within(tauxDeCaf).getByRole('table')
    const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
    const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION })
    expect(annéeLigneDEnTête).toBeInTheDocument()
    expect(indicateurLigneDEnTête).toBeInTheDocument()

    const lignes = within(tableau).getAllByRole('row')
    const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
    expect(annéeDeLaPremièreLigne).toBeInTheDocument()
    const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '9,71' })
    expect(valeurDeLaPremièreLigne).toBeInTheDocument()

    const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
    expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
    const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '9,71' })
    expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()
  })

  it('affiche un tableau descriptif avec une seule année', () => {
    // GIVEN
    const établissementTerritorialAvecUneSeuleAnnée = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      budgetEtFinances: [],
      identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
      ressourcesHumaines: [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 })],
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialAvecUneSeuleAnnée} />)

    // THEN
    const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES })
    const indicateurs = within(ressourcesHumaines).getAllByRole('listitem')
    const tauxDeCaf = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés]
    const tableau = within(tauxDeCaf).getByRole('table')
    const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
    const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION })
    expect(annéeLigneDEnTête).toBeInTheDocument()
    expect(indicateurLigneDEnTête).toBeInTheDocument()

    const lignes = within(tableau).getAllByRole('row')
    const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2020' })
    expect(annéeDeLaPremièreLigne).toBeInTheDocument()
    const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '9,71' })
    expect(valeurDeLaPremièreLigne).toBeInTheDocument()
  })
})
