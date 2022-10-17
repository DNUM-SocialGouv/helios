import { BarElement, CategoryScale, Chart as ChartJS, ChartData, ChartOptions, Legend, LegendItem, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'
import '@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css'

import { Wording } from '../../../configuration/wording/Wording'
import { MiseEnExergue } from '../MiseEnExergue/MiseEnExergue'
import { TableIndicateur } from '../TableIndicateur/TableIndicateur'

export type LibelléDeDonnéeGraphe = Readonly<{
  couleur: string
}>

export type LibelléDeTickGraphe = Readonly<{
  tailleDePolice: string
}>

export type CouleurHistogramme = Readonly<{
  premierPlan: string
  secondPlan: string
}>

export class GraphiqueViewModel {
  readonly ratioMinHistogrammeHorizontal = 2
  readonly ratioMaxHistogrammeHorizontal = 15
  readonly facteurDiminutionHistogrammeHorizontal = 1.5
  readonly couleurDuFond = '#E8EDFF'
  readonly couleurDuFondHistogrammePrimaire = '#000091'
  readonly couleurDuFondHistogrammeSecondaire = '#4E68BB'
  readonly couleurDuFondDeLaLigne = '#929292'
  readonly couleurDuFondHistogrammeDeDépassement = '#C9191E'
  readonly couleurSecondPlanHistogrammeDeDépassement = '#FFE9E9'
  readonly couleurDelAbscisse = '#161616'
  readonly couleurDeLaValeur = '#3A3A3A'
  readonly couleurIdentifiant = '#000'
  readonly policeGrasse = 'bold'
  readonly policeNormale = 'normal'

  constructor(protected readonly wording: Wording) {
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
    valeurs: number[],
    libellés: (number | string)[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    libellésDesTicks: LibelléDeTickGraphe[],
    entêteLibellé: string,
    identifiant: string,
    annéesTotales: number = 3
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          borderColor: this.couleurDuFondDeLaLigne,
          borderDash: [3, 3],
          borderWidth: 2,
          data: [
            { x: -1, y: 100 },
            { x: 2, y: 100 },
          ],
          datalabels: { display: false },
          type: 'line',
          xAxisID: 'xLine',
        },
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          data: valeurs,
          datalabels: { labels: { title: { color: libellésDesValeurs.map((libellé) => libellé.couleur) } } },
          maxBarThickness: 60,
          type: 'bar',
          xAxisID: 'x',
        },
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
          data: Array(valeurs.length).fill(100),
          datalabels: { display: false },
          maxBarThickness: 60,
          type: 'bar',
          xAxisID: 'x',
        },
      ],
      labels: libellés,
    }
    const annéesManquantes = this.annéesManquantes(libellés, annéesTotales)
    const valeursFrançaises = this.transformeEnFrançais(valeurs) as string[]

    return (
      <>
        {annéesManquantes.length < annéesTotales && (
          <Bar
            // @ts-ignore
            data={data}
            options={this.optionsHistogrammeVertical(libellésDesTicks.map((libelléDuTick) => libelléDuTick.tailleDePolice))}
          />
        )}
        {annéesManquantes.length > 0 && <MiseEnExergue>
          {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
        </MiseEnExergue>}
        <TableIndicateur
          disabled={annéesManquantes.length === annéesTotales}
          entêteLibellé={entêteLibellé}
          identifiants={[identifiant]}
          libellés={libellés}
          valeurs={[this.ajouteLePourcentage(valeursFrançaises)]}
        />
      </>
    )
  }

  protected construisLesCouleursDeLHistogramme(
    valeurs: number[],
    libellés: (number | string)[],
    calculeLaCouleurDesBarresDeLHistogramme: (valeur: number, libellés: number | string) => CouleurHistogramme
  ): CouleurHistogramme[] {
    return valeurs.map((valeur: number, index: number) => {
      return calculeLaCouleurDesBarresDeLHistogramme(valeur, libellés[index])
    })
  }

  protected estCeLAnnéePassée(année: number | string): boolean {
    return new Date().getFullYear() - 1 === Number(année)
  }

  protected afficheUnHistogrammeHorizontal(
    valeurs: number[],
    libellés: (number | string)[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    libellésDesTicks: LibelléDeTickGraphe[],
    ratioLargeurSurHauteur: number,
    entêteLibellé: string,
    identifiant: string,
    libellésDeValeursManquantes: number[] | string[],
    nombreDeLibelléTotal: number = 3
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          data: valeurs,
          datalabels: { labels: { title: { color: libellésDesValeurs.map((libellé) => libellé.couleur) } } },
          maxBarThickness: 60,
          type: 'bar',
          yAxisID: 'y',
        },
      ],
      labels: libellés,
    }
    const valeursFrançaises = this.transformeEnFrançais(valeurs)

    return (
      <>
        {libellésDeValeursManquantes.length < nombreDeLibelléTotal && (
          <Bar
            // @ts-ignore
            data={data}
            options={this.optionsHistogrammeHorizontal(
              ratioLargeurSurHauteur,
              Math.max(...valeurs),
              libellésDesTicks.map((libellé) => libellé.tailleDePolice)
            )}
          />
        )}
        {libellésDeValeursManquantes.length > 0 && (
          <MiseEnExergue>
            {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${libellésDeValeursManquantes.join(', ')}`}
          </MiseEnExergue>
        )}
        <TableIndicateur
          disabled={libellésDeValeursManquantes.length === nombreDeLibelléTotal}
          entêteLibellé={entêteLibellé}
          identifiants={[identifiant]}
          libellés={libellés}
          valeurs={[valeursFrançaises]}
        />
      </>
    )
  }

  protected afficheDeuxHistogrammesHorizontaux(
    chartColors: string[],
    lits: (number | null)[],
    places: (number | null)[],
    libellés: string[],
    ratioLargeurSurHauteur: number,
    entêteLibellé: string,
    identifiants: string[]
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: chartColors,
          data: lits,
          datalabels: { labels: { title: { color: this.couleurDeLaValeur } } },
          type: 'bar',
          xAxisID: 'x2',
        },
        {
          backgroundColor: chartColors,
          data: places,
          datalabels: { labels: { title: { color: this.couleurDeLaValeur } } },
          type: 'bar',
          xAxisID: 'x',
        },
      ],
      labels: libellés,
    }
    const valeurs = [this.transformeEnFrançais(lits), this.transformeEnFrançais(places)]

    return (
      <>
        <div>
          <Bar
            // @ts-ignore
            data={data}
            options={this.optionsDeuxHistogrammesHorizontaux(ratioLargeurSurHauteur, Math.max(...lits.map(Number), ...places.map(Number)))}
          />
        </div>
        <TableIndicateur
          entêteLibellé={entêteLibellé}
          identifiants={identifiants}
          libellés={libellés}
          valeurs={valeurs}
        />
      </>
    )
  }

  protected construisLesLibellés(textes: (number | string)[], valeurs: number[], taillesDePolice: string[]): LibelléDeTickGraphe[] {
    const maxAvantDePerdreLeContraste = 20

    return textes.map((texte, index) => {
      return {
        couleur: valeurs[index] < maxAvantDePerdreLeContraste ? 'black' : this.couleurDeLaValeur,
        tailleDePolice: taillesDePolice[index],
        texte,
      }
    })
  }

  protected construisLaCouleurDuLabel(valeurs: number[], seuilMaximal: number, estHorizontal: boolean = false): string[] {
    const maxAvantDePerdreLeContraste = 0.2 * seuilMaximal
    const couleurDesAnnées = estHorizontal ? Array(valeurs.length).fill(this.couleurDeLaValeur) : Array(valeurs.length).fill(this.couleurDuFond)

    valeurs.forEach((valeur: number, index: number) => {
      if (valeur < maxAvantDePerdreLeContraste) {
        couleurDesAnnées[index] = 'black'
      }
    })

    return couleurDesAnnées
  }

  protected annéesManquantes(années: (number | string)[], annéesTotales: number): number[] {
    const annéeEnCours = new Date().getFullYear()

    return Array(annéesTotales)
      .fill(annéeEnCours)
      .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
      .reverse()
      .filter((année) => !années.includes(année))
  }

  protected calculeLeRatioDesHistogrammesHorizontaux(nombreDeLignes: number): number {
    return this.ratioMaxHistogrammeHorizontal - this.facteurDiminutionHistogrammeHorizontal * nombreDeLignes > this.ratioMinHistogrammeHorizontal
      ? this.ratioMaxHistogrammeHorizontal - this.facteurDiminutionHistogrammeHorizontal * nombreDeLignes
      : this.ratioMinHistogrammeHorizontal
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

        if (!légende) return

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

  private optionsHistogrammeVertical(grosseursDePoliceDesLibellés: string[]): ChartOptions<'bar'> {
    return {
      animation: false,
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'start',
          font: {
            family: 'Marianne',
            size: 16,
            weight: 700,
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
            font: { weight: grosseursDePoliceDesLibellés },
            padding: 10,
          },
        },
        xLine: { display: false, max: 1, min: 0, type: 'linear' },
        y: { display: false },
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
            padding: 8,
          },
        },
      },
    }
  }

  private optionsDeuxHistogrammesHorizontaux(ratioLargeurSurHauteur: number, valeurMaximale: number): ChartOptions<'bar'> {
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
            weight: 700,
          },
          formatter: (value: string, _context: Context): string => {
            if (value === null) {
              return 'N/A'
            }
            return parseFloat(value).toLocaleString('fr')
          },
          offset: 0,
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          max: valeurMaximale * 1.1,
          position: 'top',
          stack: 'capacite',
          stackWeight: 1,
          ticks: { display: false },
          title: {
            align: 'start',
            color: this.couleurIdentifiant,
            display: true,
            text: this.wording.PLACES,
          },
        },
        x2: {
          grid: { display: false, drawBorder: false },
          max: valeurMaximale * 1.1,
          position: 'top',
          stack: 'capacite',
          stackWeight: 2,
          ticks: { display: false },
          title: {
            align: 'start',
            color: this.couleurIdentifiant,
            display: true,
            text: this.wording.LITS,
          },
        },
        y: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          stacked: true,
          ticks: { color: this.couleurDelAbscisse },
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

  protected ajouteLePourcentage(valeurs: string[]): string[] {
    return valeurs.map((valeur) => valeur + ' %')
  }

  protected transformeEnFrançais(valeurs: (number | null)[]): (string | null)[] {
    return valeurs.map((valeur) => {
      if (valeur === null) return valeur

      return valeur.toLocaleString('fr')
    })
  }
}
