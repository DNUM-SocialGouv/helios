import { useDependencies } from '../commun/contexts/useDependencies'

type IndicateurProps = Readonly<{
  dateDeMiseÀJour?: string;
  label: string;
  source?: string;
  valeur: string;
}>

export const Indicateur = ({ dateDeMiseÀJour, label, source, valeur }: IndicateurProps) => {
  const { wording } = useDependencies()
  const labelEtSéparateur = `${label} - `
  const miseÀJourEtSource = `${wording.MISE_À_JOUR} : ${dateDeMiseÀJour} - ${wording.SOURCE} : ${source}`

  return (
    <div>
      <p className="fr-m-0">
        {labelEtSéparateur}
        <span className="fr-text--xs">
          {miseÀJourEtSource}
        </span>
      </p>
      <p className="fr-m-0 fr-text--bold">
        {valeur}
      </p>
    </div>
  )
}
