import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Chart,
  ChartData,
  Legend,
  LegendItem,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialSanitaire } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { Wording } from '../../configuration/wording/Wording'
import { TableIndicateur } from '../commun/TableIndicateur/TableIndicateur'
import styles from './BlocActivitéSanitaire.module.css'

type DonnéesDeDiagrammeDesSéjoursMCO = Readonly<{
  nombreSéjoursCompletsMédecine: {x: number, y: number | null}[]
  nombreSéjoursCompletsChirurgie: {x: number, y: number | null}[]
  nombreSéjoursCompletsObstétrique: {x: number, y: number | null}[]
  nombreSéjoursPartielsMédecine: {x: number, y: number | null}[]
  nombreSéjoursPartielsChirurgie: {x: number, y: number | null}[]
  nombreSéjoursPartielsObstétrique: {x: number, y: number | null}[]
}>

export class ÉtablissementTerritorialSanitaireViewModel {
  readonly couleurDuFondHistogrammeBleuClair = '#DEE5FD'
  readonly couleurDuFondHistogrammeBleuFoncé = '#2F4077'
  readonly couleurDuFondHistogrammeVertClair = '#DFFDF7'
  readonly couleurDuFondHistogrammeVertFoncé = '#006A6F'
  readonly couleurDuFondHistogrammeRougeClair = '#FEE9E6'
  readonly couleurDuFondHistogrammeRougeFoncé = '#A94645'
  readonly couleurDesAxesHorizontaux = '#161616'
  readonly identifiantDeLaLégende = 'légende-graphique-sanitaire'
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

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, private readonly wording: Wording) {
    const nombreIndicateursActivité = établissementTerritorial.activités.length

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
    return this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorial.identité.numéroFinessÉtablissementTerritorial, 3)
  }

  public get adresse(): string {
    return `${this.établissementTerritorial.identité.adresseNuméroVoie} ${this.établissementTerritorial.identité.adresseTypeVoie} ${this.établissementTerritorial.identité.adresseVoie} ${this.établissementTerritorial.identité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorial.identité.téléphone, 2))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorial.identité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique, 3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement
    return `EJ - ${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorial.identité.catégorieÉtablissement} - ${this.établissementTerritorial.identité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorial.identité.statutJuridique
  }

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.établissementTerritorial.identité.dateMiseAJourSource)
  }

  public get nombreDeSéjoursMédecineChirurgieObstétrique(): JSX.Element {
    const [nombreDeSéjours, années] = this.construisLesSéjoursParAnnée()

    return this.afficheUnHistogrammeÀBandes(nombreDeSéjours, années)
  }

  public get nombreDePassagesAuxUrgences(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs('nombreDePassagesAuxUrgences')
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs, true)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES
    )
  }

  public get lesIndicateursMCOSontIlsRenseignés(): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => (
      (activité['nombreSéjoursPartielsMédecine'] !== null) ||
      (activité['nombreSéjoursCompletsMédecine'] !== null) ||
      (activité['nombreSéjoursPartielsChirurgie'] !== null) ||
      (activité['nombreSéjoursCompletsChirurgie'] !== null) ||
      (activité['nombreSéjoursPartielsObstétrique'] !== null) ||
      (activité['nombreSéjoursCompletsObstétrique'] !== null)))
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorial.activités.length === 0 ? false : true
  }

  private afficheUnHistogrammeÀBandes(nombreDeSéjours: DonnéesDeDiagrammeDesSéjoursMCO, années: number[]): JSX.Element {
    const data = {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsMédecine,
          label: this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
          stack: 'Stack 1',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsMédecine,
          label: this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
          stack: 'Stack 1',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertClair,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsChirurgie,
          label: this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
          stack: 'Stack 2',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertFoncé,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsChirurgie,
          label: this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
          stack: 'Stack 2',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsObstétrique,
          label: this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
          stack: 'Stack 3',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsObstétrique,
          label: this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          stack: 'Stack 3',
        },
      ],
      labels: années,
    }

    const options = this.optionsHistogrammeÀBandes(this.identifiantDeLaLégende)

    return (
      <>
        <Bar
          data={data}
          // @ts-ignore
          options={options}
        />
        <ul
          className={styles['graphique-sanitaire-légende']}
          id={this.identifiantDeLaLégende}
        />
        <TableIndicateur
          identifiants={[
            this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
            this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
            this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
            this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
            this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
            this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          ]}
          libellés={années}
          valeurs={[
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsMédecine),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsMédecine),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsChirurgie),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsChirurgie),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsObstétrique),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsObstétrique),
          ]}
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
      afterUpdate(chart: Chart, _args: Object, options: any) {
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

  private optionsHistogrammeÀBandes(idDeLaLégende: string) {
    return {
      animation: false,
      elements: { bar: { borderWidth: 2 } },
      plugins: {
        datalabels: { display: false },
        htmlLegend: { containerID: idDeLaLégende },
        legend: { display: false },
        tooltip: { callbacks: { label: this.tooltip(this.wording, this.insèreUnEspaceTousLes3Chiffres) } },
      },
      responsive: true,
      scales: {
        x: { grid: { drawOnChartArea: false }, ticks: { color: 'var(--text-default-grey)' } },
        y: { grid: { color: this.couleurDesAxesHorizontaux, drawBorder: false }, stacked: true, ticks: { color: 'var(--text-default-grey)' } },
      },
    }
  }

  private valeursDesNombresDeSéjours(nombresSéjours: {x: number, y: number | null}[]): (string | null)[] {
    return nombresSéjours.map((nombreSéjour) => {
      return nombreSéjour.y ? this.insèreUnEspaceTousLes3Chiffres(nombreSéjour.y) : null
    })
  }

  private tooltip(wording: Wording, formateLesNombres: Function) {
    return function (context: any) {
      const label = `${context.dataset.label} : ${formateLesNombres(context.parsed.y)}`

      if (context.datasetIndex <= 1) {
        const nombreSéjoursHospitalisationPartielleMédecine = context.parsed._stacks.y['0']
        const nombreSéjoursHospitalisationComplèteMédecine = context.parsed._stacks.y['1']
        return [label, `${wording.TOTAL_HOSPITALISATION_MÉDECINE} : ${formateLesNombres(nombreSéjoursHospitalisationPartielleMédecine + nombreSéjoursHospitalisationComplèteMédecine)}`]
      }
      if (context.datasetIndex === 2 || context.datasetIndex === 3) {
        const nombreSéjoursHospitalisationPartielleChirurgie = context.parsed._stacks.y['2']
        const nombreSéjoursHospitalisationComplèteChirurgie = context.parsed._stacks.y['3']
        return [label, `${wording.TOTAL_HOSPITALISATION_CHIRURGIE} : ${formateLesNombres(nombreSéjoursHospitalisationPartielleChirurgie + nombreSéjoursHospitalisationComplèteChirurgie)}`]
      }
      if (context.datasetIndex === 4 || context.datasetIndex === 5) {
        const nombreSéjoursHospitalisationPartielleObstétrique = context.parsed._stacks.y['4']
        const nombreSéjoursHospitalisationComplèteObstétrique = context.parsed._stacks.y['5']
        return [label, `${wording.TOTAL_HOSPITALISATION_OBSTÉTRIQUE} : ${formateLesNombres(nombreSéjoursHospitalisationPartielleObstétrique + nombreSéjoursHospitalisationComplèteObstétrique)}`]
      }
      return label
    }
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique,
      3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
  }

  private insèreUnEspaceTousLes3Chiffres(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }

  private construisLesSéjoursParAnnée(): [DonnéesDeDiagrammeDesSéjoursMCO, number[]] {
    const nombreDeSéjours: DonnéesDeDiagrammeDesSéjoursMCO = {
      nombreSéjoursCompletsChirurgie: [],
      nombreSéjoursCompletsMédecine: [],
      nombreSéjoursCompletsObstétrique: [],
      nombreSéjoursPartielsChirurgie: [],
      nombreSéjoursPartielsMédecine: [],
      nombreSéjoursPartielsObstétrique: [],
    }
    const années: number[] = []

    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      années.push(activité.année)
      nombreDeSéjours.nombreSéjoursCompletsChirurgie.push({ x: activité.année, y: activité.nombreSéjoursCompletsChirurgie })
      nombreDeSéjours.nombreSéjoursCompletsMédecine.push({ x: activité.année, y: activité.nombreSéjoursCompletsMédecine })
      nombreDeSéjours.nombreSéjoursCompletsObstétrique.push({ x: activité.année, y: activité.nombreSéjoursCompletsObstétrique })
      nombreDeSéjours.nombreSéjoursPartielsChirurgie.push({ x: activité.année, y: activité.nombreSéjoursPartielsChirurgie })
      nombreDeSéjours.nombreSéjoursPartielsMédecine.push({ x: activité.année, y: activité.nombreSéjoursPartielsMédecine })
      nombreDeSéjours.nombreSéjoursPartielsObstétrique.push({ x: activité.année, y: activité.nombreSéjoursPartielsObstétrique })
    })
    return [nombreDeSéjours, années]
  }

  private construisLaCouleurDuLabel(valeurs: number[], estHorizontal: boolean = false): string[] {
    const maxAvantDePerdreLeContraste = 20
    const couleurDesAnnées = estHorizontal ? Array(valeurs.length).fill(this.couleurDeLaValeur) : Array(valeurs.length).fill(this.couleurDuFond)

    valeurs.forEach((valeur: number, index: number) => {
      if (valeur < maxAvantDePerdreLeContraste) {
        couleurDesAnnées[index] = 'black'
      }
    })

    return couleurDesAnnées
  }

  private construisLesAnnéesEtSesValeurs(indicateur: keyof ÉtablissementTerritorialSanitaireActivité): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
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
            // TODO
            font: { weight: this.grosseursDePolicePourLesLibellés },
          },
        },
      },
    }
  }
}
