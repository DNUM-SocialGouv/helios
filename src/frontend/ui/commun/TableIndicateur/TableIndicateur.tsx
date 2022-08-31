import '@gouvfr/dsfr/dist/component/table/table.min.css'
import '@gouvfr/dsfr/dist/component/accordion/accordion.min.css'

import { useDependencies } from '../contexts/useDependencies'
import styles from './TableIndicateur.module.css'

type TableIndicateurProps = Readonly<{
  disabled?: boolean
  entêteLibellé: string
  identifiants: string[]
  libellés: (number | string)[]
  valeurs: (number | string | null)[][]
}>

export const TableIndicateur = ({ disabled = false, entêteLibellé, identifiants, libellés, valeurs }: TableIndicateurProps) => {
  const { wording } = useDependencies()

  return (
    <section className="fr-accordion">
      <h3 className="fr-accordion__title">
        <button
          aria-controls={identifiants[0].replaceAll(' ', '')}
          aria-expanded="false"
          className={'fr-accordion__btn ' + styles['accordion-label']}
          disabled={disabled}
          type="button"
        >
          {wording.AFFICHER_LA_TRANSCRIPTION}
        </button>
      </h3>
      <div
        className={'fr-collapse ' + styles['helios-collapse']}
        id={identifiants[0].replaceAll(' ', '')}
      >
        <div className={'fr-table fr-table--bordered ' + styles['helios-collapse']}>
          <table>
            <thead>
              <tr>
                <th
                  className={styles['table-header']}
                  scope="col"
                >
                  {entêteLibellé}
                </th>
                {identifiants.map((identifiant) =>
                  <th
                    key={identifiant}
                    scope="col"
                  >
                    {identifiant}
                  </th>)
                }
              </tr>
            </thead>
            <tbody>
              {libellés.map((libellé, index) =>
                <tr key={libellé}>
                  <td>
                    {libellé}
                  </td>
                  {valeurs.map((valeur, index2) =>
                    <td key={valeur[index] + index2.toString()}>
                      {/* @ts-ignore */}
                      {valeur[index] === null ? 'N/A' : valeur[index]}
                    </td>)
                  }
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
