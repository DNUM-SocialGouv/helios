import '@gouvfr/dsfr/dist/component/table/table.min.css'
import '@gouvfr/dsfr/dist/component/accordion/accordion.min.css'

import { useState } from 'react'

import { useDependencies } from '../contexts/useDependencies'
import styles from './TableIndicateur.module.css'

type TableIndicateurProps = Readonly<{
    identifiant: string
    labels: number[]
    dataPoints: string[] | number[]
}>

type labelDataPoint = {
    dataPoint: string | number
    label: number
}

export const TableIndicateur = ({ identifiant, labels, dataPoints }: TableIndicateurProps) => {
  const { wording } = useDependencies()

  const [expanded, setExpanded] = useState(false)
  const lignesAnnéesValeurs: labelDataPoint[] = [
    { dataPoint: dataPoints[0], label: labels[0] },
    { dataPoint: dataPoints[1], label: labels[1] },
    { dataPoint: dataPoints[2], label: labels[2] },
  ]

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
              {lignesAnnéesValeurs.map((ligneAnnéeValeur) =>
                <tr key={ligneAnnéeValeur.label}>
                  <td>
                    {ligneAnnéeValeur.label}
                  </td>
                  <td>
                    {ligneAnnéeValeur.dataPoint}
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
