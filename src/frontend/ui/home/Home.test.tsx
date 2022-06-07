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
    expect(within(entitésJuridiques).getByRole('heading', { level: 1, name: wording.ENTITÉS_JURIDIQUES })).toBeInTheDocument()
  })

  it('affiche la liste de 5 entités juridiques avec un lien pour accéder à chaque entité comportant le numéro FINESS de l’entité et son nom', () => {
    // WHEN
    renderFakeComponent(<Home />)

    // THEN
    const entitésJuridique = screen.getByRole('region', { name: wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES })
    const listeDesEntitésJuridiques = within(entitésJuridique).getAllByRole('listitem')
    expect(listeDesEntitésJuridiques).toHaveLength(5)
    const entitéJuridiqueAvecEtSanitaire = within(listeDesEntitésJuridiques[0]).getByRole('link')
    expect(entitéJuridiqueAvecEtSanitaire).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750050759`)
    expect(within(entitéJuridiqueAvecEtSanitaire).getByText('- 750 050 759 - CANSSM FILIERIS')).toBeInTheDocument()
    const abréviationEntitéJuridique = within(entitéJuridiqueAvecEtSanitaire).getByText('EJ', { selector: 'abbr' })
    expect(abréviationEntitéJuridique).toHaveAttribute('title', wording.ENTITÉ_JURIDIQUE)

    const entitéJuridiqueAvecEtMédicoSocial = within(listeDesEntitésJuridiques[1]).getByRole('link')
    expect(entitéJuridiqueAvecEtMédicoSocial).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750060758`)
    expect(within(entitéJuridiqueAvecEtMédicoSocial).getByText('- 750 060 758 - SARL DOMITYS NORD OUEST')).toBeInTheDocument()

    const entitéJuridiqueSansEt = within(listeDesEntitésJuridiques[2]).getByRole('link')
    expect(entitéJuridiqueSansEt).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/010000289`)
    expect(within(entitéJuridiqueSansEt).getByText('- 010 000 289 - MAISON DE REPOS VIEUX MOULIN')).toBeInTheDocument()

    const entitéJuridiqueAvecPlusieursEt= within(listeDesEntitésJuridiques[3]).getByRole('link')
    expect(entitéJuridiqueAvecPlusieursEt).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/750721334`)
    expect(within(entitéJuridiqueAvecPlusieursEt).getByText('- 750 721 334 - CROIX ROUGE FRANCAISE')).toBeInTheDocument()

    const entitéJuridiqueAvecUnLongNom = within(listeDesEntitésJuridiques[4]).getByRole('link')
    expect(entitéJuridiqueAvecUnLongNom).toHaveAttribute('href', `${paths.ENTITÉ_JURIDIQUE}/240015842`)
    expect(within(entitéJuridiqueAvecUnLongNom).getByText('- 240 015 842 - COMMUNAUTE DE COMMUNES DU PAYS VERNOIS')).toBeInTheDocument()
  })
})
