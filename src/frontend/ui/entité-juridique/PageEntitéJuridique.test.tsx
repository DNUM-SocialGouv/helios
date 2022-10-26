import { fireEvent, screen, within } from '@testing-library/react'

import { DomaineÉtablissementTerritorial } from '../../../backend/métier/entities/DomaineÉtablissementTerritorial'
import { EntitéJuridiqueViewModelTestBuilder } from '../../test-builder/EntitéJuridiqueViewModelTestBuilder'
import { ÉtablissementTerritorialRattachéViewModelTestBuilder } from '../../test-builder/ÉtablissementTerritorialRattachéViewModelTestBuilder'
import { fakeFrontDependencies, renderFakeComponent, textMatch } from '../../testHelper'
import { StringFormater } from '../commun/StringFormater'
import { ÉtablissementTerritorialRattachéViewModel } from './liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from './PageEntitéJuridique'

const { paths, wording } = fakeFrontDependencies

describe('La page Entité Juridique', () => {
  const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestBuilder.crée(wording)

  const établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[] = [
    ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialRattaché(wording),
    ÉtablissementTerritorialRattachéViewModelTestBuilder.créeAutreÉtablissementTerritorialRattaché(wording),
  ]

  it('affiche le titre court dans l’onglet', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique
      entitéJuridiqueViewModel={entitéJuridiqueViewModel}
      établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
    />)

    // THEN
    expect(document.title).toBe(`EJ - ${EntitéJuridiqueViewModelTestBuilder.entitéJurique.numéroFinessEntitéJuridique.value} - ${EntitéJuridiqueViewModelTestBuilder.entitéJurique.raisonSocialeCourte.value}`)
  })

  it('affiche le titre : "EJ - numéro de FINESS - nom court de l’entité juridique"', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique
      entitéJuridiqueViewModel={entitéJuridiqueViewModel}
      établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
    />)

    // THEN
    const titre = screen.getByRole('heading', { level: 1, name: `EJ - ${EntitéJuridiqueViewModelTestBuilder.entitéJurique.numéroFinessEntitéJuridique.value} - ${EntitéJuridiqueViewModelTestBuilder.entitéJurique.raisonSocialeCourte.value}` })
    expect(titre).toBeInTheDocument()
  })

  it('affiche le bouton pour imprimer', () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique
      entitéJuridiqueViewModel={entitéJuridiqueViewModel}
      établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
    />)

    // THEN
    const imprimer = screen.getByRole('button', { name: wording.TÉLÉCHARGER_EN_PDF })
    expect(imprimer).toHaveAttribute('type', 'button')
  })

  it('j’imprime quand je clique sur le bouton d’impression', () => {
    // GIVEN
    jest.spyOn(window, 'print').mockImplementation()
    renderFakeComponent(<PageEntitéJuridique
      entitéJuridiqueViewModel={entitéJuridiqueViewModel}
      établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
    />)
    const imprimer = screen.getByRole('button', { name: wording.TÉLÉCHARGER_EN_PDF })

    // WHEN
    fireEvent.click(imprimer)

    // THEN
    expect(window.print).toHaveBeenCalledTimes(1)
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
      const labelÉtablissement = within(indicateurs[0]).getByText(textMatch(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
      expect(labelÉtablissement).toBeInTheDocument()
      const abréviationFiness = within(indicateurs[0]).getByText('FINESS', { selector: 'abbr' })
      expect(abréviationFiness).toHaveAttribute('title', wording.FINESS_TITLE)
      const nomDeLÉtablissement = within(indicateurs[0]).getByText(EntitéJuridiqueViewModelTestBuilder.entitéJurique.raisonSociale.value, { selector: 'p' })
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
      const labelNuméroFiness = within(indicateurs[1]).getByText(textMatch(`${wording.NUMÉRO_FINESS} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
      expect(labelNuméroFiness).toBeInTheDocument()
      const numéroFiness = within(indicateurs[1]).getByText(EntitéJuridiqueViewModelTestBuilder.entitéJurique.numéroFinessEntitéJuridique.value, { selector: 'p' })
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
      const labelAdresse = within(indicateurs[2]).getByText(textMatch(`${wording.ADRESSE} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
      expect(labelAdresse).toBeInTheDocument()
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
      const labelTéléphone = within(indicateurs[3]).getByText(textMatch(`${wording.TÉLÉPHONE} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
      expect(labelTéléphone).toBeInTheDocument()
      const téléphone = within(indicateurs[3]).getByText(StringFormater.formateLeNuméroDeTéléphone(EntitéJuridiqueViewModelTestBuilder.entitéJurique.téléphone.value), { selector: 'p' })
      expect(téléphone).toBeInTheDocument()
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
      const labelStatutÉtablissement = within(indicateurs[4]).getByText(textMatch(`${wording.STATUT_JURIDIQUE} - ${wording.miseÀJour('07/07/2021')} - Source : FINESS`), { selector: 'p' })
      expect(labelStatutÉtablissement).toBeInTheDocument()
      const statutÉtablissement = within(indicateurs[4]).getByText(EntitéJuridiqueViewModelTestBuilder.entitéJurique.libelléStatutJuridique.value, { selector: 'p' })
      expect(statutÉtablissement).toBeInTheDocument()
    })

    it('affiche "non renseigné" quand une valeur est vide', () => {
      // GIVEN
      const entitéJuridiqueViewModelAvecUneValeurVide = EntitéJuridiqueViewModelTestBuilder.crée(wording, {
        téléphone: {
          dateMiseÀJourSource: '2021-07-07',
          value: '',
        },
      })

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
      const entitéJuridiqueViewModelAvecUneValeurVide = EntitéJuridiqueViewModelTestBuilder.crée(wording, {
        adresseTypeVoie: {
          dateMiseÀJourSource: '2021-07-07',
          value: '',
        },
      })

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

    it('affiche 5 indicateurs en tout', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateurs = within(ficheDIdentité).getAllByRole('listitem')
      expect(indicateurs).toHaveLength(5)
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
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialRattaché(wording, {
          domaine: DomaineÉtablissementTerritorial.SANITAIRE,
          numéroFiness: '010000040',
          raisonSocialeCourte: 'CH NANTUA',
        }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeAutreÉtablissementTerritorialRattaché(wording, {
          domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
          numéroFiness: '590782553',
          raisonSocialeCourte: 'HP VILLENEUVE DASCQ',
        }),
      ]

      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />)

      // THEN
      const établissementsTerritoriauxRattachés = screen.getByRole('region', { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS })
      const listeDesÉtablissementsRattachés = within(établissementsTerritoriauxRattachés).getAllByRole('listitem')
      expect(listeDesÉtablissementsRattachés).toHaveLength(établissementsTerritoriauxRattachésViewModels.length)
      const établissementTerritorial1 = within(listeDesÉtablissementsRattachés[0]).getByRole('link', { name: 'Établissement territorial - 010000040 - CH NANTUA' })
      expect(établissementTerritorial1).toHaveAttribute('href', `${paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE}/010000040`)
      const abréviationÉtablissementTerritorial = within(établissementTerritorial1).getByText('ET', { selector: 'abbr' })
      expect(abréviationÉtablissementTerritorial).toHaveAttribute('title', wording.ÉTABLISSEMENT_TERRITORIAL)
      const établissementTerritorial2 = within(listeDesÉtablissementsRattachés[1]).getByRole('link', { name: 'Établissement territorial - 590782553 - HP VILLENEUVE DASCQ' })
      expect(établissementTerritorial2).toHaveAttribute('href', `${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/590782553`)
    })

    it('n’affiche pas la liste des établissements territoriaux rattachés quand l’entité juridique n’en a pas', () => {
      // WHEN
      renderFakeComponent(<PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={[]}
      />)

      // THEN
      const établissementTerritoriauxRattachés = screen.queryByRole('region', { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS })
      expect(établissementTerritoriauxRattachés).not.toBeInTheDocument()
    })
  })
})
