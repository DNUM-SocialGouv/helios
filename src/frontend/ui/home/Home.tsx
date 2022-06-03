import { ReactElement } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'
import { ListItem } from '../commun/ListItem/ListItem'
import LogoEntitéJuridiqueNoir from './logo-entité-juridique-noir.svg'

export const Home = () => {

  const { paths, wording } = useDependencies()
  const entitésJuridiques: {identifiant: ReactElement, numéroFiness: string}[] = [
    {
      identifiant: <>EJ - 750 050 759 - CANSSM FILIERIS </>,
      numéroFiness: '750050759',
    },
  ]
  return (
    <section
      aria-label={wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES}
      className="fr-mt-5w"
    >
      <h3>
        {wording.ENTITÉS_JURIDIQUES}
      </h3>
      <ol className="fr-raw-list fr-text--bold fr-raw-link">
        {
          entitésJuridiques.map((entitéJuriduqe) =>
            <ListItem
              key={entitéJuriduqe.numéroFiness}
              label={entitéJuriduqe.identifiant}
              lien={`${paths.ENTITÉ_JURIDIQUE}/${entitéJuriduqe.numéroFiness}`}
              logo={LogoEntitéJuridiqueNoir}
            />)
        }
      </ol>

    </section>
  )
}
