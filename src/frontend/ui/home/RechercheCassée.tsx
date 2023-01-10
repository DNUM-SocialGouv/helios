import { useDependencies } from '../commun/contexts/useDependencies'

export const RechercheCassée = () => {
  const { wording } = useDependencies()

  return (
    <section>
      <p className="fr-mt-4w">{wording.ERREUR_TECHNIQUE}</p>
    </section>
  )
}
