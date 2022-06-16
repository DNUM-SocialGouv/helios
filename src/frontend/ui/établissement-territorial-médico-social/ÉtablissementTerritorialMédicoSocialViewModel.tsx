import { ChartData, Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialIdentité'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialMédicoSocialViewModel {
  readonly valeurAtypique: number
  readonly fondDeCouleurPourPremierHistogramme: string[]
  readonly fondDeCouleurPourSecondHistogramme: string[]

  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialMédicoSocialIdentité, private readonly wording: Wording) {
    // TODO: à modifier avec les données du backend
    this.valeurAtypique = 120
    this.fondDeCouleurPourSecondHistogramme = [
      '#E8EDFF',
      '#E8EDFF',
      '#E8EDFF',
    ]
    this.fondDeCouleurPourPremierHistogramme = [
      '#4E68BB',
      '#4E68BB',
      '#000091',
    ]

    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      ChartDataLabels,
      PointElement,
      LineElement
    )
  }

  public get titre(): string {
    return `ET - ${this.numéroFinessÉtablissementTerritorial} - ${this.nomDeLÉtablissementTerritorial}`
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
          &nbsp;
        {'- '}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement}
      </>
    )
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorialIdentité.numéroFinessEntitéJuridique
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSociale
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial)
  }

  public get adresse(): string {
    return `${this.établissementTerritorialIdentité.adresseNuméroVoie} ${this.établissementTerritorialIdentité.adresseTypeVoie} ${this.établissementTerritorialIdentité.adresseVoie} ${this.établissementTerritorialIdentité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.établissementTerritorialIdentité.téléphone))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialIdentité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const titreDeLEntitéJuridiqueDeRattachement = this.formateLeTitreDeLEntitéJuridiqueDeRattachement
    return `EJ - ${titreDeLEntitéJuridiqueDeRattachement}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialIdentité.catégorieÉtablissement} - ${this.établissementTerritorialIdentité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.statutJuridique
  }

  public get monoÉtablissement(): string {
    return this.établissementTerritorialIdentité.estMonoÉtablissement ? this.wording.OUI : this.wording.NON
  }

  public get principalOuSecondaire(): string {
    return this.établissementTerritorialIdentité.typeÉtablissement === 'P' ?
      this.wording.PRINCIPAL :
      `${this.wording.SECONDAIRE} (${this.wording.PRINCIPAL} : ${StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal)})`
  }

  public get dateDeMiseÀJour(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.dateMiseAJourSource)
  }

  public get tauxOccupationHébergementPermanent(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [94, 97, 101]
    const chartColors = this.construitFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construitCouleurDuLabel(dataPoints)

    const data: ChartData = {
      datasets: [
        {
          borderColor: '#929292',
          borderDash: [3, 3],
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'line',
        },
        {
          backgroundColor: chartColors,
          data: dataPoints,
          datalabels: { labels: { title: { color: labelsColor } } },
          type: 'bar',
        },
        {
          backgroundColor: this.fondDeCouleurPourSecondHistogramme,
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'bar',
        },
      ],
      labels,
    }

    return (
      <Bar
        // @ts-ignore
        data={data}
        // @ts-ignore
        options={this.optionsHistogramme()}
      />
    )
  }

  public get tauxOccupationHébergementTemporaire(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [70, 121, 67]
    const chartColors = this.construitFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construitCouleurDuLabel(dataPoints)

    const data: ChartData = {
      datasets: [
        {
          borderColor: '#929292',
          borderDash: [3, 3],
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'line',
        },
        {
          backgroundColor: chartColors,
          data: dataPoints,
          datalabels: { labels: { title: { color: labelsColor } } },
          type: 'bar',
        },
        {
          backgroundColor: this.fondDeCouleurPourSecondHistogramme,
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'bar',
        },
      ],
      labels,
    }

    return (
      <Bar
        // @ts-ignore
        data={data}
        // @ts-ignore
        options={this.optionsHistogramme()}
      />
    )
  }

  public get tauxOccupationHébergementAccueilDeJour(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [0, 15, 20]
    const chartColors = this.construitFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construitCouleurDuLabel(dataPoints)

    const data: ChartData = {
      datasets: [
        {
          borderColor: '#929292',
          borderDash: [3, 3],
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'line',
        },
        {
          backgroundColor: chartColors,
          data: dataPoints,
          datalabels: { labels: { title: { color: labelsColor } } },
          type: 'bar',
        },
        {
          backgroundColor: this.fondDeCouleurPourSecondHistogramme,
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'bar',
        },
      ],
      labels,
    }

    return (
      <Bar
        // @ts-ignore
        data={data}
        // @ts-ignore
        options={this.optionsHistogramme()}
      />
    )
  }

  private get formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessEntitéJuridique)
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }

  private optionsHistogramme() {
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
          formatter: (value: string, _context: Context): string => value + ' %',
        },
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
          ticks: { color: '#000' },
        },
        y: {
          display: false,
          max: this.valeurAtypique,
          min: 0,
        },
      },
    }
  }

  private construitFondDeCouleurDesHistogrammes(dataPoints: number[]) {
    const fondDeCouleurDesHistogrammes = [...this.fondDeCouleurPourPremierHistogramme]

    dataPoints.forEach((dataPoint: number, index: number) => {
      if (dataPoint > this.valeurAtypique) {
        fondDeCouleurDesHistogrammes[index] = '#C9191E'
      }
    })

    return fondDeCouleurDesHistogrammes
  }

  private construitCouleurDuLabel(dataPoints: number[]): string[] {
    const maxAvantDePerdreLeContraste = 20
    const couleurDesLabels = ['white', 'white', 'white']

    dataPoints.forEach((dataPoint: number, index: number) => {
      if (dataPoint < maxAvantDePerdreLeContraste) {
        couleurDesLabels[index] = 'black'
      }
    })

    return couleurDesLabels
  }
}
