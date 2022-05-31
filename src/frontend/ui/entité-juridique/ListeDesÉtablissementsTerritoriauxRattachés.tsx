import Link from 'next/link'

import { useDependencies } from '../commun/contexts/useDependencies'
import styles from './ListeDesÉtablissementsTerritoriauxRattachés.module.css'
import { ÉtablissementTerritorialRattachéViewModel } from './ÉtablissementTerritorialRattachéViewModel'

type ÉtablissementsTerritoriauxRattachésType = Readonly<{
  établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[]
}>

export const ListeDesÉtablissementsTerritoriauxRattachés = ({ établissementsTerritoriauxRattachésViewModels }: ÉtablissementsTerritoriauxRattachésType) => {
  const { paths, wording } = useDependencies()

  return (
    <section
      aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS}
      className="fr-mt-4w"
    >
      <h3>
        {wording.ÉTABLISSEMENTS_RATTACHÉS}
      </h3>
      <ul className={styles['liste-établissements-territoriaux-rattachés'] + ' fr-raw-list fr-text--bold fr-raw-link'}>
        {
          établissementsTerritoriauxRattachésViewModels.map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) => {
            return (
              <li
                className={styles['élément-liste-établissements-territoriaux-rattachés']}
                key={établissementTerritorialRattachéViewModel.numéroFiness}
              >
                {établissementTerritorialRattachéViewModel.logo}
                <Link
                  href={établissementTerritorialRattachéViewModel.lienVersLÉtablissement(paths)}
                  passHref
                >
                  <a>
                    {établissementTerritorialRattachéViewModel.label}
                  </a>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}
