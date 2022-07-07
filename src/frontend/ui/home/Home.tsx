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
        &nbsp;- 750 050 759 - CANSSM FILIERIS (avec que des ET sanitaires)
      </>,
      numéroFiness: '750050759',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 750 060 758 - SARL DOMITYS NORD OUEST (avec que des ET médico-sociaux)
      </>,
      numéroFiness: '750060758',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 500 020 839 - GCSMS &quot;PRESQU&apos;ÎLE&quot; (sans ET)
      </>,
      numéroFiness: '500020839',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 750 721 334 - CROIX ROUGE FRANCAISE (avec beaucoup d’ET)
      </>,
      numéroFiness: '750721334',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;- 210 012 142 - CTRE HOSPITALIER DE LA HAUTE COTE D OR (avec un nom d’établissement très long)
      </>,
      numéroFiness: '210012142',
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
