import { BarElement, CategoryScale, Chart as ChartJS, ChartData, ChartOptions, Legend, LegendItem, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'
import '@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css'

import { Wording } from '../../../configuration/wording/Wording'
import { MiseEnExergue } from '../MiseEnExergue/MiseEnExergue'
import { TableIndicateur } from '../TableIndicateur/TableIndicateur'

export type LibelléDeGraphe = Readonly<{
  couleur: string
  tailleDePolice: string
  texte: number | string
}>

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
    entêteLibellé: string,
    identifiant: string,
    annéesTotales: number = 3
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
    const annéesManquantes = this.annéesManquantes(années, annéesTotales)
    const valeursFrançaises = this.transformeEnFrançais(valeurs)

    return (
      <>
        {annéesManquantes.length < annéesTotales &&
          <Bar
            // @ts-ignore
            data={data}
            // @ts-ignore
            options={this.optionsHistogrammeVertical()}
          />
        }
        {annéesManquantes.length > 0 &&
          <MiseEnExergue>
            {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
          </MiseEnExergue>
        }
        <TableIndicateur
          disabled={annéesManquantes.length === annéesTotales}
          entêteLibellé={entêteLibellé}
          identifiants={[identifiant]}
          libellés={années}
          valeurs={[this.ajouteLePourcentage(valeursFrançaises)]}
        />
      </>
    )
  }

  protected afficheUnHistogrammeHorizontal(
    chartColors: string[],
    valeurs: number[],
    libellés: LibelléDeGraphe[],
    ratioLargeurSurHauteur: number,
    entêteLibellé: string,
    identifiant: string,
    libellésDeValeursManquantes: number [] | string[],
    nombreDeLibelléTotal: number = 3
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: chartColors,
          data: valeurs,
          datalabels: { labels: { title: { color: libellés.map((libellé) => libellé.couleur) } } },
          maxBarThickness: 60,
          type: 'bar',
          yAxisID: 'y',
        },
      ],
      labels: libellés.map((libellé) => libellé.texte),
    }
    const valeursFrançaises = this.transformeEnFrançais(valeurs)

    return (
      <>
        {libellésDeValeursManquantes.length < nombreDeLibelléTotal &&
          <Bar
            // @ts-ignore
            data={data}
            // @ts-ignore
            options={this.optionsHistogrammeHorizontal(ratioLargeurSurHauteur, Math.max(...valeurs), libellés.map((libellé) => libellé.tailleDePolice))}
          />
        }
        {libellésDeValeursManquantes.length > 0 &&
          <MiseEnExergue>
            {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${libellésDeValeursManquantes.join(', ')}`}
          </MiseEnExergue>
        }
        <TableIndicateur
          disabled={libellésDeValeursManquantes.length === nombreDeLibelléTotal}
          entêteLibellé={entêteLibellé}
          identifiants={[identifiant]}
          libellés={libellés.map((libellé) => libellé.texte)}
          valeurs={[valeursFrançaises]}
        />
      </>
    )
  }

  protected construisLesLibellés(textes: (number | string)[], valeurs: number[], taillesDePolice: string[]): LibelléDeGraphe[] {
    const maxAvantDePerdreLeContraste = 20

    return textes.map((texte, index) => {
      return {
        couleur: valeurs[index] < maxAvantDePerdreLeContraste ? 'black' : this.couleurDeLaValeur,
        tailleDePolice: taillesDePolice[index],
        texte,
      }
    })
  }

  protected construisLaCouleurDuLabel(valeurs: number[], estHorizontal: boolean = false): string[] {
    const maxAvantDePerdreLeContraste = 20
    const couleurDesAnnées = estHorizontal ? Array(valeurs.length).fill(this.couleurDeLaValeur) : Array(valeurs.length).fill(this.couleurDuFond)

    valeurs.forEach((valeur: number, index: number) => {
      if (valeur < maxAvantDePerdreLeContraste) {
        couleurDesAnnées[index] = 'black'
      }
    })

    return couleurDesAnnées
  }

  protected annéesManquantes(années: number[], annéesTotales: number): number[] {
    const annéeEnCours = new Date().getFullYear()

    return Array(annéesTotales)
      .fill(annéeEnCours)
      .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
      .reverse()
      .filter((année) => !années.includes(année))
  }

  private construisLePluginDeLégende() {
    function créeLeLibelléPourLaLégende(chart: ChartJS, libellé: LegendItem): HTMLLIElement {
      const conteneur = document.createElement('li')

      const caseÀCocher = document.createElement('input')
      caseÀCocher.type = 'checkbox'
      caseÀCocher.id = libellé.text
      caseÀCocher.name = libellé.text
      caseÀCocher.checked = chart.isDatasetVisible(libellé.datasetIndex)

      const libelléCaseÀCocher = document.createElement('label')
      libelléCaseÀCocher.classList.add('fr-label')
      libelléCaseÀCocher.htmlFor = libellé.text

      libelléCaseÀCocher.onclick = () => {
        chart.setDatasetVisibility(libellé.datasetIndex, !chart.isDatasetVisible(libellé.datasetIndex))
        chart.update()
      }

      caseÀCocher.onkeydown = (event) => {
        if (event.code === 'Space') {
          event.preventDefault()
          chart.setDatasetVisibility(libellé.datasetIndex, !chart.isDatasetVisible(libellé.datasetIndex))
          chart.update()
          // @ts-ignore
          document.getElementById(event.target.id).focus()
        }
      }

      const cercleDeCouleur = document.createElement('span')
      cercleDeCouleur.style.background = libellé.fillStyle as string
      cercleDeCouleur.style.border = `solid ${libellé.strokeStyle} 1px`
      cercleDeCouleur.innerHTML = '&nbsp;'
      libelléCaseÀCocher.appendChild(cercleDeCouleur)

      const texteDuLibellé = document.createTextNode(libellé.text)
      libelléCaseÀCocher.appendChild(texteDuLibellé)

      conteneur.appendChild(caseÀCocher)
      conteneur.appendChild(libelléCaseÀCocher)
      return conteneur
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

  private optionsHistogrammeHorizontal(ratioLargeurSurHauteur: number, valeurMaximale: number, grosseursDePoliceDesLibellés: string[]): ChartOptions<'bar'> {
    return {
      animation: false,
      aspectRatio: ratioLargeurSurHauteur,
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
          max: 1.45 * (valeurMaximale > 0 ? valeurMaximale : 1),
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
            font: { weight: grosseursDePoliceDesLibellés },
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

  private ajouteLePourcentage(valeurs: string[]): string[] {
    return valeurs.map((valeur) => valeur + ' %')
  }

  private transformeEnFrançais(valeurs: number[]): string[] {
    return valeurs.map((valeur) => valeur.toLocaleString('fr'))
  }
}
