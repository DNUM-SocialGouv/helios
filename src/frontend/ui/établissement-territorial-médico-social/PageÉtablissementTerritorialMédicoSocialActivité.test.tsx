import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestFactory } from '../../test-factories/ÉtablissementTerritorialMédicoSocialViewModelTestFactory'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial - Bloc activité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestFactory.créeÉtablissementTerritorialViewModel(wording)

  it('affiche le taux d’occupation en hébergement permanent', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementPermanent = within(indicateurs[0]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, { selector: 'p' })
    expect(tauxOccupationHébergementPermanent).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[0]).getAllByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const abréviation = within(indicateurs[0]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[0]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-1')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le taux d’occupation en hébergement temporaire', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementTemporaire = within(indicateurs[1]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, { selector: 'p' })
    expect(tauxOccupationHébergementTemporaire).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[1]).getAllByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const abréviation = within(indicateurs[1]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[1]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-2')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le taux d’occupation en accueil de jour', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementAccueilDeJour = within(indicateurs[2]).getByText(wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, { selector: 'p' })
    expect(tauxOccupationHébergementAccueilDeJour).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[2]).getAllByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour[0]).toBeInTheDocument()
    const abréviation = within(indicateurs[2]).getAllByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation[0]).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[2]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-3')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le taux de réalisation de l’activité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationRéalisationActivité = within(indicateurs[3]).getByText(wording.TAUX_RÉALISATION_ACTIVITÉ, { selector: 'p' })
    expect(tauxOccupationRéalisationActivité).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[3]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[3]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[3]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-4')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche la file active des personnes accompagnées sur la période', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const fileActiveDesPersonnesAccompagnéesSurLaPériode = within(indicateurs[4]).getByText(wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, { selector: 'p' })
    expect(fileActiveDesPersonnesAccompagnéesSurLaPériode).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[4]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[4]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[4]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-5')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche le nombre moyen de journées d’absence des personnes accompagnées sur la période', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const nombreMoyenDeJournéesDAbsenceDesPersonnesAccompagnéesSurLaPériode = within(indicateurs[5]).getByText(wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, { selector: 'p' })
    expect(nombreMoyenDeJournéesDAbsenceDesPersonnesAccompagnéesSurLaPériode).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[5]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[5]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[5]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-6')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it('affiche la durée moyenne de séjour/d’accompagnement des personnes sorties définitivement au cours de l’année', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const duréeMoyenneSéjourEtAccompagnementDesPersonnesSortiesDéfinitivementAuCoursDeLAnnée = within(indicateurs[6]).getByText(wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, { selector: 'p' })
    expect(duréeMoyenneSéjourEtAccompagnementDesPersonnesSortiesDéfinitivementAuCoursDeLAnnée).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[6]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[6]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
    const détails = within(indicateurs[6]).getByRole('button', { name: wording.DÉTAILS })
    expect(détails).toHaveAttribute('aria-controls', 'nom-info-bulle-activite-7')
    expect(détails).toHaveAttribute('data-fr-opened', 'false')
  })

  it.each(
    [
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0],
      [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1],
      [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2],
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
