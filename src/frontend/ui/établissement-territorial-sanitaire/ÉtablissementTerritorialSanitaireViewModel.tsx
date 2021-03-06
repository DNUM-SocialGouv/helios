import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialSanitaire } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { Wording } from '../../configuration/wording/Wording'
import { GraphiqueViewModel } from '../commun/Graphique/GraphiqueViewModel'
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

type DonnéesDeDiagrammeDesJournéesPsyEtSsr = Readonly<{
  nombreJournéesComplètesPsy: {x: number, y: number | null}[]
  nombreJournéesComplètesSsr: {x: number, y: number | null}[]
  nombreJournéesPartiellesPsy: {x: number, y: number | null}[]
  nombreJournéesPartiellesSsr: {x: number, y: number | null}[]
}>

export class ÉtablissementTerritorialSanitaireViewModel extends GraphiqueViewModel {
  readonly couleurDuFondHistogrammeBleuClair = '#DEE5FD'
  readonly couleurDuFondHistogrammeBleuFoncé = '#2F4077'
  readonly couleurDuFondHistogrammeVertClair = '#DFFDF7'
  readonly couleurDuFondHistogrammeVertFoncé = '#006A6F'
  readonly couleurDuFondHistogrammeRougeClair = '#FEE9E6'
  readonly couleurDuFondHistogrammeRougeFoncé = '#A94645'
  readonly couleurDesAxesHorizontaux = '#161616'
  readonly identifiantDeLaLégendeDesSéjoursMCO = 'légende-graphique-sanitaire-journées-séjours-mco'
  readonly identifiantDeLaLégendeDesJournéesPsyEtSsr = 'légende-graphique-sanitaire-journées-psy-et-ssr'

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, wording: Wording) {
    super(wording, établissementTerritorial.activités.length)
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
    const [nombreDeSéjours, années] = this.construisLesSéjoursMCOParAnnée()

    return this.afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours, années)
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

  public get nombreDeSéjoursMCOSontIlsRenseignés(): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => (
      (activité['nombreSéjoursPartielsMédecine'] !== null) ||
      (activité['nombreSéjoursCompletsMédecine'] !== null) ||
      (activité['nombreSéjoursPartielsChirurgie'] !== null) ||
      (activité['nombreSéjoursCompletsChirurgie'] !== null) ||
      (activité['nombreSéjoursPartielsObstétrique'] !== null) ||
      (activité['nombreSéjoursCompletsObstétrique'] !== null)))
  }

  public get nombreDeJournéesPsyEtSsrSontIlsRenseignés(): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => (
      (activité['nombreJournéesPartiellesPsy'] !== null) ||
      (activité['nombreJournéesCompletesSsr'] !== null) ||
      (activité['nombreJournéesPartiellesPsy'] !== null) ||
      (activité['nombreJournéesCompletePsy'] !== null)))
  }

  public get nombreDePassagesAuxUrgencesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('nombreDePassagesAuxUrgences')
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorial.activités.length === 0 ? false : true
  }

  public get nombreDeJournéesPsyEtSsr(): JSX.Element {
    const [nombreDeJournées, années] = this.construisLesJournéesPsyEtSsrParAnnée()

    return this.afficheLHistogrammeDesJournéesPsyEtSsr(nombreDeJournées, années)
  }

  private afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours: DonnéesDeDiagrammeDesSéjoursMCO, années: number[]): JSX.Element {
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

    const options = this.optionsHistogrammeÀBandes(
      this.identifiantDeLaLégendeDesSéjoursMCO,
      this.tooltipSéjoursMCO
    )

    return (
      <>
        <Bar
          data={data}
          // @ts-ignore
          options={options}
        />
        <menu
          className={styles['graphique-sanitaire-légende']}
          id={this.identifiantDeLaLégendeDesSéjoursMCO}
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

  private afficheLHistogrammeDesJournéesPsyEtSsr(nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr, années: number[]): JSX.Element {
    const data = {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeJournées.nombreJournéesPartiellesSsr,
          label: this.wording.HOSPITALISATION_PARTIELLE_SSR,
          stack: 'Stack 1',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeJournées.nombreJournéesComplètesSsr,
          label: this.wording.HOSPITALISATION_COMPLÈTE_SSR,
          stack: 'Stack 1',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeJournées.nombreJournéesPartiellesPsy,
          label: this.wording.HOSPITALISATION_PARTIELLE_PSY,
          stack: 'Stack 2',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeJournées.nombreJournéesComplètesPsy,
          label: this.wording.HOSPITALISATION_COMPLÈTE_PSY,
          stack: 'Stack 2',
        },
      ],
      labels: années,
    }

    const options = this.optionsHistogrammeÀBandes(
      this.identifiantDeLaLégendeDesJournéesPsyEtSsr,
      this.tooltipJournéesPsyEtSsr
    )

    return (
      <>
        <Bar
          data={data}
          // @ts-ignore
          options={options}
        />
        <menu
          className={styles['graphique-sanitaire-légende']}
          id={this.identifiantDeLaLégendeDesJournéesPsyEtSsr}
        />
        <TableIndicateur
          identifiants={[
            this.wording.HOSPITALISATION_PARTIELLE_SSR,
            this.wording.HOSPITALISATION_COMPLÈTE_SSR,
            this.wording.HOSPITALISATION_PARTIELLE_PSY,
            this.wording.HOSPITALISATION_COMPLÈTE_PSY,
          ]}
          libellés={années}
          valeurs={[
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesPartiellesSsr),
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesComplètesSsr),
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesPartiellesPsy),
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesComplètesPsy),
          ]}
        />
      </>
    )
  }

  private valeursDesNombresDeSéjours(nombresSéjours: {x: number, y: number | null}[]): (string | null)[] {
    return nombresSéjours.map((nombreSéjour) => {
      return nombreSéjour.y ? (nombreSéjour.y).toLocaleString('fr') : null
    })
  }

  private tooltipSéjoursMCO(wording: Wording) {
    return function (context: any) {
      const label = `${context.dataset.label} : ${(context.parsed.y).toLocaleString('fr')}`

      if (context.datasetIndex <= 1) {
        const nombreSéjoursHospitalisationPartielleMédecine = context.parsed._stacks.y['0']
        const nombreSéjoursHospitalisationComplèteMédecine = context.parsed._stacks.y['1']
        return [label, `${wording.TOTAL_HOSPITALISATION_MÉDECINE} : ${(nombreSéjoursHospitalisationPartielleMédecine + nombreSéjoursHospitalisationComplèteMédecine).toLocaleString('fr')}`]
      }
      if (context.datasetIndex === 2 || context.datasetIndex === 3) {
        const nombreSéjoursHospitalisationPartielleChirurgie = context.parsed._stacks.y['2']
        const nombreSéjoursHospitalisationComplèteChirurgie = context.parsed._stacks.y['3']
        return [label, `${wording.TOTAL_HOSPITALISATION_CHIRURGIE} : ${(nombreSéjoursHospitalisationPartielleChirurgie + nombreSéjoursHospitalisationComplèteChirurgie).toLocaleString('fr')}`]
      }
      if (context.datasetIndex === 4 || context.datasetIndex === 5) {
        const nombreSéjoursHospitalisationPartielleObstétrique = context.parsed._stacks.y['4']
        const nombreSéjoursHospitalisationComplèteObstétrique = context.parsed._stacks.y['5']
        return [label, `${wording.TOTAL_HOSPITALISATION_OBSTÉTRIQUE} : ${(nombreSéjoursHospitalisationPartielleObstétrique + nombreSéjoursHospitalisationComplèteObstétrique).toLocaleString('fr')}`]
      }
      return label
    }
  }

  private tooltipJournéesPsyEtSsr(wording: Wording) {
    return function (context: any) {
      const label = `${context.dataset.label} : ${(context.parsed.y).toLocaleString('fr')}`

      if (context.datasetIndex <= 1) {
        const nombreSéjoursHospitalisationPartielleSsr = context.parsed._stacks.y['0']
        const nombreSéjoursHospitalisationComplèteSsr = context.parsed._stacks.y['1']
        return [label, `${wording.TOTAL_HOSPITALISATION_SSR} : ${(nombreSéjoursHospitalisationPartielleSsr + nombreSéjoursHospitalisationComplèteSsr).toLocaleString('fr')}`]
      }
      if (context.datasetIndex === 2 || context.datasetIndex === 3) {
        const nombreSéjoursHospitalisationPartiellePsy = context.parsed._stacks.y['2']
        const nombreSéjoursHospitalisationComplètePsy = context.parsed._stacks.y['3']
        return [label, `${wording.TOTAL_HOSPITALISATION_PSY} : ${(nombreSéjoursHospitalisationPartiellePsy + nombreSéjoursHospitalisationComplètePsy).toLocaleString('fr')}`]
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

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }

  private construisLesSéjoursMCOParAnnée(): [DonnéesDeDiagrammeDesSéjoursMCO, number[]] {
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

  private construisLesJournéesPsyEtSsrParAnnée(): [DonnéesDeDiagrammeDesJournéesPsyEtSsr, number[]] {
    const nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr = {
      nombreJournéesComplètesPsy: [],
      nombreJournéesComplètesSsr: [],
      nombreJournéesPartiellesPsy: [],
      nombreJournéesPartiellesSsr: [],
    }
    const années: number[] = []

    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      années.push(activité.année)
      nombreDeJournées.nombreJournéesComplètesPsy.push({ x: activité.année, y: activité.nombreJournéesCompletePsy })
      nombreDeJournées.nombreJournéesComplètesSsr.push({ x: activité.année, y: activité.nombreJournéesCompletesSsr })
      nombreDeJournées.nombreJournéesPartiellesPsy.push({ x: activité.année, y: activité.nombreJournéesPartiellesPsy })
      nombreDeJournées.nombreJournéesPartiellesSsr.push({ x: activité.année, y: activité.nombreJournéesPartielsSsr })
    })
    return [nombreDeJournées, années]
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

  private lIndicateurEstIlRenseigné(indicateur: keyof ÉtablissementTerritorialSanitaireActivité): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur] !== null)
  }
}
