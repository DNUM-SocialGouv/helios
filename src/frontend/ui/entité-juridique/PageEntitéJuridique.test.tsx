import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, nodeReactChildMatcher, renderFakeComponent, trimHtml } from '../../testHelper'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import { PageEntitéJuridique } from './PageEntitéJuridique'

const { wording } = fakeFrontDependencies

describe('La page Entité Juridique', () => {
  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel({
    adresseAcheminement: '22023 ST BRIEUC CEDEX 1',
    adresseNuméroVoie: '10',
    adresseTypeVoie: 'Rue',
    adresseVoie: 'Marcel Proust',
    dateMiseAJourSource: '2021-07-07',
    libelléStatutJuridique: 'Public',
    numéroFinessEntitéJuridique: '220000020',
    raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
    téléphone: '0296017123',
  })

  it('affiche le nom de l’établissement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelÉtablissement = within(indicateurs[0]).getByText(`${wording.NOM_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelÉtablissement.textContent).toBe(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const nomDeLÉtablissement = within(indicateurs[0]).getByText('CENTRE HOSPITALIER DE SAINT BRIEUC', { selector: 'p' })
    expect(nomDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le numéro FINESS dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelNuméroFINESS = within(indicateurs[1]).getByText('Numéro', { exact: false, selector: 'p' })
    expect(labelNuméroFINESS.textContent).toBe(`${trimHtml(wording.NUMÉRO_FINESS)} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const numéroFINESS = within(indicateurs[1]).getByText('220 000 020', { selector: 'p' })
    expect(numéroFINESS).toBeInTheDocument()
  })

  it('affiche l’adresse dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelAdresse = within(indicateurs[2]).getByText(`${wording.ADRESSE} -`, { selector: 'p' })
    expect(labelAdresse.textContent).toBe(`${wording.ADRESSE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const adresse = within(indicateurs[2]).getByText('10 Rue Marcel Proust 22023 ST BRIEUC CEDEX 1', { selector: 'p' })
    expect(adresse).toBeInTheDocument()
  })

  it('affiche le téléphone dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelTéléphone = within(indicateurs[3]).getByText(`${wording.TÉLÉPHONE} -`, { selector: 'p' })
    expect(labelTéléphone.textContent).toBe(`${wording.TÉLÉPHONE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const téléphone = within(indicateurs[3]).getByText('02 96 01 71 23', { selector: 'p' })
    expect(téléphone).toBeInTheDocument()
  })

  it('affiche le nom du directeur dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelNomDuDirecteur = within(indicateurs[4]).getByText(wording.NOM_DU_DIRECTEUR, { selector: 'p' })
    expect(labelNomDuDirecteur.textContent).toBe(wording.NOM_DU_DIRECTEUR)
    const indicateurÀVenir = within(indicateurs[4]).getByText('À venir', { selector: 'p' })
    expect(indicateurÀVenir).toBeInTheDocument()
  })

  it('affiche le statut de l’établissement dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelStatutÉtablissement = within(indicateurs[5]).getByText(`${wording.STATUT_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelStatutÉtablissement.textContent).toBe(`${wording.STATUT_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const statutÉtablissement = within(indicateurs[5]).getByText('Public')
    expect(statutÉtablissement).toBeInTheDocument()
  })

  it('affiche la date d’entrée en vigueur du CPOM dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelDateDEntréeEnVigueurDuCPOM = within(indicateurs[6]).getByText(nodeReactChildMatcher(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM))
    expect(labelDateDEntréeEnVigueurDuCPOM).toBeInTheDocument()
    expect(labelDateDEntréeEnVigueurDuCPOM.textContent).toBe(trimHtml(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM))
    const indicateurÀVenir = within(indicateurs[6]).getByText('À venir')
    expect(indicateurÀVenir).toBeInTheDocument()
  })

  it('affiche ne devrait afficher que 5 mises à jour et sources de données dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const majEtSource = within(ficheDIdentité).getAllByText(`${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    expect(majEtSource).toHaveLength(5)
  })

  it('affiche devrait avoir deux indicateurs à venir dans le bloc identité', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const majEtSource = within(ficheDIdentité).getAllByText('À venir')
    expect(majEtSource).toHaveLength(2)
  })
})
