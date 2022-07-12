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
  readonly seuilValeurAtypique = 120
  readonly couleurDuFond = '#E8EDFF'
  readonly couleurDuFondHistogrammePrimaire = '#000091'
  readonly couleurDuFondHistogrammeSecondaire = '#4E68BB'
  readonly couleurDuFondDeLaLigne = '#929292'
  readonly couleurDuFondHistogrammeDeDépassement = '#C9191E'
  readonly couleurDelAbscisse = '#161616'
  readonly couleurDeLaValeur = '#3A3A3A'
  readonly fondDeCouleurPourPremierHistogramme = [
    this.couleurDuFondHistogrammeSecondaire,
    this.couleurDuFondHistogrammeSecondaire,
    this.couleurDuFondHistogrammePrimaire,
  ]
  readonly fondDeCouleurPourSecondHistogramme = [
    this.couleurDuFond,
    this.couleurDuFond,
    this.couleurDuFond,
  ]

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialMédicoSocial, private readonly wording: Wording) {
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

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorial.activités.length === 0 ? false : true
  }

  public get leTauxOccupationHébergementPermanentEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxOccupationHébergementPermanent')
  }

  public get tauxOccupationHébergementPermanent(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxOccupationHébergementPermanent')
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(valeurs)
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs)

    return this.afficheUnHistogrammeVertical(chartColors, valeurs, dataLabelsColor, années, this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT)
  }

  public get leTauxOccupationHébergementTemporaireEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxOccupationHébergementTemporaire')
  }

  public get tauxOccupationHébergementTemporaire(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxOccupationHébergementTemporaire')
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(valeurs)
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs)

    return this.afficheUnHistogrammeVertical(chartColors, valeurs, dataLabelsColor, années, this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE)
  }

  public get leTauxOccupationAccueilDeJourEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxOccupationAccueilDeJour')
  }

  public get tauxOccupationAccueilDeJour(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxOccupationAccueilDeJour')
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(valeurs)
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs)

    return this.afficheUnHistogrammeVertical(chartColors, valeurs, dataLabelsColor, années, this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR)
  }

  public get leTauxRéalisationActivitéEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxRéalisationActivité')
  }

  public get tauxRéalisationActivité(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxRéalisationActivité')
    const chartColors = this.construisLeFondDeCouleurDesHistogrammes(valeurs)
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs)

    return this.afficheUnHistogrammeVertical(chartColors, valeurs, dataLabelsColor, années, this.wording.TAUX_RÉALISATION_ACTIVITÉ)
  }

  public get laFileActivePersonnesAccompagnéesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigné('fileActivePersonnesAccompagnées')
  }

  public get fileActivePersonnesAccompagnées(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs('fileActivePersonnesAccompagnées')
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, valeurs, dataLabelsColor, années, this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES)
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('nombreMoyenJournéesAbsencePersonnesAccompagnées')
  }

  public get nombreMoyenJournéesAbsencePersonnesAccompagnées(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs('nombreMoyenJournéesAbsencePersonnesAccompagnées')
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs, true)

    return this.afficheUnHistogrammeHorizontal(chartColors, valeurs, dataLabelsColor, années,
      this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES)
  }

  public get laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigné('duréeMoyenneSéjourAccompagnementPersonnesSorties')
  }

  public get duréeMoyenneSéjourAccompagnementPersonnesSorties(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs('duréeMoyenneSéjourAccompagnementPersonnesSorties')
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs, true)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES
    )
  }

  private afficheUnHistogrammeVertical(
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

  private afficheUnHistogrammeHorizontal(
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

  private formateLeTitreDeLEntitéJuridiqueDeRattachement(): string {
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

  private optionsHistogrammeHorizontal(valeurMaximale: number) {
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
            font: { weight: ['normal', 'normal', 'bold'] },
          },
        },
      },
    }
  }

  private construisLesAnnéesEtSesTaux(indicateur: keyof ÉtablissementTerritorialMédicoSocialActivité): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
      if (activité[indicateur] !== null) {
        années.push(activité.année)
      }

      if (activité[indicateur] !== null) {
        // @ts-ignore
        valeurs.push(this.transformeEnTaux(activité[indicateur]))
      }
    })

    return [valeurs, années]
  }

  private construisLesAnnéesEtSesValeurs(indicateur: keyof ÉtablissementTerritorialMédicoSocialActivité): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
      if (activité[indicateur] !== null) {
        années.push(activité.année)
      }

      if (activité[indicateur] !== null) {
        // @ts-ignore
        valeurs.push(activité[indicateur])
      }
    })

    return [valeurs, années]
  }

  private construisLeFondDeCouleurDesHistogrammes(valeurs: number[]): string[] {
    const fondDeCouleurDesHistogrammes = [...this.fondDeCouleurPourPremierHistogramme]

    valeurs.forEach((valeur: number, index: number) => {
      if (valeur > this.seuilValeurAtypique) {
        fondDeCouleurDesHistogrammes[index] = this.couleurDuFondHistogrammeDeDépassement
      }
    })

    return fondDeCouleurDesHistogrammes
  }

  private construisLaCouleurDuLabel(valeurs: number[], estHorizontal: boolean = false): string[] {
    const maxAvantDePerdreLeContraste = 20
    const couleurDesAnnées = estHorizontal ? Array(3).fill(this.couleurDeLaValeur) : Array(3).fill(this.couleurDuFond)

    valeurs.forEach((valeur: number, index: number) => {
      if (valeur < maxAvantDePerdreLeContraste) {
        couleurDesAnnées[index] = 'black'
      }
    })

    return couleurDesAnnées
  }

  private ajouteLePourcentage(valeurs: number[]): string[] {
    return valeurs.map((valeur) => valeur + ' %')
  }

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }

  private lIndicateurEstIlRenseigné(indicateur: keyof ÉtablissementTerritorialMédicoSocialActivité): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur] !== null)
  }
}
