import { useDependencies } from '../../commun/contexts/useDependencies'
import { ListItem } from '../../commun/ListItem/ListItem'
import styles from './ListeDesÉtablissementsTerritoriauxRattachés.module.css'
import { ÉtablissementTerritorialRattachéViewModel } from './ÉtablissementTerritorialRattachéViewModel'

type ÉtablissementsTerritoriauxRattachésType = Readonly<{
  établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[]
}>

export const ListeDesÉtablissementsTerritoriauxRattachés = ({ établissementsTerritoriauxRattachésViewModels }: ÉtablissementsTerritoriauxRattachésType) => {
  const { paths, wording } = useDependencies()

  if (établissementsTerritoriauxRattachésViewModels.length === 0) return null

  return (
    <section
      aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS}
      className="fr-mt-4w"
    >
      <h3>
        {wording.ÉTABLISSEMENTS_RATTACHÉS}
      </h3>
      <ol className={styles['liste-établissements-territoriaux-rattachés'] + ' fr-raw-list fr-text--bold fr-raw-link'}>
        {
          établissementsTerritoriauxRattachésViewModels.map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) =>
            <ListItem
              key={établissementTerritorialRattachéViewModel.numéroFiness}
              label={établissementTerritorialRattachéViewModel.identifiant}
              lien={établissementTerritorialRattachéViewModel.lienVersLÉtablissement(paths)}
              logo={établissementTerritorialRattachéViewModel.logo}
            />)
        }
      </ol>
    </section>
  )
}
