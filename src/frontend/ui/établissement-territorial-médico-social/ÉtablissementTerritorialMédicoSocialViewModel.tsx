import { ChartData, Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, LineController } from 'chart.js'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialIdentité'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'
import { TableIndicateur } from '../commun/TableIndicateur/TableIndicateur'

export class ÉtablissementTerritorialMédicoSocialViewModel {
  readonly valeurAtypique: number
  readonly fondDeCouleurPourPremierHistogramme: string[]
  readonly fondDeCouleurPourSecondHistogramme: string[]
  readonly couleurDuFond: string = '#E8EDFF'
  readonly couleurDuFondHistogrammePrimaire: string = '#000091'
  readonly couleurDuFondHistogrammeSecondaire: string = '#4E68BB'
  readonly couleurDuFondDeLaLigne: string = '#929292'
  readonly couleurDuFondHistogrammeDeDépassement: string = '#C9191E'
  readonly couleurDelAbscisse: string = '#161616'
  readonly couleurDeLaValeur: string = '#3A3A3A'

  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialMédicoSocialIdentité, private readonly wording: Wording) {
    // TODO: à modifier avec les données du backend
    this.valeurAtypique = 120
    this.fondDeCouleurPourSecondHistogramme = [
      this.couleurDuFond,
      this.couleurDuFond,
      this.couleurDuFond,
    ]
    this.fondDeCouleurPourPremierHistogramme = [
      this.couleurDuFondHistogrammeSecondaire,
      this.couleurDuFondHistogrammeSecondaire,
      this.couleurDuFondHistogrammePrimaire,
    ]

    ChartJS.register(
      BarElement,
      CategoryScale,
      ChartDataLabels,
      LinearScale,
      LineController,
      LineElement,
      PointElement
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
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement()}
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
    const titreDeLEntitéJuridiqueDeRattachement = this.formateLeTitreDeLEntitéJuridiqueDeRattachement()
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
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT)
  }

  public get tauxOccupationHébergementTemporaire(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [70, 121, 67]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE)
  }

  public get tauxOccupationAccueilDeJour(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [0, 15, 20]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR)
  }

  public get tauxRéalisationActivité(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [100, 94, 96]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_RÉALISATION_ACTIVITÉ)
  }

  public get fileActivePersonnesAccompagnées(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [340, 280, 300]
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, dataPoints, labelsColor, labels, this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES)
  }

  public get nombreMoyenJournéesAbsencePersonnesAccompagnées(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [87, 90, 22]
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, dataPoints, labelsColor, labels,
      this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES)
  }

  public get duréeMoyenneSéjourAcompagnementDesPersonnesSorties(): JSX.Element {
    // TODO: à modifier avec les données du backend
    const dataPoints = [1013, 994, 990]
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    // TODO: à modifier avec les données du backend
    const labels = ['2019', '2020', '2021']
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, dataPoints, labelsColor, labels, this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES)
  }

  private afficheUnHistogrammeVertical(chartColors: string[], dataPoints: number[], labelsColor: string[], labels: string[], identifiant: string): JSX.Element {
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
          data: dataPoints,
          datalabels: { labels: { title: { color: labelsColor } } },
          type: 'bar',
          xAxisID: 'x',
        },
        {
          backgroundColor: this.fondDeCouleurPourSecondHistogramme,
          data: [100, 100, 100],
          datalabels: { display: false },
          type: 'bar',
          xAxisID: 'x',
        },
      ],
      labels,
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
          dataPoints={this.ajoutePourcentage(dataPoints)}
          identifiant={identifiant}
          labels={labels}
        />
      </>

    )
  }

  private afficheUnHistogrammeHorizontal(
    chartColors: string[],
    dataPoints: number[],
    labelsColor: string[],
    labels: string[],
    identifiant: string
  ): JSX.Element {
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: chartColors,
          data: dataPoints,
          datalabels: { labels: { title: { color: labelsColor } } },
          type: 'bar',
          yAxisID: 'y',
        },
      ],
      labels,
    }

    return (
      <>
        <Bar
          // @ts-ignore
          data={data}
          // @ts-ignore
          options={this.optionsHistogrammeHorizontal(Math.max(...dataPoints))}
        />
        <TableIndicateur
          dataPoints={dataPoints}
          identifiant={identifiant}
          labels={labels}
        />
      </>

    )
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessEntitéJuridique)
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }

  private optionsHistogrammeVertical() {
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
          ticks: {
            color: this.couleurDelAbscisse,
            font: { weight: ['normal', 'normal', 'bold'] },
          },
        },
        xLine: { display: false, max: 1, min: 0, type: 'linear' },
        y: {
          display: false,
          max: this.valeurAtypique,
          min: 0,
        },
      },
    }
  }
  private optionsHistogrammeHorizontal(maxValue: number) {
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
        },
      },
      scales: {
        x: {
          display: false,
          max: maxValue + 200,
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
            font: { weight: ['normal', 'normal', 'bold'] },
          },
        },
      },
    }
  }

  private construisLeFondDeCouleurDesHistogrammes(dataPoints: number[]) {
    const fondDeCouleurDesHistogrammes = [...this.fondDeCouleurPourPremierHistogramme]

    dataPoints.forEach((dataPoint: number, index: number) => {
      if (dataPoint > this.valeurAtypique) {
        fondDeCouleurDesHistogrammes[index] = this.couleurDuFondHistogrammeDeDépassement
      }
    })

    return fondDeCouleurDesHistogrammes
  }

  private construisLaCouleurDuLabel(dataPoints: number[], isHorizontal: boolean = false): string[] {
    const maxAvantDePerdreLeContraste = 20
    const couleurDesLabels = isHorizontal ? Array(3).fill(this.couleurDeLaValeur) : Array(3).fill(this.couleurDuFond)

    dataPoints.forEach((dataPoint: number, index: number) => {
      if (dataPoint < maxAvantDePerdreLeContraste) {
        couleurDesLabels[index] = 'black'
      }
    })

    return couleurDesLabels
  }

  private ajoutePourcentage(dataPoints: number[]): string[] {
    return dataPoints.map((dataPoint) => dataPoint + ' %')
  }
}
