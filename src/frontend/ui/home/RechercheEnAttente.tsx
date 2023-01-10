import { useDependencies } from '../commun/contexts/useDependencies'

export const RechercheEnAttente = () => {
  const { wording } = useDependencies()

  return (
    <section>
      <p className="fr-mt-4w">{wording.RECHERCHE_EN_ATTENTE}</p>
    </section>
  )
}
