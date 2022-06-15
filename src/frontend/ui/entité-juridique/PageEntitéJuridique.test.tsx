import { screen, within } from '@testing-library/react'

import { DomaineÉtablissementTerritorial } from '../../../backend/métier/entities/DomaineÉtablissementTerritorial'
import { EntitéJuridiqueViewModelTestFactory } from '../../test-factories/EntitéJuridiqueViewModelTestFactory'
import { ÉtablissementTerritorialRattachéViewModelTestFactory } from '../../test-factories/ÉtablissementTerritorialRattachéViewModelTestFactory'
import { fakeFrontDependencies, htmlNodeAndReactChildMatcher, renderFakeComponent, trimHtml } from '../../testHelper'
import { ÉtablissementTerritorialRattachéViewModel } from './liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from './PageEntitéJuridique'

const { paths, wording } = fakeFrontDependencies

describe('La page Entité Juridique', () => {
  const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestFactory.créeEntitéJuridiqueViewModel(wording)

  const établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[] = [
    ÉtablissementTerritorialRattachéViewModelTestFactory.créeÉtablissementTerritorialRattaché(wording),
    ÉtablissementTerritorialRattachéViewModelTestFactory.créeAutreÉtablissementTerritorialRattaché(wording),
  ]

  it('affiche le titre dans l’onglet', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique
      entitéJuridiqueViewModel={entitéJuridiqueViewModel}
      établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
    />)

    // THEN
    expect(document.title).toBe(entitéJuridiqueViewModel.titre)
  })

  it('affiche le titre : "EJ - numéro de FINESS - nom de l’entité juridique"', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique
      entitéJuridiqueViewModel={entitéJuridiqueViewModel}
      établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
    />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: 'EJ - 220 000 020 - CENTRE HOSPITALIER DE SAINT BRIEUC' })
    expect(titre).toBeInTheDocument()
  })

  describe('affiche le bloc identité de l’entité juridique', () => {
    it('affiche le nom de l’établissement', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelÉtablissement = within(indicateurs[0]).getByText(`${wording.NOM_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
      expect(labelÉtablissement.textContent).toBe(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const abréviationFiness = within(indicateurs[0]).getByText('FINESS', { selector: 'abbr' })
      expect(abréviationFiness).toHaveAttribute('title', 'Fichier National des Établissements Sanitaires et Sociaux')
      const nomDeLÉtablissement = within(indicateurs[0]).getByText('CENTRE HOSPITALIER DE SAINT BRIEUC', { selector: 'p' })
      expect(nomDeLÉtablissement).toBeInTheDocument()
    })

    it('affiche le numéro FINESS', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelNuméroFiness = within(indicateurs[1]).getByText('Numéro', { exact: false, selector: 'p' })
      expect(labelNuméroFiness.textContent).toBe(`${wording.NUMÉRO_FINESS} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const numéroFiness = within(indicateurs[1]).getByText('220 000 020', { selector: 'p' })
      expect(numéroFiness).toBeInTheDocument()
    })

    it('affiche l’adresse', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelAdresse = within(indicateurs[2]).getByText(`${wording.ADRESSE} -`, { selector: 'p' })
      expect(labelAdresse.textContent).toBe(`${wording.ADRESSE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const adresse = within(indicateurs[2]).getByText('10 Rue Marcel Proust 22023 ST BRIEUC CEDEX 1', { selector: 'p' })
      expect(adresse).toBeInTheDocument()
    })

    it('affiche le téléphone', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelTéléphone = within(indicateurs[3]).getByText(`${wording.TÉLÉPHONE} -`, { selector: 'p' })
      expect(labelTéléphone.textContent).toBe(`${wording.TÉLÉPHONE} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const téléphone = within(indicateurs[3]).getByText('02 96 01 71 23', { selector: 'p' })
      expect(téléphone).toBeInTheDocument()
    })

    it('affiche le nom du directeur', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelNomDuDirecteur = within(indicateurs[4]).getByText(wording.NOM_DU_DIRECTEUR, { selector: 'p' })
      expect(labelNomDuDirecteur.textContent).toBe(wording.NOM_DU_DIRECTEUR)
      const indicateurÀVenir = within(indicateurs[4]).getByText('À venir', { selector: 'p' })
      expect(indicateurÀVenir).toBeInTheDocument()
    })

    it('affiche le statut de l’établissement', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelStatutÉtablissement = within(indicateurs[5]).getByText(`${wording.STATUT_DE_L_ÉTABLISSEMENT} -`, { selector: 'p' })
      expect(labelStatutÉtablissement.textContent).toBe(`${wording.STATUT_DE_L_ÉTABLISSEMENT} - ${wording.MISE_À_JOUR} : 07/07/2021 - Source : FINESS`)
      const statutÉtablissement = within(indicateurs[5]).getByText('Public')
      expect(statutÉtablissement).toBeInTheDocument()
    })

    it('affiche la date d’entrée en vigueur du CPOM', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const labelDateDEntréeEnVigueurDuCpom = within(indicateurs[6]).getByText(htmlNodeAndReactChildMatcher(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM))
      expect(labelDateDEntréeEnVigueurDuCpom).toBeInTheDocument()
      expect(labelDateDEntréeEnVigueurDuCpom.textContent).toBe(trimHtml(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM))
      const abréviationCpom = within(indicateurs[6]).getByText('CPOM', { selector: 'abbr' })
      expect(abréviationCpom).toHaveAttribute('title', 'Contrat Pluriannuel d’Objectifs et de Moyens')
      const indicateurÀVenir = within(indicateurs[6]).getByText('À venir')
      expect(indicateurÀVenir).toBeInTheDocument()
    })

    it('n’affiche que 5 mises à jour et sources de données', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const majEtSource = within(ficheDIdentité).getAllByText(`${wording.MISE_À_JOUR} : 07/07/2021 - Source :`, { exact: false })
      expect(majEtSource).toHaveLength(5)
    })

    it('affiche deux indicateurs à venir', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const majEtSource = within(ficheDIdentité).getAllByText('À venir')
      expect(majEtSource).toHaveLength(2)
    })

    it('affiche "non renseigné" quand une valeur est vide', () => {
      // GIVEN
      const entitéJuridiqueViewModelAvecUneValeurVide = EntitéJuridiqueViewModelTestFactory.créeEntitéJuridiqueViewModel(wording, { téléphone: '' })

      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModelAvecUneValeurVide}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const téléphone = within(indicateurs[3]).getByText(wording.NON_RENSEIGNÉ, { selector: 'p' })
      expect(téléphone).toBeInTheDocument()
    })

    it('affiche l’adresse incomplète lorsqu’il manque des champs d’adresse', () => {
      // GIVEN
      const entitéJuridiqueViewModelAvecUneValeurVide = EntitéJuridiqueViewModelTestFactory.créeEntitéJuridiqueViewModel(wording, { adresseTypeVoie: '' })

      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModelAvecUneValeurVide}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      const adresseIncomplète = within(indicateurs[2]).getByText('10 Marcel Proust 22023 ST BRIEUC CEDEX 1', { selector: 'p' })
      expect(adresseIncomplète).toBeInTheDocument()
    })
  })

  describe('affiche la liste des établissements territoriaux rattachés à l’entité juridique', () => {
    it('affiche le titre de la liste', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const établissementTerritoriauxRattachés = screen.getByRole('region', { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS })
      expect(within(établissementTerritoriauxRattachés).getByRole('heading', { level: 2, name: wording.ÉTABLISSEMENTS_RATTACHÉS })).toBeInTheDocument()
    })

    it('affiche la liste des établissements rattachés avec un lien pour accéder à chaque établissement comportant le numéro FINESS de l’établissement et son nom', () => {
      // GIVEN
      const établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[] = [
        ÉtablissementTerritorialRattachéViewModelTestFactory.créeÉtablissementTerritorialRattaché(wording, {
          domaine: DomaineÉtablissementTerritorial.SANITAIRE,
          numéroFiness: '010000040',
          raisonSociale: 'CH NANTUA',
        }),
        ÉtablissementTerritorialRattachéViewModelTestFactory.créeAutreÉtablissementTerritorialRattaché(wording, {
          domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
          numéroFiness: '590782553',
          raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        }),
      ]

      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const établissementTerritoriauxRattachés = screen.getByRole('region', { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS })
      const listeDesÉtablissementsRattachés = within(établissementTerritoriauxRattachés).getAllByRole('listitem')
      expect(listeDesÉtablissementsRattachés).toHaveLength(2)
      const établissementTerritorial1 = within(listeDesÉtablissementsRattachés[0]).getByRole('link')
      expect(établissementTerritorial1).toHaveAttribute('href', `${paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE}/010000040`)
      expect(within(établissementTerritorial1).getByText('- 010 000 040 - CH NANTUA')).toBeInTheDocument()
      const abréviationÉtablissementTerritorial = within(établissementTerritorial1).getByText('ET', { selector: 'abbr' })
      expect(abréviationÉtablissementTerritorial).toHaveAttribute('title', 'Établissement territorial')
      const établissementTerritorial2 = within(listeDesÉtablissementsRattachés[1]).getByRole('link')
      expect(établissementTerritorial2).toHaveAttribute('href', `${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/590782553`)
      expect(within(établissementTerritorial2).getByText('- 590 782 553 - HOPITAL PRIVE DE VILLENEUVE DASCQ')).toBeInTheDocument()
    })
  })
})
