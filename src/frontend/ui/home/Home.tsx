import Image from 'next/image'
import { ReactElement } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'
import { ListItem } from '../commun/ListItem/ListItem'
import styles from './Home.module.css'
import LogoEntitéJuridiqueNoir from './logo-entité-juridique-noir.svg'

export const Home = () => {
  const { paths, wording } = useDependencies()

  const entitésJuridiques: {identifiant: ReactElement, numéroFiness: string}[] = [
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 750 050 759 - CANSSM FILIERIS
      </>,
      numéroFiness: '750050759',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 750 060 758 - SARL DOMITYS NORD OUEST
      </>,
      numéroFiness: '750060758',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 010 000 289 - MAISON DE REPOS VIEUX MOULIN
      </>,
      numéroFiness: '010000289',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 750 721 334 - CROIX ROUGE FRANCAISE
      </>,
      numéroFiness: '750721334',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 240 015 842 - COMMUNAUTE DE COMMUNES DU PAYS VERNOIS
      </>,
      numéroFiness: '240015842',
    },
  ]

  return (
    <section
      aria-label={wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES}
      className="fr-mt-5w"
    >
      <h1 className="fr-h3">
        {wording.ENTITÉS_JURIDIQUES}
      </h1>
      <ul className={styles['liste-entités-juridiques'] + ' fr-raw-list fr-text--bold fr-raw-link'}>
        {
          entitésJuridiques.map((entitéJuridique) =>
            <ListItem
              key={entitéJuridique.numéroFiness}
              label={entitéJuridique.identifiant}
              lien={`${paths.ENTITÉ_JURIDIQUE}/${entitéJuridique.numéroFiness}`}
              logo={<>
                <Image
                  alt=""
                  height="22"
                  src={LogoEntitéJuridiqueNoir}
                  width="22"
                />
              </>}
            />)
        }
      </ul>
    </section>
  )
}
