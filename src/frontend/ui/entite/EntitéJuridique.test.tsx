import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, nodeReactChildMatcher, nodeTextMatcher, renderFakeComponent, trimHtml } from '../../testHelper'
import { EntitéJuridique } from './EntitéJuridique'

const { wording } = fakeFrontDependencies

describe('La page Entité Juridique', () => {
  describe('affiche la fiche d’identité de l’entité', () => {
    it('le nom de l’établissement', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const nomDeLÉtablissement = within(ficheDIdentité).getByText('CENTRE HOSPITALIER DE SAINT BRIEUC')
      expect(nomDeLÉtablissement).toBeInTheDocument()
      const labelÉtablissement = within(ficheDIdentité).getByText(wording.NOM_DE_L_ÉTABLISSEMENT, { exact: false })
      expect(labelÉtablissement.textContent).toBe(`${wording.NOM_DE_L_ÉTABLISSEMENT} - Màj : 07/07/2021 - Source : FINESS`)
    })

    it('le numéro FINESS', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const numéroFINESS = within(ficheDIdentité).getByText('220000020')
      expect(numéroFINESS).toBeInTheDocument()
      const labelNuméroFINESS = within(ficheDIdentité).getByText(wording.NUMÉRO_FINESS, { exact: false })
      expect(labelNuméroFINESS.textContent).toBe(`${wording.NUMÉRO_FINESS} - Màj : 07/07/2021 - Source : FINESS`)
    })

    it('l’adresse', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const adresse = within(ficheDIdentité).getByText('10 Rue Marcel Proust 22023 ST BRIEUC CEDEX 1')
      expect(adresse).toBeInTheDocument()
      const labelAdresse = within(ficheDIdentité).getByText(wording.ADRESSE, { exact: false })
      expect(labelAdresse.textContent).toBe(`${wording.ADRESSE} - Màj : 07/07/2021 - Source : FINESS`)
    })

    it('le téléphone', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const téléphone = within(ficheDIdentité).getByText('02 96 01 71 23')
      expect(téléphone).toBeInTheDocument()
      const labelTéléphone = within(ficheDIdentité).getByText(wording.TÉLÉPHONE, { exact: false })
      expect(labelTéléphone.textContent).toBe(`${wording.TÉLÉPHONE} - Màj : 07/07/2021 - Source : FINESS`)
    })

    it('le nom du directeur', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateursÀVenir = within(ficheDIdentité).getAllByText('À venir')
      expect(indicateursÀVenir[0]).toBeInTheDocument()
      const labelNomDuDirecteur = within(ficheDIdentité).getByText(wording.NOM_DU_DIRECTEUR, { exact: false })
      expect(labelNomDuDirecteur).toBeInTheDocument()
      expect(labelNomDuDirecteur.textContent).toBe(wording.NOM_DU_DIRECTEUR)
    })

    it('le statut de l’établissement', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const statutÉtablissement = within(ficheDIdentité).getByText('Public')
      expect(statutÉtablissement).toBeInTheDocument()
      const labelStatutÉtablissement = within(ficheDIdentité).getByText(wording.STATUT_DE_L_ÉTABLISSEMENT, { exact: false })
      expect(labelStatutÉtablissement.textContent).toBe(`${wording.STATUT_DE_L_ÉTABLISSEMENT} - Màj : 07/07/2021 - Source : FINESS`)
    })

    it('la date d’entrée en vigueur du CPOM', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const indicateursÀVenir = within(ficheDIdentité).getAllByText('À venir')
      expect(indicateursÀVenir[1]).toBeInTheDocument()
      const labelDateDEntréeEnVigueurDuCPOM = within(ficheDIdentité).getByText(nodeReactChildMatcher(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM))
      expect(labelDateDEntréeEnVigueurDuCPOM).toBeInTheDocument()
      expect(labelDateDEntréeEnVigueurDuCPOM.textContent).toBe(trimHtml(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM))
    })

    it('ne devrait afficher que 5 mises à jour et sources de données', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const majEtSource = within(ficheDIdentité).getAllByText(nodeTextMatcher('Màj : 07/07/2021 - Source : FINESS'))
      expect(majEtSource).toHaveLength(5)
    })

    it('devrait avoir deux indicateurs à venir', () => {
      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const majEtSource = within(ficheDIdentité).getAllByText('À venir')
      expect(majEtSource).toHaveLength(2)
    })
  })
})
