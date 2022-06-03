import { screen, within } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { Home } from './Home'

const { paths, wording } = fakeFrontDependencies

describe('La page d’Accueil', () => {
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
    expect(listeDesEntitésJuridiques).toHaveLength(5)
    const entitéJuridique1 = within(listeDesEntitésJuridiques[0]).getByRole('link')
    expect(entitéJuridique1).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750050759`)
    expect(within(entitéJuridique1).getByText('- 750 050 759 - CANSSM FILIERIS')).toBeInTheDocument()
    const abréviationEntitéJuridique = within(entitéJuridique1).getByText('EJ', { selector: 'abbr' })
    expect(abréviationEntitéJuridique).toHaveAttribute('title', wording.ENTITÉ_JURIDIQUE)

    const entitéJuridique2 = within(listeDesEntitésJuridiques[1]).getByRole('link')
    expect(entitéJuridique2).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750060758`)
    expect(within(entitéJuridique2).getByText('- 750 060 758 - SARL DOMITYS NORD OUEST')).toBeInTheDocument()

    const entitéJuridique3 = within(listeDesEntitésJuridiques[2]).getByRole('link')
    expect(entitéJuridique3).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/010000289`)
    expect(within(entitéJuridique3).getByText('- 010 000 289 - MAISON DE REPOS VIEUX MOULIN')).toBeInTheDocument()

    const entitéJuridique4 = within(listeDesEntitésJuridiques[3]).getByRole('link')
    expect(entitéJuridique4).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750721334`)
    expect(within(entitéJuridique4).getByText('- 750 721 334 - CROIX ROUGE FRANCAISE')).toBeInTheDocument()

    const entitéJuridique5 = within(listeDesEntitésJuridiques[4]).getByRole('link')
    expect(entitéJuridique5).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/240015842`)
    expect(within(entitéJuridique5).getByText('- 240 015 842 - COMMUNAUTE DE COMMUNES DU PAYS VERNOIS')).toBeInTheDocument()
  })
})
