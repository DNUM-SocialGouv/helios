import { screen, within } from '@testing-library/react'

import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent, trimHtml } from '../../testHelper'
import { PageÉtablissementTerritorialMédicoSocial } from './PageÉtablissementTerritorialMédicoSocial'

const { paths, wording } = fakeFrontDependencies

describe('La page établissement territorial - bloc identité', () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths)

  it('affiche le titre : "ET - numéro de FINESS - nom de l’établissement"', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: 'ET - 010 003 598 - IFAS CH DU HAUT BUGEY' })
    expect(titre).toBeInTheDocument()
  })

  it('affiche le nom de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelÉtablissement = within(indicateurs[0]).getByText(`${wording.NOM_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelÉtablissement.textContent).toBe(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const abréviationFiness = within(indicateurs[0]).getByText('FINESS', { selector: 'abbr' })
    expect(abréviationFiness).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
    const nomDeLÉtablissement = within(indicateurs[0]).getByText('IFAS CH DU HAUT BUGEY', { selector: 'p' })
    expect(nomDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le numéro FINESS', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelNuméroFiness = within(indicateurs[1]).getByText('Numéro', { exact: false, selector: 'p' })
    expect(labelNuméroFiness.textContent).toBe(`${wording.NUMÉRO_FINESS} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const numéroFiness = within(indicateurs[1]).getByText('010 003 598', { selector: 'p' })
    expect(numéroFiness).toBeInTheDocument()
  })

  it('affiche l’adresse', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelAdresse = within(indicateurs[2]).getByText(`${wording.ADRESSE} -`, { selector: 'p' })
    expect(labelAdresse.textContent).toBe(`${wording.ADRESSE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const adresse = within(indicateurs[2]).getByText('1 RTE DE VEYZIAT 01117 OYONNAX CEDEX', { selector: 'p' })
    expect(adresse).toBeInTheDocument()
  })

  it('affiche le téléphone et e-mail', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelTéléphoneEtEmail = within(indicateurs[3]).getByText(`${wording.TÉLÉPHONE_ET_EMAIL} -`, { selector: 'p' })
    expect(labelTéléphoneEtEmail.textContent).toBe(`${wording.TÉLÉPHONE_ET_EMAIL} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const téléphoneEtEmail = within(indicateurs[3]).getByText('01 23 45 67 89 | a@example.com', { selector: 'p' })
    expect(téléphoneEtEmail).toBeInTheDocument()
  })

  it('affiche un lien pour naviguer vers l’entité juridique de rattachement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelEntitéJuridiqueDeRattachement = within(indicateurs[4]).getByText(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} -`, { selector: 'p' })
    expect(labelEntitéJuridiqueDeRattachement.textContent).toBe(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const entitéJuridiqueDeRattachement = within(indicateurs[4]).getByRole('link', { name: 'EJ - 010 008 407 - CH DU HAUT BUGEY' })
    expect(entitéJuridiqueDeRattachement).toHaveAttribute('href', '/entite-juridique/010008407')
  })

  it('affiche la catégorie de l’établissement avec son libellé', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelCatégorieDeLÉtablissement = within(indicateurs[5]).getByText(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelCatégorieDeLÉtablissement.textContent).toBe(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const catégorieDeLÉtablissement = within(indicateurs[5]).getByText('300 - Ecoles Formant aux Professions Sanitaires', { selector: 'p' })
    expect(catégorieDeLÉtablissement).toBeInTheDocument()
  })

  it('affiche le statut de l’établissement', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelStatutÉtablissement = within(indicateurs[6]).getByText(`${wording.STATUT_JURIDIQUE_EJ} -`, { selector: 'p' })
    expect(labelStatutÉtablissement.textContent).toBe(`${wording.STATUT_JURIDIQUE_EJ} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const statutÉtablissement = within(indicateurs[6]).getByText('Etablissement Public Intercommunal d’Hospitalisation')
    expect(statutÉtablissement).toBeInTheDocument()
  })

  it('affiche l’indicateur de mono-établissement', () => {
    // GIVEN
    const établissementTerritorialMonoÉtablissement =
      ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        estMonoÉtablissement: {
          dateMiseÀJourSource: '2021-07-07',
          value: true,
        },
      })

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMonoÉtablissement} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelMonoÉtablissement = within(indicateurs[7]).getByText(`${wording.MONO_ÉTABLISSEMENT} -`, { selector: 'p' })
    expect(labelMonoÉtablissement.textContent).toBe(`${wording.MONO_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
    const monoÉtablissement = within(indicateurs[7]).getByText(wording.OUI)
    expect(monoÉtablissement).toBeInTheDocument()
  })

  describe('l’indicateur d’établissement principal ou secondaire', () => {
    it('affiche "Principal" si l’établissement est un établissement principal', () => {
      // GIVEN
      const établissementTerritorialPrincipal = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        typeÉtablissement: {
          dateMiseÀJourSource: '2022-05-14',
          value: 'P',
        },
      })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialPrincipal} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelÉtablissementPrincipalOuSecondaire = within(indicateurs[8]).getByText(`${wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE} -`, { selector: 'p' })
      expect(labelÉtablissementPrincipalOuSecondaire.textContent).toBe(`${wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const établissementPrincipalOuSecondaire = within(indicateurs[8]).getByText(wording.PRINCIPAL)
      expect(établissementPrincipalOuSecondaire).toBeInTheDocument()
    })

    it('affiche "Secondaire" et le numéro Finess de l’établissement principal si l’établissement n’est pas un établissement principal', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelÉtablissementPrincipalOuSecondaire = within(indicateurs[8]).getByText(`${wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE} -`, { selector: 'p' })
      expect(labelÉtablissementPrincipalOuSecondaire.textContent).toBe(`${wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const établissementPrincipalOuSecondaire = within(indicateurs[8]).getByText(`${wording.SECONDAIRE} (${wording.PRINCIPAL} : 010 005 239)`)
      expect(établissementPrincipalOuSecondaire).toBeInTheDocument()
    })
  })

  it('affiche la date d’entrée en vigueur du CPOM', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const labelDateDEntréeEnVigueurDuCpom = within(indicateurs[9]).getByText('Date d’entrée en vigueur du -')
    expect(labelDateDEntréeEnVigueurDuCpom).toBeInTheDocument()
    expect(labelDateDEntréeEnVigueurDuCpom.textContent).toBe(`${trimHtml(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM)} - ${wording.MISE_À_JOUR} : 08/07/2021 - Source : DIAMANT`)
    const abréviationCpom = within(indicateurs[9]).getByText('CPOM', { selector: 'abbr' })
    expect(abréviationCpom).toHaveAttribute('title', 'Contrat Pluriannuel d’Objectifs et de Moyens')
    const indicateurÀVenir = within(indicateurs[9]).getByText('01/01/2021')
    expect(indicateurÀVenir).toBeInTheDocument()
  })

  it('affiche dix indicateurs en tout', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    expect(indicateurs).toHaveLength(10)
  })

  describe('affiche "non renseigné" quand une valeur est vide', () => {
    it('pour le téléphone', () => {
      // GIVEN
      const établissementTerritorialSansTéléphone = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        téléphone: {
          dateMiseÀJourSource: '2022-05-14',
          value: '',
        },
      })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansTéléphone} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphoneEtEmail = within(indicateurs[3]).getByText(`${wording.NON_RENSEIGNÉ} | a@example.com`, { selector: 'p' })
      expect(téléphoneEtEmail).toBeInTheDocument()
    })

    it('pour l’e-mail', () => {
      // GIVEN
      const établissementTerritorialSansCourriel = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        courriel: {
          dateMiseÀJourSource: '2022-05-14',
          value: '',
        },
      })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansCourriel} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphoneEtEmail = within(indicateurs[3]).getByText(`01 23 45 67 89 | ${wording.NON_RENSEIGNÉ}`, { selector: 'p' })
      expect(téléphoneEtEmail).toBeInTheDocument()
    })

    it('pour la date d’entrée en vigueur du cpom', () => {
      // GIVEN
      const établissementTerritorialSansCourriel = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        dateDEntréeEnVigueurDuCpom: {
          dateMiseÀJourSource: '2022-05-14',
          value: '',
        },
      })

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansCourriel} />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      expect(within(indicateurs[9]).getByText(wording.NON_RENSEIGNÉ)).toBeInTheDocument()
    })
  })

  it('affiche l’adresse incomplète lorsqu’il manque des champs d’adresse', () => {
    // GIVEN
    const établissementTerritorialSansAdresseVoie = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
      adresseVoie: {
        dateMiseÀJourSource: '2022-05-14',
        value: '',
      },
    })

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialSansAdresseVoie} />)

    // THEN
    const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
    const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
    const adresseIncomplète = within(indicateurs[2]).getByText('1 RTE 01117 OYONNAX CEDEX', { selector: 'p' })
    expect(adresseIncomplète).toBeInTheDocument()
  })

  it('affiche le titre dans l’onglet', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocial} />)

    // THEN
    expect(document.title).toBe(établissementTerritorialMédicoSocial.titre)
  })
})
