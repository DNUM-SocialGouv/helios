import { BarElement, CategoryScale, Chart as ChartJS, ChartData, ChartOptions, Legend, LegendItem, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'

import { Wording } from '../../../configuration/wording/Wording'
import { TableIndicateur } from '../TableIndicateur/TableIndicateur'

export class GraphiqueViewModel {
  readonly couleurDuFond = '#E8EDFF'
  readonly couleurDuFondHistogrammePrimaire = '#000091'
  readonly couleurDuFondHistogrammeSecondaire = '#4E68BB'
  readonly couleurDuFondDeLaLigne = '#929292'
  readonly couleurDuFondHistogrammeDeDépassement = '#C9191E'
  readonly couleurDelAbscisse = '#161616'
  readonly couleurDeLaValeur = '#3A3A3A'
  readonly fondDeCouleurPourPremierHistogramme: string[]
  readonly fondDeCouleurPourSecondHistogramme: string[]
  readonly grosseursDePolicePourLesLibellés: string[]

  constructor(protected readonly wording: Wording, nombreIndicateursActivité: number) {
    this.fondDeCouleurPourPremierHistogramme = Array(nombreIndicateursActivité)
      .fill(this.couleurDuFondHistogrammeSecondaire, 0, nombreIndicateursActivité - 1)
      .fill(this.couleurDuFondHistogrammePrimaire, nombreIndicateursActivité - 1, nombreIndicateursActivité)
    this.fondDeCouleurPourSecondHistogramme = Array(nombreIndicateursActivité).fill(this.couleurDuFond)
    this.grosseursDePolicePourLesLibellés = Array(nombreIndicateursActivité)
      .fill('normal', 0, nombreIndicateursActivité - 1)
      .fill('bold', nombreIndicateursActivité - 1, nombreIndicateursActivité)

    ChartJS.register(
      BarElement,
      CategoryScale,
      ChartDataLabels,
      Legend,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      this.construisLePluginDeLégende()
    )
  }

  protected afficheUnHistogrammeVertical(
    chartColors: string[],
    valeurs: number[],
    dataLabelsColor: string[],
    années: number[],
    identifiant: string
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          borderColor: this.couleurDuFondDeLaLigne,
          borderDash: [3, 3],
          data: [{ x: -1, y: 100 }, { x: 2, y: 100 }],
          datalabels: { display: false },
          type: 'line',
          xAxisID: 'xLine',
        },
        {
          backgroundColor: chartColors,
          data: valeurs,
          datalabels: { labels: { title: { color: dataLabelsColor } } },
          maxBarThickness: 60,
          type: 'bar',
          xAxisID: 'x',
        },
        {
          backgroundColor: this.fondDeCouleurPourSecondHistogramme,
          data: [100, 100, 100],
          datalabels: { display: false },
          maxBarThickness: 60,
          type: 'bar',
          xAxisID: 'x',
        },
      ],
      labels: années,
    }

    return (
      <>
        <Bar
          // @ts-ignore
          data={data}
          // @ts-ignore
          options={this.optionsHistogrammeVertical()}
        />
        <TableIndicateur
          identifiants={[identifiant]}
          libellés={années}
          valeurs={[this.ajouteLePourcentage(valeurs)]}
        />
      </>
    )
  }

  protected afficheUnHistogrammeHorizontal(
    chartColors: string[],
    valeurs: number[],
    dataLabelsColor: string[],
    années: number[],
    identifiant: string
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: chartColors,
          data: valeurs,
          datalabels: { labels: { title: { color: dataLabelsColor } } },
          maxBarThickness: 60,
          type: 'bar',
          yAxisID: 'y',
        },
      ],
      labels: années,
    }

    return (
      <>
        <Bar
          // @ts-ignore
          data={data}
          // @ts-ignore
          options={this.optionsHistogrammeHorizontal(Math.max(...valeurs))}
        />
        <TableIndicateur
          identifiants={[identifiant]}
          libellés={années}
          valeurs={[valeurs]}
        />
      </>
    )
  }

  private construisLePluginDeLégende() {
    function créeLeLibelléPourLaLégende(chart: ChartJS, libellé: LegendItem): HTMLLIElement {
      const li = document.createElement('li')

      li.onclick = () => {
        chart.setDatasetVisibility(libellé.datasetIndex, !chart.isDatasetVisible(libellé.datasetIndex))
        chart.update()
      }

      const boxSpan = document.createElement('span')
      boxSpan.style.background = libellé.fillStyle as string
      boxSpan.style.border = `solid ${libellé.strokeStyle} 1px`
      boxSpan.innerHTML = '&nbsp;'

      const textContainer = document.createElement('p')
      textContainer.classList.add('fr-text--xs')
      textContainer.style.textDecoration = libellé.hidden ? 'line-through' : ''

      const text = document.createTextNode(libellé.text)
      textContainer.appendChild(text)

      li.appendChild(boxSpan)
      li.appendChild(textContainer)
      return li
    }

    return {
      afterUpdate(chart: ChartJS, _args: Object, options: any) {
        const légende = document.getElementById(options.containerID)

        if (!légende)
          return

        while (légende.firstChild) {
          légende.firstChild.remove()
        }

        // @ts-ignore
        const libellésDeLaLégende = chart.options.plugins?.legend?.labels.generateLabels(chart) || []

        libellésDeLaLégende.forEach((libellé) => {
          const libelléDeLégende = créeLeLibelléPourLaLégende(chart, libellé)
          légende.appendChild(libelléDeLégende)
        })
      },
      id: 'htmlLegend',
    }
  }

  private optionsHistogrammeVertical(valeurMaximale: number): ChartOptions<'bar'> {
    return {
      animation: false,
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'start',
          font: {
            family: 'Marianne',
            size: 16,
            weight: 'bold',
          },
          formatter: (value: number, _context: Context): string => value.toLocaleString('fr') + ' %',
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      radius: false,
      scales: {
        x: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          stacked: true,
          ticks: {
            color: this.couleurDelAbscisse,
            // @ts-ignore
            font: { weight: this.grosseursDePolicePourLesLibellés },
          },
        },
        xLine: { display: false, max: 1, min: 0, type: 'linear' },
        y: {
          display: false,
          max: valeurMaximale,
          min: 0,
        },
      },
    }
  }

  private optionsHistogrammeHorizontal(valeurMaximale: number): ChartOptions<'bar'> {
    return {
      animation: false,
      indexAxis: 'y',
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          font: {
            family: 'Marianne',
            size: 14,
          },
          formatter: (value: string, _context: Context): string => parseFloat(value).toLocaleString('fr'),
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          display: false,
          max: 1.15 * valeurMaximale,
          min: 0,
        },
        y: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            color: this.couleurDelAbscisse,
            // @ts-ignore
            font: { weight: this.grosseursDePolicePourLesLibellés },
          },
        },
      },
    }
  }

  protected optionsHistogrammeÀBandes(idDeLaLégende: string, créeLeLibelléDuTooltip: Function): ChartOptions<'bar'> {
    return {
      animation: false,
      elements: { bar: { borderWidth: 2 } },
      plugins: {
        datalabels: { display: false },
        // @ts-ignore
        htmlLegend: { containerID: idDeLaLégende },
        legend: { display: false },
        tooltip: { callbacks: { label: créeLeLibelléDuTooltip(this.wording) } },
      },
      responsive: true,
      scales: {
        x: { grid: { drawOnChartArea: false }, ticks: { color: 'var(--text-default-grey)' } },
        y: { grid: { color: this.couleurDelAbscisse, drawBorder: false }, stacked: true, ticks: { color: 'var(--text-default-grey)' } },
      },
    }
  }

  private ajouteLePourcentage(valeurs: number[]): string[] {
    return valeurs.map((valeur) => valeur + ' %')
  }
}
