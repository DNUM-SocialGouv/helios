import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
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
      const labelÉtablissement = within(ficheDIdentité).getByText('Nom de l’établissement -', { exact: false })
      expect(labelÉtablissement).toBeInTheDocument()
      const majEtSource = within(ficheDIdentité).getAllByText('Màj : 07/07/2021 - Source : FINESS')
      expect(majEtSource[0]).toBeInTheDocument()
    })

    it('le numéro FINESS', () => {

      // WHEN
      renderFakeComponent(<EntitéJuridique />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const numéroFINESS = within(ficheDIdentité).getByText('220000020')
      expect(numéroFINESS).toBeInTheDocument()
      const labelÉtablissement = within(ficheDIdentité).getByText('Numéro FINESS', { exact: false })
      expect(labelÉtablissement).toBeInTheDocument()
      const majEtSource = within(ficheDIdentité).getAllByText('Màj : 07/07/2021 - Source : FINESS')
      expect(majEtSource[0]).toBeInTheDocument()
    })

    it.todo('l’adresse')

    it.todo('le téléphone et l’email')

    it.todo('le nom du directeur')

    it.todo('le statut de l’établissement')

    it.todo('la date d’entrée en vigueur du CPOM')
  })
})
