import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { Entité } from './Entité'

const { wording } = fakeFrontDependencies

describe('La page Entité Juridique', () => {
  describe('affiche la fiche d’identité de l’entité', () => {
    it('le nom de l’établissement', () => {
      // WHEN
      renderFakeComponent(<Entité />)

      // THEN
      const ficheDIdentité = screen.getByRole('region', { name: wording.TITRE_BLOC_IDENTITÉ })
      const nomDeLÉtablissement = within(ficheDIdentité).getByText()
      expect(nomDeLÉtablissement).toBeInTheDocument()
    })

    it.todo('le numéro FINESS')

    it.todo('l’adresse')

    it.todo('le téléphone et l’email')

    it.todo('le nom du directeur')

    it.todo('le statut de l’établissement')

    it.todo('la date d’entrée en vigueur du CPOM')
  })
})
