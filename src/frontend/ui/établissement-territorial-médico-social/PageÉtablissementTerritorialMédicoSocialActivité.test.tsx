import { screen, within } from '@testing-library/react'

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
    const dateMiseAJour = within(indicateurs[0]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[0]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })

  it('affiche le taux d’occupation en hébergement temporaire', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementTemporaire = within(indicateurs[1]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, { selector: 'p' })
    expect(tauxOccupationHébergementTemporaire).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[1]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[1]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })

  it('affiche le taux d’occupation en accueil de jour', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const tauxOccupationHébergementAccueilDeJour = within(indicateurs[2]).getByText(wording.TAUX_OCCUPATION_HÉBERGEMENT_ACCUEIL_DE_JOUR, { selector: 'p' })
    expect(tauxOccupationHébergementAccueilDeJour).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[2]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[2]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
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
  })

  it('affiche la file active des personnes accompagnées sur la période', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const fileActiveDesPersonnesAccompagnéesSurLaPériode = within(indicateurs[4]).getByText(wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES_SUR_PERIODE, { selector: 'p' })
    expect(fileActiveDesPersonnesAccompagnéesSurLaPériode).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[4]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[4]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })

  it('affiche le nombre moyen de journées d’absence des personnes accompagnées sur la période', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const nombreMoyenDeJournéesDAbsenceDesPersonnesAccompagnéesSurLaPériode = within(indicateurs[5]).getByText(wording.NOMBRE_MOYEN_JOURNÉE_ABSENCE_PERSONNES_ACCOMPAGNÉES_SUR_PERIODE, { selector: 'p' })
    expect(nombreMoyenDeJournéesDAbsenceDesPersonnesAccompagnéesSurLaPériode).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[5]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[5]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })

  it('affiche la durée moyenne de séjour/d’accompagnement des personnes sorties définitivement au cours de l’année', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const activité = screen.getByRole('region', { name: wording.TITRE_BLOC_ACTIVITÉ })
    const indicateurs = within(activité).getAllByRole('listitem')
    const duréeMoyenneSéjourEtAccompagnementDesPersonnesSortiesDéfinitivementAuCoursDeLAnnée = within(indicateurs[6]).getByText(wording.DURÉE_MOEYNNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, { selector: 'p' })
    expect(duréeMoyenneSéjourEtAccompagnementDesPersonnesSortiesDéfinitivementAuCoursDeLAnnée).toBeInTheDocument()
    const dateMiseAJour = within(indicateurs[6]).getByText('Mise à jour : 07/07/2021 - Source :', { selector: 'p' })
    expect(dateMiseAJour).toBeInTheDocument()
    const abréviation = within(indicateurs[6]).getByText('DIAMANT', { selector: 'abbr' })
    expect(abréviation).toHaveAttribute('title', 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation')
  })
})
