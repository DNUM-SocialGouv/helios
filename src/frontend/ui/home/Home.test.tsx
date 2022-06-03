import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { Home } from './Home'

const { paths, wording } = fakeFrontDependencies

describe('page accueil', () => {
  it('affiche le titre de la liste', () => {
    // WHEN
    renderFakeComponent(<Home />)

    // THEN
    const entitésJuridiques = screen.getByRole('region', { name: wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES })
    expect(within(entitésJuridiques).getByRole('heading', { level: 3, name: wording.ENTITÉS_JURIDIQUES })).toBeInTheDocument()
  })

  it('affiche la liste de 5 entités juridiques avec un lien pour accéder à chaque entité comportant le numéro FINESS de l’entité et son nom', () => {
    // WHEN
    renderFakeComponent(<Home />)

    // THEN
    const entitésJuridique = screen.getByRole('region', { name: wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES })
    const listeDesEntitésJuridiques = within(entitésJuridique).getAllByRole('listitem')
    expect(listeDesEntitésJuridiques).toHaveLength(1)
    const entitéJuridique1 = within(listeDesEntitésJuridiques[0]).getByRole('link')
    expect(entitéJuridique1).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750050759`)
    expect(within(entitéJuridique1).getByText('- 750 050 759 - CANSSM FILIERIS')).toBeInTheDocument()
  //  const abréviationÉtablissementTerritorial = within(entitéJuridique1).getByText('ET', { selector: 'abbr' })
  //  expect(abréviationÉtablissementTerritorial).toHaveAttribute('title', 'Établissement territorial')
  })
})
