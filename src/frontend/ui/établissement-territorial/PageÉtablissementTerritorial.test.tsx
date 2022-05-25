import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageÉtablissementTerritorial } from './PageÉtablissementTerritorial'
import { ÉtablissementTerritorialViewModel } from './ÉtablissementTerritorialViewModel'

const { wording } = fakeFrontDependencies

describe('La page Établissement territorial', () => {
  const établissementTerritorial = new ÉtablissementTerritorialViewModel({
    adresseAcheminement: '01130 NANTUA',
    adresseNuméroVoie : '50',
    adresseTypeVoie : 'R',
    adresseVoie : 'PAUL PAINLEVE',
    catégorieÉtablissement : '355',
    courriel : 'a@example.com',
    dateMiseAJourSource : '2021-07-07',
    numéroFinessEntitéJuridique : '010008407',
    numéroFinessÉtablissementPrincipal : '010000057',
    numéroFinessÉtablissementTerritorial: '010000040',
    raisonSociale : 'CH NANTUA',
    typeÉtablissement : 'S',
    téléphone : '0474754800',
  })

  it('affiche le nom de l’établissement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorial} />)

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
    renderFakeComponent(<PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorial} />)

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
    renderFakeComponent(<PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorial} />)

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
    renderFakeComponent(<PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelTéléphoneEtEmail = within(indicateurs[3]).getByText(`${wording.TÉLÉPHONE_ET_EMAIL} -`, { selector: 'p' })
    expect(labelTéléphoneEtEmail.textContent).toBe(`${wording.TÉLÉPHONE_ET_EMAIL} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const téléphoneEtEmail = within(indicateurs[3]).getByText('04 74 75 48 00     a@example.com', { collapseWhitespace: false, selector: 'p' })
    expect(téléphoneEtEmail).toBeInTheDocument()
  })

  it.skip('affiche l’entité juridique de rattachement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelEntitéJuridiqueDeRattachement = within(indicateurs[4]).getByText(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} -`, { selector: 'p' })
    expect(labelEntitéJuridiqueDeRattachement.textContent).toBe(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const entitéJuridiqueDeRattachement = within(indicateurs[4]).getByText('EJ - 010 008 407 - ENTITÉ JURIDIQUE', { selector: 'p' })
    expect(entitéJuridiqueDeRattachement).toBeInTheDocument()

  })

  it.todo('affiche la catégorie de l’établissement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelCatégorieDeLÉtablissement = within(indicateurs[5]).getByText(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelCatégorieDeLÉtablissement.textContent).toBe(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const catégorieDeLÉtablissement = within(indicateurs[5]).getByText('355 - Centre Hospitalier (C.H.)', { selector: 'p' })
    expect(catégorieDeLÉtablissement).toBeInTheDocument()
  })

  it.todo('affiche le nom du directeur dans le bloc identité')

  it.todo('affiche le statut de l’établissement dans le bloc identité')

  it.todo('affiche l’indicateur de mono-établissement dans le bloc identité')

  it.todo('affiche l’indicateur de d’établissement principal ou secondaire dans le bloc identité')

  it.todo('affiche le site internet cliquable dans le bloc identité')

  it.todo('affiche la date d’entrée en vigueur du CPOM dans le bloc identité')

})
