import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

const { paths, wording } = fakeFrontDependencies

describe('La page Établissement territorial Médico-social - Bloc activité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0, 'CNSA', 'Caisse Nationale de Solidarité pour l‘Autonomie'],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, 'CNSA', 'Caisse Nationale de Solidarité pour l‘Autonomie'],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2, 'CNSA', 'Caisse Nationale de Solidarité pour l‘Autonomie'],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 3, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
    ]
  )('affiche les informations d’un indicateurs', (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: 'p' })
    expect(titre).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[identifiant]).getAllByText('Mise à jour', { exact: false, selector: 'p' })
    expect(dateMiseAJour[0].textContent).toBe(`Mise à jour : 07/07/2021 - Source : ${sourceOrigineAttendue}, DIAMANT`)
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const transcription = within(indicateurs[identifiant]).getByText(wording.AFFICHER_LA_TRANSCRIPTION)
    expect(transcription).toHaveAttribute('aria-expanded', 'false')
    const abréviationSourceFournisseur = within(indicateurs[identifiant]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviationSourceFournisseur[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const abréviationSourceOrigine = within(indicateurs[identifiant]).getAllByText(sourceOrigineAttendue, { selector: 'abbr' })
    expect(abréviationSourceOrigine[0]).toHaveAttribute('title', abréviationSourceOrigineAttendue)
    const détails = within(indicateurs[identifiant]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', `nom-info-bulle-activite-${identifiant}`)
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0, '94.4 %', '97.5 %', '101.6 %'],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, '70.4 %', '121.5 %', '67.6 %'],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2, '0.4 %', '15.5 %', '20.6 %'],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 3, '100.4 %', '94.5 %', '96.6 %'],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4, '340', '280', '300'],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5, '87', '90', '22'],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6, (1013).toLocaleString('fr'), '994', '990'],
    ]
  )('affiche un tableau descriptif avec les trois années après un click sur "Afficher la transcription"', (titreSection, identifiant, valeurIndicateur1, valeurIndicateur2, valeurIndicateur3) => {
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const transcription = within(indicateurs[identifiant]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

    // WHEN
    fireEvent.click(transcription)

    // THEN
    expect(transcription).toHaveAttribute('aria-expanded', 'true')

    const tableau = within(indicateurs[identifiant]).getByRole('table')
    const annéeLigneDEnTête = within(tableau).getByRole('columnheader', { name: wording.ANNÉE })
    const indicateurLigneDEnTête = within(tableau).getByRole('columnheader', { name: titreSection })
    expect(annéeLigneDEnTête).toBeInTheDocument()
    expect(indicateurLigneDEnTête).toBeInTheDocument()

    const lignes = within(tableau).getAllByRole('row')
    const annéeDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: '2019' })
    expect(annéeDeLaPremièreLigne).toBeInTheDocument()
    const valeurDeLaPremièreLigne = within(lignes[1]).getByRole('cell', { name: valeurIndicateur1 })
    expect(valeurDeLaPremièreLigne).toBeInTheDocument()

    const annéeDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: '2020' })
    expect(annéeDeLaDeuxièmeLigne).toBeInTheDocument()
    const valeurDeLaDeuxièmeLigne = within(lignes[2]).getByRole('cell', { name: valeurIndicateur2 })
    expect(valeurDeLaDeuxièmeLigne).toBeInTheDocument()

    const annéeDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: '2021' })
    expect(annéeDeLaTroisièmeLigne).toBeInTheDocument()
    const valeurDeLaTroisièmeLigne = within(lignes[3]).getByRole('cell', { name: valeurIndicateur3 })
    expect(valeurDeLaTroisièmeLigne).toBeInTheDocument()
  })

  it.each(
    [
      [0, null, 0.97, 1.016],
      [1, 0.70, null, 0.67],
      [2, 0.04, 0.155, null],
      [3, null, 0.94, 0.96],
      [4, 340, null, 300],
      [5, 87, 90, null],
      [6, null, 994, 990],
    ]
  )('affiche un tableau descriptif avec deux années après un click sur "Afficher la transcription"', (identifiant, valeurIndicateur1, valeurIndicateur2, valeurIndicateur3) => {
    const établissementTerritorialMédicoSocial = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [
        {
          année: 2019,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: valeurIndicateur1,
          fileActivePersonnesAccompagnées: valeurIndicateur1,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: valeurIndicateur1,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: valeurIndicateur1,
          tauxOccupationHébergementPermanent: valeurIndicateur1,
          tauxOccupationHébergementTemporaire: valeurIndicateur1,
          tauxRéalisationActivité: valeurIndicateur1,
        },
        {
          année: 2020,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: valeurIndicateur2,
          fileActivePersonnesAccompagnées: valeurIndicateur2,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: valeurIndicateur2,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: valeurIndicateur2,
          tauxOccupationHébergementPermanent: valeurIndicateur2,
          tauxOccupationHébergementTemporaire: valeurIndicateur2,
          tauxRéalisationActivité: valeurIndicateur2,
        },
        {
          année: 2021,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: valeurIndicateur3,
          fileActivePersonnesAccompagnées: valeurIndicateur3,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: valeurIndicateur3,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: valeurIndicateur3,
          tauxOccupationHébergementPermanent: valeurIndicateur3,
          tauxOccupationHébergementTemporaire: valeurIndicateur3,
          tauxRéalisationActivité: valeurIndicateur3,
        },
      ],
      identité: {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie : '1',
        adresseTypeVoie : 'RTE',
        adresseVoie : 'DE VEYZIAT',
        catégorieÉtablissement : '300',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        estMonoÉtablissement: false,
        libelléCatégorieÉtablissement : 'Ecoles Formant aux Professions Sanitaires',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010005239',
        numéroFinessÉtablissementTerritorial: '010003598',
        raisonSociale : 'IFAS CH DU HAUT BUGEY',
        raisonSocialeDeLEntitéDeRattachement : 'CH DU HAUT BUGEY',
        statutJuridique : 'Etablissement Public Intercommunal d’Hospitalisation',
        typeÉtablissement : 'S',
        téléphone : '0123456789',
      },
    }, wording, paths)
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const transcription = within(indicateurs[identifiant]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

    // WHEN
    fireEvent.click(transcription)

    // THEN
    const tableau = within(indicateurs[identifiant]).getByRole('table')
    const rowgroup = within(tableau).getAllByRole('rowgroup')
    const lignes = within(rowgroup[1]).getAllByRole('row')
    expect(lignes).toHaveLength(2)
  })

  it.each(
    [
      [0, null, null, 1.016],
      [1, 0.70, null, null],
      [2, null, 0.155, null],
      [3, null, null, 0.96],
      [4, 340, null, null],
      [5, null, 90, null],
      [6, null, null, 990],
    ]
  )('affiche un tableau descriptif avec une seule année après un click sur "Afficher la transcription"', (identifiant, valeurIndicateur1, valeurIndicateur2, valeurIndicateur3) => {
    const établissementTerritorialMédicoSocial = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [
        {
          année: 2019,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: valeurIndicateur1,
          fileActivePersonnesAccompagnées: valeurIndicateur1,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: valeurIndicateur1,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: valeurIndicateur1,
          tauxOccupationHébergementPermanent: valeurIndicateur1,
          tauxOccupationHébergementTemporaire: valeurIndicateur1,
          tauxRéalisationActivité: valeurIndicateur1,
        },
        {
          année: 2020,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: valeurIndicateur2,
          fileActivePersonnesAccompagnées: valeurIndicateur2,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: valeurIndicateur2,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: valeurIndicateur2,
          tauxOccupationHébergementPermanent: valeurIndicateur2,
          tauxOccupationHébergementTemporaire: valeurIndicateur2,
          tauxRéalisationActivité: valeurIndicateur2,
        },
        {
          année: 2021,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: valeurIndicateur3,
          fileActivePersonnesAccompagnées: valeurIndicateur3,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: valeurIndicateur3,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: valeurIndicateur3,
          tauxOccupationHébergementPermanent: valeurIndicateur3,
          tauxOccupationHébergementTemporaire: valeurIndicateur3,
          tauxRéalisationActivité: valeurIndicateur3,
        },
      ],
      identité: {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie : '1',
        adresseTypeVoie : 'RTE',
        adresseVoie : 'DE VEYZIAT',
        catégorieÉtablissement : '300',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        estMonoÉtablissement: false,
        libelléCatégorieÉtablissement : 'Ecoles Formant aux Professions Sanitaires',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010005239',
        numéroFinessÉtablissementTerritorial: '010003598',
        raisonSociale : 'IFAS CH DU HAUT BUGEY',
        raisonSocialeDeLEntitéDeRattachement : 'CH DU HAUT BUGEY',
        statutJuridique : 'Etablissement Public Intercommunal d’Hospitalisation',
        typeÉtablissement : 'S',
        téléphone : '0123456789',
      },
    }, wording, paths)
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const transcription = within(indicateurs[identifiant]).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION })

    // WHEN
    fireEvent.click(transcription)

    // THEN
    const tableau = within(indicateurs[identifiant]).getByRole('table')
    const rowgroup = within(tableau).getAllByRole('rowgroup')
    const lignes = within(rowgroup[1]).getAllByRole('row')
    expect(lignes).toHaveLength(1)
  })

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0, 'CNSA', 'Caisse Nationale de Solidarité pour l‘Autonomie'],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, 'CNSA', 'Caisse Nationale de Solidarité pour l‘Autonomie'],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2, 'CNSA', 'Caisse Nationale de Solidarité pour l‘Autonomie'],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 3, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6, 'TdB Perf', 'Tableau de Bord de la Performance dans le secteur médico-social'],
    ]
  )('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails"', (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
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

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, null, 1, 1, 1, 1, 1, 1],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, null, 1, 1, 1, 1, 1],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 1, 1, null, 1, 1, 1, 1],
      [wording.TAUX_RÉALISATION_ACTIVITÉ, 1, 1, 1, null, 1, 1, 1],
      [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 1, 1, 1, 1, null, 1, 1],
      [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 1, 1, 1, 1, 1, null, 1],
      [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 1, 1, 1, 1, 1, 1, null],
    ]
  )('n’affiche pas l’indicateur quand sa valeur est vide', (
    titreSection,
    indicateur1,
    indicateur2,
    indicateur3,
    indicateur4,
    indicateur5,
    indicateur6,
    indicateur7
  ) => {
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [
        {
          année: 2019,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: indicateur7,
          fileActivePersonnesAccompagnées: indicateur5,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: indicateur6,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: indicateur3,
          tauxOccupationHébergementPermanent: indicateur1,
          tauxOccupationHébergementTemporaire: indicateur2,
          tauxRéalisationActivité: indicateur4,
        },
        {
          année: 2020,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: indicateur7,
          fileActivePersonnesAccompagnées: indicateur5,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: indicateur6,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: indicateur3,
          tauxOccupationHébergementPermanent: indicateur1,
          tauxOccupationHébergementTemporaire: indicateur2,
          tauxRéalisationActivité: indicateur4,
        },
        {
          année: 2021,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: indicateur7,
          fileActivePersonnesAccompagnées: indicateur5,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: indicateur6,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: indicateur3,
          tauxOccupationHébergementPermanent: indicateur1,
          tauxOccupationHébergementTemporaire: indicateur2,
          tauxRéalisationActivité: indicateur4,
        },
      ],
      identité: {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie : '1',
        adresseTypeVoie : 'RTE',
        adresseVoie : 'DE VEYZIAT',
        catégorieÉtablissement : '300',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        estMonoÉtablissement: false,
        libelléCatégorieÉtablissement : 'Ecoles Formant aux Professions Sanitaires',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010005239',
        numéroFinessÉtablissementTerritorial: '010003598',
        raisonSociale : 'IFAS CH DU HAUT BUGEY',
        raisonSocialeDeLEntitéDeRattachement : 'CH DU HAUT BUGEY',
        statutJuridique : 'Etablissement Public Intercommunal d’Hospitalisation',
        typeÉtablissement : 'S',
        téléphone : '0123456789',
      },
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).queryAllByRole('listitem')
    expect(indicateurs).toHaveLength(6)
    const liste = within(activité).getByRole('list')
    const titre = within(liste).queryByText(titreSection, { selector: 'p' })
    expect(titre).not.toBeInTheDocument()
  })

  it('affiche une phrase à la place des indicateurs lorsque des activités sont renseignées mais les indicateurs sont vides', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [
        {
          année: 2019,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: null,
          fileActivePersonnesAccompagnées: null,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: null,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: null,
          tauxOccupationHébergementPermanent: null,
          tauxOccupationHébergementTemporaire: null,
          tauxRéalisationActivité: null,
        },
        {
          année: 2020,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: null,
          fileActivePersonnesAccompagnées: null,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: null,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: null,
          tauxOccupationHébergementPermanent: null,
          tauxOccupationHébergementTemporaire: null,
          tauxRéalisationActivité: null,
        },
        {
          année: 2021,
          dateMiseAJourSource: '2021-07-07',
          duréeMoyenneSéjourAccompagnementPersonnesSorties: null,
          fileActivePersonnesAccompagnées: null,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: null,
          numéroFinessÉtablissementTerritorial: '010003598',
          tauxOccupationAccueilDeJour: null,
          tauxOccupationHébergementPermanent: null,
          tauxOccupationHébergementTemporaire: null,
          tauxRéalisationActivité: null,
        },
      ],
      identité: {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie : '1',
        adresseTypeVoie : 'RTE',
        adresseVoie : 'DE VEYZIAT',
        catégorieÉtablissement : '300',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        estMonoÉtablissement: false,
        libelléCatégorieÉtablissement : 'Ecoles Formant aux Professions Sanitaires',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010005239',
        numéroFinessÉtablissementTerritorial: '010003598',
        raisonSociale : 'IFAS CH DU HAUT BUGEY',
        raisonSocialeDeLEntitéDeRattachement : 'CH DU HAUT BUGEY',
        statutJuridique : 'Etablissement Public Intercommunal d’Hospitalisation',
        typeÉtablissement : 'S',
        téléphone : '0123456789',
      },
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const phrase = within(activité).getByText(wording.INDICATEURS_VIDES)
    expect(phrase).toBeInTheDocument()
  })

  it('n’affiche pas le bloc activité si aucune activité n’est renseignée', () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: [],
      identité: {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie : '1',
        adresseTypeVoie : 'RTE',
        adresseVoie : 'DE VEYZIAT',
        catégorieÉtablissement : '300',
        courriel : 'a@example.com',
        dateMiseAJourSource : '2021-07-07',
        estMonoÉtablissement: false,
        libelléCatégorieÉtablissement : 'Ecoles Formant aux Professions Sanitaires',
        numéroFinessEntitéJuridique : '010008407',
        numéroFinessÉtablissementPrincipal : '010005239',
        numéroFinessÉtablissementTerritorial: '010003598',
        raisonSociale : 'IFAS CH DU HAUT BUGEY',
        raisonSocialeDeLEntitéDeRattachement : 'CH DU HAUT BUGEY',
        statutJuridique : 'Etablissement Public Intercommunal d’Hospitalisation',
        typeÉtablissement : 'S',
        téléphone : '0123456789',
      },
    }, wording, paths)

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansActivité} />)

    // THEN
    const activité = screen.queryByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    expect(activité).not.toBeInTheDocument()
  })
})
