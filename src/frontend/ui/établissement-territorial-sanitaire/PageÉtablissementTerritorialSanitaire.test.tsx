import { screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorialSanitaire } from './PageÉtablissementTerritorialSanitaire'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial sanitaire', () => {
  const établissementTerritorialSanitaire = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording)

  it('affiche le titre : "ET - numéro de FINESS - nom de l’établissement"', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: 'ET - 010 000 040 - CH NANTUA' })
    expect(titre).toBeInTheDocument()
  })

  it('affiche le nom de l’établissement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelÉtablissement = within(indicateurs[0]).getByText(`${wording.NOM_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelÉtablissement.textContent).toBe(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const abréviationFiness = within(indicateurs[0]).getByText('FINESS', { selector: 'abbr' })
    expect(abréviationFiness).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const nomDeLÉtablissement = within(indicateurs[0]).getByText('CH NANTUA', { selector: 'p' })
    expect(nomDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le numéro FINESS dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelNuméroFiness = within(indicateurs[1]).getByText('Numéro', { exact: false, selector: 'p' })
    expect(labelNuméroFiness.textContent).toBe(`${wording.NUMÉRO_FINESS} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const numéroFiness = within(indicateurs[1]).getByText('010 000 040', { selector: 'p' })
    expect(numéroFiness).toBeInTheDocument()
  })

  it('affiche l’adresse dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelAdresse = within(indicateurs[2]).getByText(`${wording.ADRESSE} -`, { selector: 'p' })
    expect(labelAdresse.textContent).toBe(`${wording.ADRESSE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const adresse = within(indicateurs[2]).getByText('50 R PAUL PAINLEVE 01130 NANTUA', { selector: 'p' })
    expect(adresse).toBeInTheDocument()
  })

  it('affiche le téléphone et e-mail dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelTéléphoneEtEmail = within(indicateurs[3]).getByText(`${wording.TÉLÉPHONE_ET_EMAIL} -`, { selector: 'p' })
    expect(labelTéléphoneEtEmail.textContent).toBe(`${wording.TÉLÉPHONE_ET_EMAIL} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const téléphoneEtEmail = within(indicateurs[3]).getByText('04 74 75 48 00 | a@example.com', { selector: 'p' })
    expect(téléphoneEtEmail).toBeInTheDocument()
  })

  it('affiche l’entité juridique de rattachement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelEntitéJuridiqueDeRattachement = within(indicateurs[4]).getByText(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} -`, { selector: 'p' })
    expect(labelEntitéJuridiqueDeRattachement.textContent).toBe(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const entitéJuridiqueDeRattachement = within(indicateurs[4]).getByText('EJ - 010 008 407 - HOPITAL PRIVE DE VILLENEUVE DASCQ', { selector: 'p' })
    expect(entitéJuridiqueDeRattachement).toBeInTheDocument()
  })

  it('affiche la catégorie de l’établissement dans le bloc identité avec son libellé', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelCatégorieDeLÉtablissement = within(indicateurs[5]).getByText(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelCatégorieDeLÉtablissement.textContent).toBe(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const catégorieDeLÉtablissement = within(indicateurs[5]).getByText('355 - Centre Hospitalier (C.H.)', { selector: 'p' })
    expect(catégorieDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le nom du directeur dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelNomDuDirecteur = within(indicateurs[6]).getByText(wording.NOM_DU_DIRECTEUR, { selector: 'p' })
    expect(labelNomDuDirecteur.textContent).toBe(wording.NOM_DU_DIRECTEUR)
    const indicateurÀVenir = within(indicateurs[6]).getByText('À venir', { selector: 'p' })
    expect(indicateurÀVenir).toBeInTheDocument()
  })

  it('affiche le statut de l’établissement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelStatutÉtablissement = within(indicateurs[7]).getByText(`${wording.STATUT_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelStatutÉtablissement.textContent).toBe(`${wording.STATUT_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const statutÉtablissement = within(indicateurs[7]).getByText('Société Anonyme (S.A.)')
    expect(statutÉtablissement).toBeInTheDocument()
  })

  it('n’affiche que 7 mises à jour et sources de données dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const majEtSource = within(ficheDIdentité).getAllByText(`${wording.MISE_À_JOUR} : 07/07/2021 - Source :`, { exact: false })
    expect(majEtSource).toHaveLength(7)
  })

  it('affiche un indicateur à venir dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const majEtSource = within(ficheDIdentité).getAllByText('À venir')
    expect(majEtSource).toHaveLength(1)
  })

  describe('affiche "non renseigné" quand une valeur est vide', () => {
    it('pour le téléphone', () => {
      // GIVEN
      const établissementTerritorialSansTéléphone = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, { téléphone: '' })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansTéléphone} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphoneEtEmail = within(indicateurs[3]).getByText(`${wording.NON_RENSEIGNÉ} | a@example.com`, { selector: 'p' })
      expect(téléphoneEtEmail).toBeInTheDocument()
    })

    it('pour l’e-mail', () => {
      // GIVEN
      const établissementTerritorialSansEMail = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, { courriel: '' })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansEMail} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphoneEtEmail = within(indicateurs[3]).getByText(`04 74 75 48 00 | ${wording.NON_RENSEIGNÉ}`, { selector: 'p' })
      expect(téléphoneEtEmail).toBeInTheDocument()
    })
  })

  it('affiche l’adresse incomplète lorsqu’il manque des champs d’adresse', () => {
    // GIVEN
    const établissementTerritorialSansAdresseVoie = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, { adresseVoie: '' })

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSansAdresseVoie} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const adresseIncomplète = within(indicateurs[2]).getByText('50 R 01130 NANTUA', { selector: 'p' })
    expect(adresseIncomplète).toBeInTheDocument()
  })

  it('affiche le titre dans l’onglet', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialSanitaire} />)

    // THEN
    expect(document.title).toBe(établissementTerritorialSanitaire.titre)
  })
})
