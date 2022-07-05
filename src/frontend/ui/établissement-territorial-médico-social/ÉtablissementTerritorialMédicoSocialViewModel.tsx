import { ChartData, Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, LineController } from 'chart.js'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'
import { TableIndicateur } from '../commun/TableIndicateur/TableIndicateur'

export class ÉtablissementTerritorialMédicoSocialViewModel {
  readonly seuilValeurAtypique: number
  readonly premièreAnnéeActivité: ÉtablissementTerritorialMédicoSocialActivité
  readonly deuxièmeAnnéeActivité: ÉtablissementTerritorialMédicoSocialActivité
  readonly troisièmeAnnéeActivité: ÉtablissementTerritorialMédicoSocialActivité
  readonly fondDeCouleurPourPremierHistogramme: string[]
  readonly fondDeCouleurPourSecondHistogramme: string[]
  readonly couleurDuFond: string = '#E8EDFF'
  readonly couleurDuFondHistogrammePrimaire: string = '#000091'
  readonly couleurDuFondHistogrammeSecondaire: string = '#4E68BB'
  readonly couleurDuFondDeLaLigne: string = '#929292'
  readonly couleurDuFondHistogrammeDeDépassement: string = '#C9191E'
  readonly couleurDelAbscisse: string = '#161616'
  readonly couleurDeLaValeur: string = '#3A3A3A'

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialMédicoSocial, private readonly wording: Wording) {
    this.seuilValeurAtypique = 120
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
    this.premièreAnnéeActivité = this.établissementTerritorial.activité[0]
    this.deuxièmeAnnéeActivité = this.établissementTerritorial.activité[1]
    this.troisièmeAnnéeActivité = this.établissementTerritorial.activité[2]

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
    return this.établissementTerritorial.identité.numéroFinessEntitéJuridique
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorial.identité.raisonSociale
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessÉtablissementTerritorial)
  }

  public get adresse(): string {
    return `${this.établissementTerritorial.identité.adresseNuméroVoie} ${this.établissementTerritorial.identité.adresseTypeVoie} ${this.établissementTerritorial.identité.adresseVoie} ${this.établissementTerritorial.identité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.établissementTerritorial.identité.téléphone))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorial.identité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const titreDeLEntitéJuridiqueDeRattachement = this.formateLeTitreDeLEntitéJuridiqueDeRattachement()
    return `EJ - ${titreDeLEntitéJuridiqueDeRattachement}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorial.identité.catégorieÉtablissement} - ${this.établissementTerritorial.identité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorial.identité.statutJuridique
  }

  public get monoÉtablissement(): string {
    return this.établissementTerritorial.identité.estMonoÉtablissement ? this.wording.OUI : this.wording.NON
  }

  public get principalOuSecondaire(): string {
    return this.établissementTerritorial.identité.typeÉtablissement === 'P' ?
      this.wording.PRINCIPAL :
      `${this.wording.SECONDAIRE} (${this.wording.PRINCIPAL} : ${StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessÉtablissementPrincipal)})`
  }

  public get dateDeMiseÀJour(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.dateMiseAJourSource)
  }

  public get leTauxOccupationHébergementPermanentEstIlRempli(): boolean {
    return this.estCeQuunChampEstRempli('tauxOccupationHébergementPermanent')
  }

  public get tauxOccupationHébergementPermanent(): JSX.Element {
    const dataPoints = [
      this.transformeEnTaux(this.premièreAnnéeActivité.tauxOccupationHébergementPermanent as number),
      this.transformeEnTaux(this.deuxièmeAnnéeActivité.tauxOccupationHébergementPermanent as number),
      this.transformeEnTaux(this.troisièmeAnnéeActivité.tauxOccupationHébergementPermanent as number),
    ]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT)
  }

  public get leTauxOccupationHébergementTemporaireEstIlRempli(): boolean {
    return this.estCeQuunChampEstRempli('tauxOccupationHébergementTemporaire')
  }

  public get tauxOccupationHébergementTemporaire(): JSX.Element {
    const dataPoints = [
      this.transformeEnTaux(this.premièreAnnéeActivité.tauxOccupationHébergementTemporaire as number),
      this.transformeEnTaux(this.deuxièmeAnnéeActivité.tauxOccupationHébergementTemporaire as number),
      this.transformeEnTaux(this.troisièmeAnnéeActivité.tauxOccupationHébergementTemporaire as number),
    ]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE)
  }

  public get leTauxOccupationAccueilDeJourEstIlRempli(): boolean {
    return this.estCeQuunChampEstRempli('tauxOccupationAccueilDeJour')
  }

  public get tauxOccupationAccueilDeJour(): JSX.Element {
    const dataPoints = [
      this.transformeEnTaux(this.premièreAnnéeActivité.tauxOccupationAccueilDeJour as number),
      this.transformeEnTaux(this.deuxièmeAnnéeActivité.tauxOccupationAccueilDeJour as number),
      this.transformeEnTaux(this.troisièmeAnnéeActivité.tauxOccupationAccueilDeJour as number),
    ]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR)
  }

  public get leTauxRéalisationActivitéEstIlRempli(): boolean {
    return this.estCeQuunChampEstRempli('tauxRéalisationActivité')
  }

  public get tauxRéalisationActivité(): JSX.Element {
    const dataPoints = [
      this.transformeEnTaux(this.premièreAnnéeActivité.tauxRéalisationActivité as number),
      this.transformeEnTaux(this.deuxièmeAnnéeActivité.tauxRéalisationActivité as number),
      this.transformeEnTaux(this.troisièmeAnnéeActivité.tauxRéalisationActivité as number),
    ]
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(dataPoints)
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints)

    return this.afficheUnHistogrammeVertical(chartColors, dataPoints, labelsColor, labels, this.wording.TAUX_RÉALISATION_ACTIVITÉ)
  }

  public get laFileActivePersonnesAccompagnéesEstElleRemplie(): boolean {
    return this.estCeQuunChampEstRempli('fileActivePersonnesAccompagnées')
  }

  public get fileActivePersonnesAccompagnées(): JSX.Element {
    const dataPoints = [
      this.premièreAnnéeActivité.fileActivePersonnesAccompagnées as number,
      this.deuxièmeAnnéeActivité.fileActivePersonnesAccompagnées as number,
      this.troisièmeAnnéeActivité.fileActivePersonnesAccompagnées as number,
    ]
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, dataPoints, labelsColor, labels, this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES)
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRempli(): boolean {
    return this.estCeQuunChampEstRempli('nombreMoyenJournéesAbsencePersonnesAccompagnées')
  }

  public get nombreMoyenJournéesAbsencePersonnesAccompagnées(): JSX.Element {
    const dataPoints = [
      this.premièreAnnéeActivité.nombreMoyenJournéesAbsencePersonnesAccompagnées as number,
      this.deuxièmeAnnéeActivité.nombreMoyenJournéesAbsencePersonnesAccompagnées as number,
      this.troisièmeAnnéeActivité.nombreMoyenJournéesAbsencePersonnesAccompagnées as number,
    ]
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, dataPoints, labelsColor, labels,
      this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES)
  }

  public get laDuréeMoyenneSéjourAcompagnementDesPersonnesSortiesEstElleRempli(): boolean {
    return this.estCeQuunChampEstRempli('duréeMoyenneSéjourAccompagnementPersonnesSorties')
  }

  public get duréeMoyenneSéjourAcompagnementDesPersonnesSorties(): JSX.Element {
    const dataPoints = [
      this.premièreAnnéeActivité.duréeMoyenneSéjourAccompagnementPersonnesSorties as number,
      this.deuxièmeAnnéeActivité.duréeMoyenneSéjourAccompagnementPersonnesSorties as number,
      this.troisièmeAnnéeActivité.duréeMoyenneSéjourAccompagnementPersonnesSorties as number,
    ]
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const labels = [this.premièreAnnéeActivité.année, this.deuxièmeAnnéeActivité.année, this.troisièmeAnnéeActivité.année]
    const labelsColor = this.construisLaCouleurDuLabel(dataPoints, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, dataPoints, labelsColor, labels, this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES)
  }

  private afficheUnHistogrammeVertical(chartColors: string[], dataPoints: number[], labelsColor: string[], labels: number[], identifiant: string): JSX.Element {
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
    labels: number[],
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
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessEntitéJuridique)
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement
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
          max: this.seuilValeurAtypique,
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
      if (dataPoint > this.seuilValeurAtypique) {
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

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }

  private estCeQuunChampEstRempli(champ: string): boolean {
    if (
      // @ts-ignore
      this.premièreAnnéeActivité[champ] === null &&
      // @ts-ignore
      this.deuxièmeAnnéeActivité[champ] === null &&
      // @ts-ignore
      this.troisièmeAnnéeActivité[champ] === null
    ) {
      return false
    }

    return true
  }
}
