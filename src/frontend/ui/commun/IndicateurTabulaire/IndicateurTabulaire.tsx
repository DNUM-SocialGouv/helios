import { useDependencies } from '../contexts/useDependencies'
import { MiseEnExergue } from '../MiseEnExergue/MiseEnExergue'
import styles from './IndicateurTabulaire.module.css'

export type IndicateurTabulaireProps = Readonly<{
  annéesManquantes: number[]
  valeursParAnnée: { année: number; valeur: string }[]
}>

export const IndicateurTabulaire = ({ annéesManquantes, valeursParAnnée }: IndicateurTabulaireProps) => {
  const { wording } = useDependencies()

  return <div className={styles['indicateur-tabulaire']}>
    <div className="fr-table">
      <table>
        <thead>
          <tr>
            <th>
              {wording.ANNÉE}
            </th>
            <th>
              {wording.MONTANT}
            </th>
          </tr>
        </thead>
        <tbody>
          {valeursParAnnée.map((valeurParAnnée) => (
            <tr key={valeurParAnnée.année}>
              <td>
                {valeurParAnnée.année}
              </td>
              <td>
                {valeurParAnnée.valeur}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <MiseEnExergue>
      {`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
    </MiseEnExergue>
  </div>
}
