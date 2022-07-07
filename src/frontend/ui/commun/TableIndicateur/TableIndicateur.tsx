import '@gouvfr/dsfr/dist/component/table/table.min.css'
import '@gouvfr/dsfr/dist/component/accordion/accordion.min.css'

import { useState } from 'react'

import { useDependencies } from '../contexts/useDependencies'
import styles from './TableIndicateur.module.css'

type TableIndicateurProps = Readonly<{
  identifiant: string
  libellés: number[]
  valeurs: (number | string)[]
}>

export const TableIndicateur = ({ identifiant, libellés, valeurs }: TableIndicateurProps) => {
  const { wording } = useDependencies()
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="fr-accordion">
      <h3 className="fr-accordion__title">
        <button
          aria-controls={identifiant}
          aria-expanded={expanded}
          className={'fr-accordion__btn ' + styles['accordion-label']}
          onClick={() => setExpanded(true)}
          type="button"
        >
          {wording.AFFICHER_LA_TRANSCRIPTION}
        </button>
      </h3>
      <div
        className={'fr-collapse ' + styles['helios-collapse']}
        id={identifiant}
      >
        <div className={'fr-table fr-table--bordered ' + styles['helios-collapse']}>
          <table>
            <thead>
              <tr>
                <th
                  className={styles['table-header']}
                  scope="col"
                >
                  {wording.ANNÉE}
                </th>
                <th scope="col">
                  {identifiant}
                </th>
              </tr>
            </thead>
            <tbody>
              {libellés.map((libellé, index) =>
                <tr key={libellé}>
                  <td>
                    {libellé}
                  </td>
                  <td>
                    {valeurs[index]}
                  </td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
