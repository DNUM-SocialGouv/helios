import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'

import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import styles from './BlocIdentitéMédicoSocial.module.css'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocActivitéMédicoSocialType = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocActivitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocActivitéMédicoSocialType) => {
  const { wording } = useDependencies()

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels
  )

  const chartColors = [
    '#4E68BB',
    '#4E68BB',
    '#000091',
  ]
  const dataPoints = [70, 121, 67]
  dataPoints.forEach((dataPoint, index) => {
    if (dataPoint > 120) {
      chartColors[index] = '#C9191E'
    }
  })
  const data = {
    datasets: [
      {
        backgroundColor: chartColors,
        data: dataPoints,
      },
    ],
    labels: ['2019', '2020', '2021'],
  }

  const options= {
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'start',
        color: 'white',
        font: {
          size: 26,
          weight: 'bold',
        },
        formatter: Math.round,
      },
    },
    scales: {
      y:
        {
          display: true,
          max: 120,
          min: 0,
        },
    },
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={styles['liste-indicateurs']}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
          source={wording.DIAMANT}
          valeur={établissementTerritorialMédicoSocialViewModel.nomDeLÉtablissementTerritorial}
        />
        <Bar
          data={data}
          options={options}
        />
      </ul>
    </Bloc>
  )
}
