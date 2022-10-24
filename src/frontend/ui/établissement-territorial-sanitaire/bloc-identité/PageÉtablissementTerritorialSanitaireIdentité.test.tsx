import { fireEvent, screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent, textMatch } from '../../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from '../PageÉtablissementTerritorialSanitaire'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial sanitaire - bloc identité', () => {
  const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths)

  it('affiche le titre dans l’onglet', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    expect(document.title).toBe(établissementTerritorialSanitaireViewModel.titre)
  })

  it('affiche le titre : "ET - numéro de FINESS - nom de l’établissement"', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: 'ET - 010 000 040 - CH NANTUA' })
    expect(titre).toBeInTheDocument()
  })

  it('affiche le bouton pour imprimer', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const imprimer = screen.getByRole('button', { name: 'Télécharger en PDF' })
    expect(imprimer).toHaveAttribute('type', 'button')
  })

  it('j’imprime quand je clique sur le bouton d’impression', () => {
    // GIVEN
    jest.spyOn(window, 'print').mockImplementation()
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)
    const imprimer = screen.getByRole('button', { name: 'Télécharger en PDF' })

    // WHEN
    fireEvent.click(imprimer)

    // THEN
    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it('affiche le nom de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelÉtablissement = within(indicateurs[0]).getByText(textMatch(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelÉtablissement).toBeInTheDocument()
    const abréviationFiness = within(indicateurs[0]).getByText('FINESS', { selector: 'abbr' })
    expect(abréviationFiness).toHaveAttribute('title', wording.FINESS_TITLE)
    const nomDeLÉtablissement = within(indicateurs[0]).getByText('CH NANTUA', { selector: 'p' })
    expect(nomDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le numéro FINESS', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelNuméroFiness = within(indicateurs[1]).getByText(textMatch(`${wording.NUMÉRO_FINESS} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelNuméroFiness).toBeInTheDocument()
    const numéroFiness = within(indicateurs[1]).getByText('010 000 040', { selector: 'p' })
    expect(numéroFiness).toBeInTheDocument()
  })

  it('affiche l’adresse', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelAdresse = within(indicateurs[2]).getByText(textMatch(`${wording.ADRESSE} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelAdresse).toBeInTheDocument()
    const adresse = within(indicateurs[2]).getByText('50 R PAUL PAINLEVE 01130 NANTUA', { selector: 'p' })
    expect(adresse).toBeInTheDocument()
  })

  it('affiche le téléphone et e-mail', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelTéléphoneEtEmail = within(indicateurs[3]).getByText(textMatch(`${wording.TÉLÉPHONE_ET_EMAIL} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelTéléphoneEtEmail).toBeInTheDocument()
    const téléphoneEtEmail = within(indicateurs[3]).getByText('04 74 75 48 00 | a@example.com', { selector: 'p' })
    expect(téléphoneEtEmail).toBeInTheDocument()
  })

  it('affiche un lien pour naviguer vers l’entité juridique de rattachement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelEntitéJuridiqueDeRattachement = within(indicateurs[4]).getByText(textMatch(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelEntitéJuridiqueDeRattachement).toBeInTheDocument()
    const entitéJuridiqueDeRattachement = within(indicateurs[4]).getByRole('link', { name: 'EJ - 010 008 407 - HOPITAL PRIVE DE VILLENEUVE DASCQ' })
    expect(entitéJuridiqueDeRattachement).toHaveAttribute('href', '/entite-juridique/010008407')
  })

  it('affiche la catégorie de l’établissement avec son libellé', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelCatégorieDeLÉtablissement = within(indicateurs[5]).getByText(textMatch(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelCatégorieDeLÉtablissement).toBeInTheDocument()
    const catégorieDeLÉtablissement = within(indicateurs[5]).getByText('355 - Centre Hospitalier (C.H.)', { selector: 'p' })
    expect(catégorieDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le statut de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelStatutÉtablissement = within(indicateurs[6]).getByText(textMatch(`${wording.STATUT_JURIDIQUE_EJ} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
    expect(labelStatutÉtablissement).toBeInTheDocument()
    const statutÉtablissement = within(indicateurs[6]).getByText('Société Anonyme (S.A.)')
    expect(statutÉtablissement).toBeInTheDocument()
  })

  it('n’affiche que 7 mises à jour et sources de données', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const majEtSource = within(ficheDIdentité).getAllByText(`${wording.miseÀJour('07/07/2021')} - Source :`)
    expect(majEtSource).toHaveLength(7)
  })

  it('affiche sept indicateurs en tout', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    expect(indicateurs).toHaveLength(7)
  })

  describe('affiche "non renseigné" quand une valeur est vide', () => {
    it('pour le téléphone', () => {
      // GIVEN
      const établissementTerritorialSansTéléphone = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        téléphone: {
          dateMiseÀJourSource: '2022-05-14',
          value: '',
        },
      })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansTéléphone} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphoneEtEmail = within(indicateurs[3]).getByText(`${wording.NON_RENSEIGNÉ} | a@example.com`, { selector: 'p' })
      expect(téléphoneEtEmail).toBeInTheDocument()
    })

    it('pour l’e-mail', () => {
      // GIVEN
      const établissementTerritorialSansEMail = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        courriel: {
          dateMiseÀJourSource: '2022-05-14',
          value: '',
        },
      })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansEMail} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphoneEtEmail = within(indicateurs[3]).getByText(`04 74 75 48 00 | ${wording.NON_RENSEIGNÉ}`, { selector: 'p' })
      expect(téléphoneEtEmail).toBeInTheDocument()
    })
  })

  it('affiche l’adresse incomplète lorsqu’il manque des champs d’adresse', () => {
    // GIVEN
    const établissementTerritorialSansAdresseVoie = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
      adresseVoie: {
        dateMiseÀJourSource: '2022-05-14',
        value: '',
      },
    })

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansAdresseVoie} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const adresseIncomplète = within(indicateurs[2]).getByText('50 R 01130 NANTUA', { selector: 'p' })
    expect(adresseIncomplète).toBeInTheDocument()
  })
})
