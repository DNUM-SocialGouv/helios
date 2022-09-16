import Link from 'next/link'
import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialSanitaire } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { Paths } from '../../configuration/Paths'
import { Wording } from '../../configuration/wording/Wording'
import { ActionneurDAccordéon } from '../commun/Accordéon/ActionneurDAccordéon'
import { GraphiqueViewModel } from '../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../commun/StringFormater'
import { TableIndicateur } from '../commun/TableIndicateur/TableIndicateur'
import stylesBlocActivité from './BlocActivitéSanitaire.module.css'
import stylesBlocAutorisationsEtCapacités from './BlocAutorisationEtCapacitéSanitaire.module.css'
import '@gouvfr/dsfr/dist/component/tag/tag.min.css'

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
  readonly ratioHistogrammeNombreDePassagesAuxUrgences = 7
  readonly ratioHistogrammeCapacitéParActivités = 5

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, wording: Wording, private readonly paths: Paths) {
    super(wording, établissementTerritorial.activités.length)
  }

  public get titre(): string {
    return `ET - ${this.numéroFinessÉtablissementTerritorial} - ${this.nomDeLÉtablissementTerritorial}`
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {' - '}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement()}
      </>
    )
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorial.identité.raisonSociale.value
  }

  public get dateDeMiseÀJourDuNomDeLÉtablissementTerritorial(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.raisonSociale.dateMiseÀJourSource)
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorial.identité.numéroFinessÉtablissementTerritorial.value, 3)
  }

  public get dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.numéroFinessÉtablissementTerritorial.dateMiseÀJourSource)
  }

  public get adresse(): string {
    return `${this.établissementTerritorial.identité.adresseNuméroVoie.value} ${this.établissementTerritorial.identité.adresseTypeVoie.value} ${this.établissementTerritorial.identité.adresseVoie.value} ${this.établissementTerritorial.identité.adresseAcheminement.value}`
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.adresseNuméroVoie.dateMiseÀJourSource)
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorial.identité.téléphone.value, 2))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorial.identité.courriel.value)
    return `${téléphoneFormaté} | ${email}`
  }

  public get dateDeMiseÀJourDutéléphoneEtDeLEmail(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.téléphone.dateMiseÀJourSource)
  }

  public get entitéJuridiqueDeRattachement(): JSX.Element {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value}`
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value, 3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value
    const libellé = `EJ - ${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`

    return (<Link
      href={lienVersLEntitéJuridique}
      passHref
      prefetch={false}
    >
      {libellé}
    </Link>)
  }

  public get dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.dateMiseÀJourSource)
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorial.identité.catégorieÉtablissement.value} - ${this.établissementTerritorial.identité.libelléCatégorieÉtablissement.value}`
  }

  public get dateDeMiseÀJourDeLaCatégorieDeLÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.catégorieÉtablissement.dateMiseÀJourSource)
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorial.identité.statutJuridique.value
  }

  public get dateDeMiseÀJourDuStatutDeLÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.statutJuridique.dateMiseÀJourSource)
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorial.activités.length === 0 ? false : true
  }

  public get nombreDeSéjoursMCOSontIlsRenseignés(): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => (
      activité['nombreSéjoursPartielsMédecine'].value !== null ||
      activité['nombreSéjoursCompletsMédecine'].value !== null ||
      activité['nombreSéjoursPartielsChirurgie'].value !== null ||
      activité['nombreSéjoursCompletsChirurgie'].value !== null ||
      activité['nombreSéjoursPartielsObstétrique'].value !== null ||
      activité['nombreSéjoursCompletsObstétrique'].value !== null))
  }

  public get nombreDeSéjoursMédecineChirurgieObstétrique(): JSX.Element {
    const [nombreDeSéjours, années] = this.construisLesSéjoursMCOParAnnée()

    return this.afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours, années)
  }

  public get dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].nombreSéjoursCompletsMédecine.dateMiseÀJourSource)
  }

  public get nombreDeJournéesPsyEtSsrSontIlsRenseignés(): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => (
      activité['nombreJournéesPartiellesPsy'].value !== null ||
      activité['nombreJournéesCompletesSsr'].value !== null ||
      activité['nombreJournéesPartiellesPsy'].value !== null ||
      activité['nombreJournéesCompletePsy'].value !== null))
  }

  public get nombreDeJournéesPsyEtSsr(): JSX.Element {
    const [nombreDeJournées, années] = this.construisLesJournéesPsyEtSsrParAnnée()

    return this.afficheLHistogrammeDesJournéesPsyEtSsr(nombreDeJournées, années)
  }

  public get dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].nombreJournéesCompletePsy.dateMiseÀJourSource)
  }

  public get nombreDePassagesAuxUrgencesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('nombreDePassagesAuxUrgences')
  }

  public get nombreDePassagesAuxUrgences(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs('nombreDePassagesAuxUrgences')
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const annéesManquantes = this.annéesManquantes(années, 5)
    const libellés = this.construisLesLibellés(années, valeurs, this.grosseursDePolicePourLesLibellés)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      libellés,
      this.ratioHistogrammeNombreDePassagesAuxUrgences,
      this.wording.ANNÉE,
      this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES,
      annéesManquantes,
      5
    )
  }

  public get dateDeMiseÀJourDuNombreDePassagesAuxUrgences(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].nombreDePassagesAuxUrgences.dateMiseÀJourSource)
  }

  public get lesCapacitésParActivitésSontEllesRenseignées(): boolean {
    const capacités = this.établissementTerritorial.autorisationsEtCapacités.capacités

    return (capacités !== null) && (
      capacités.nombreDeLitsEnMédecine !== null ||
      capacités.nombreDeLitsEnObstétrique !== null ||
      capacités.nombreDeLitsEnSsr !== null ||
      capacités.nombreDePlacesEnChirurgie !== null ||
      capacités.nombreDePlacesEnMédecine !== null ||
      capacités.nombreDePlacesEnObstétrique !== null ||
      capacités.nombreDePlacesEnSsr !== null ||
      capacités.nombreDeLitsEnUsld !== null ||
      capacités.nombreDeLitsOuPlacesEnPsyHospitalisationComplète !== null ||
    capacités.nombreDePlacesEnPsyHospitalisationPartielle !== null)
  }

  public get dateDeMiseÀJourDeLaCapacitéInstalléeParActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.capacités?.dateMiseÀJourSource as string)
  }

  public get capacitéParActivités(): JSX.Element {
    const lits = [
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDeLitsEnChirurgie as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDeLitsEnMédecine as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDeLitsEnObstétrique as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDeLitsOuPlacesEnPsyHospitalisationComplète as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDeLitsEnSsr as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDeLitsEnUsld as number,
    ]
    const places = [
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDePlacesEnChirurgie as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDePlacesEnMédecine as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDePlacesEnObstétrique as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDePlacesEnPsyHospitalisationPartielle as number,
      this.établissementTerritorial.autorisationsEtCapacités.capacités?.nombreDePlacesEnSsr as number,
      0,
    ]
    const chartColors = [this.couleurDuFondHistogrammeSecondaire]
    const libellés = [
      this.wording.CHIRURGIE,
      this.wording.MÉDECINE,
      this.wording.OBSTÉTRIQUE,
      this.wording.PSYCHIATRIE,
      this.wording.SSR,
      this.wording.USLD,
    ]
    const identifiants = [this.wording.LITS, this.wording.PLACES]

    return this.afficheDeuxHistogrammesHorizontaux(
      chartColors,
      lits,
      places,
      libellés,
      this.ratioHistogrammeCapacitéParActivités,
      this.wording.ACTIVITÉS,
      identifiants
    )
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
          options={options}
        />
        <menu
          className={'fr-checkbox-group ' + stylesBlocActivité['graphique-sanitaire-légende']}
          id={this.identifiantDeLaLégendeDesSéjoursMCO}
        />
        <TableIndicateur
          entêteLibellé={this.wording.ANNÉE}
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
          options={options}
        />
        <menu
          className={'fr-checkbox-group ' + stylesBlocActivité['graphique-sanitaire-légende']}
          id={this.identifiantDeLaLégendeDesJournéesPsyEtSsr}
        />
        <TableIndicateur
          entêteLibellé={this.wording.ANNÉE}
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
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value,
      3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
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
      nombreDeSéjours.nombreSéjoursCompletsChirurgie.push({ x: activité.année, y: activité.nombreSéjoursCompletsChirurgie.value })
      nombreDeSéjours.nombreSéjoursCompletsMédecine.push({ x: activité.année, y: activité.nombreSéjoursCompletsMédecine.value })
      nombreDeSéjours.nombreSéjoursCompletsObstétrique.push({ x: activité.année, y: activité.nombreSéjoursCompletsObstétrique.value })
      nombreDeSéjours.nombreSéjoursPartielsChirurgie.push({ x: activité.année, y: activité.nombreSéjoursPartielsChirurgie.value })
      nombreDeSéjours.nombreSéjoursPartielsMédecine.push({ x: activité.année, y: activité.nombreSéjoursPartielsMédecine.value })
      nombreDeSéjours.nombreSéjoursPartielsObstétrique.push({ x: activité.année, y: activité.nombreSéjoursPartielsObstétrique.value })
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
      nombreDeJournées.nombreJournéesComplètesPsy.push({ x: activité.année, y: activité.nombreJournéesCompletePsy.value })
      nombreDeJournées.nombreJournéesComplètesSsr.push({ x: activité.année, y: activité.nombreJournéesCompletesSsr.value })
      nombreDeJournées.nombreJournéesPartiellesPsy.push({ x: activité.année, y: activité.nombreJournéesPartiellesPsy.value })
      nombreDeJournées.nombreJournéesPartiellesSsr.push({ x: activité.année, y: activité.nombreJournéesPartielsSsr.value })
    })
    return [nombreDeJournées, années]
  }

  private construisLesAnnéesEtSesValeurs(indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      if (activité[indicateur].value !== null) {
        années.push(activité.année)
      }

      if (activité[indicateur].value !== null) {
        // @ts-ignore
        valeurs.push(activité[indicateur].value)
      }
    })

    return [valeurs, années]
  }

  private lIndicateurEstIlRenseigné(indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur].value !== null)
  }

  public get autorisations(): JSX.Element {
    const autorisationsDeLÉtablissement = this.établissementTerritorial.autorisationsEtCapacités.autorisations

    return (
      <ul
        aria-label="activités"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {autorisationsDeLÉtablissement.activités.map((activité) => (
          <li
            key={`activité-${activité.code}`}
          >
            <ActionneurDAccordéon
              for={`autorisations-accordion-${activité.code}`}
              titre={`${activité.libellé} [${activité.code}]`}
            />
            <ul
              className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`autorisations-accordion-${activité.code}`}
            >
              {
                activité.modalités.map((modalité) => (
                  <li
                    key={`modalité-${modalité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`autorisations-accordion-${activité.code}-${modalité.code}`}
                      texteGras={false}
                      titre={`${modalité.libellé} [${modalité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-formes']}`}
                      id={`autorisations-accordion-${activité.code}-${modalité.code}`}
                    >
                      {
                        modalité.formes.map((forme) => {
                          const autorisationSanitaire = forme.autorisationSanitaire
                          return (
                            <li key={`forme-${forme.code}`}>
                              <ul
                                aria-label="autorisations"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${forme.libellé} [${forme.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.NUMÉRO_ARHGOS} : ${autorisationSanitaire.numéroArhgos ? autorisationSanitaire.numéroArhgos : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autorisationSanitaire.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autorisationSanitaire.dateDeMiseEnOeuvre) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_FIN} : ${autorisationSanitaire.dateDeFin ? StringFormater.formateLaDate(autorisationSanitaire.dateDeFin) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_D_AUTORISATION} : ${autorisationSanitaire.dateDAutorisation ? StringFormater.formateLaDate(autorisationSanitaire.dateDAutorisation) : 'N/A'}`}
                                </li>
                              </ul>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </li>
                ))
              }
            </ul>
          </li>
        ))}
      </ul>
    )
  }

  public get lesAutorisationsSontEllesRenseignées(): boolean {
    return this.établissementTerritorial.autorisationsEtCapacités.autorisations.activités.length !== 0
  }

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.autorisations.dateMiseÀJourSource)
  }

  public get autresActivités(): JSX.Element {
    const autresActivitésDeLÉtablissement = this.établissementTerritorial.autorisationsEtCapacités.autresActivités

    return (
      <ul
        aria-label="activités"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {autresActivitésDeLÉtablissement.activités.map((activité) => (
          <li
            key={`activité-${activité.code}`}
          >
            <ActionneurDAccordéon
              for={`autresActivités-accordion-${activité.code}`}
              titre={`${activité.libellé} [${activité.code}]`}
            />
            <ul
              className={` fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`autresActivités-accordion-${activité.code}`}
            >
              {
                activité.modalités.map((modalité) => (
                  <li
                    key={`modalité-${modalité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`autresActivités-accordion-${activité.code}-${modalité.code}`}
                      texteGras={false}
                      titre={`${modalité.libellé} [${modalité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-formes']}`}
                      id={`autresActivités-accordion-${activité.code}-${modalité.code}`}
                    >
                      {
                        modalité.formes.map((forme) => {
                          const autreActivitéSanitaire = forme.autreActivitéSanitaire
                          return (
                            <li key={`forme-${forme.code}`}>
                              <ul
                                aria-label="autre-activité"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${forme.libellé} [${forme.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autreActivitéSanitaire.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDeMiseEnOeuvre) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_FIN} : ${autreActivitéSanitaire.dateDeFin ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDeFin) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_D_AUTORISATION} : ${autreActivitéSanitaire.dateDAutorisation ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDAutorisation) : 'N/A'}`}
                                </li>
                              </ul>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </li>
                ))
              }
            </ul>
          </li>
        ))}
      </ul>
    )
  }

  public get dateDeMiseÀJourDesAutresActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.autresActivités.dateMiseÀJourSource)
  }

  public get lesAutresActivitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorial.autorisationsEtCapacités.autresActivités.activités.length !== 0
  }

  public get reconnaissancesContractuelles(): JSX.Element {
    const reconnaissancesContractuellesDeLÉtablissement = this.établissementTerritorial.autorisationsEtCapacités.reconnaissancesContractuelles

    return (
      <ul
        aria-label="activités"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {reconnaissancesContractuellesDeLÉtablissement.activités.map((activité) => (
          <li
            key={`activité-${activité.code}`}
          >
            <ActionneurDAccordéon
              for={`reconnaissances-contractuelles-accordion-${activité.code}`}
              titre={`${activité.libellé} [${activité.code}]`}
            />
            <ul
              className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`reconnaissances-contractuelles-accordion-${activité.code}`}
            >
              {
                activité.modalités.map((modalité) => (
                  <li
                    key={`modalité-${modalité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`reconnaissances-contractuelles-accordion-${activité.code}-${modalité.code}`}
                      texteGras={false}
                      titre={`${modalité.libellé} [${modalité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-formes']}`}
                      id={`reconnaissances-contractuelles-accordion-${activité.code}-${modalité.code}`}
                    >
                      {
                        modalité.formes.map((forme) => {
                          const reconnaissancesContractuellesSanitaire = forme.reconnaissanceContractuelleSanitaire
                          return (
                            <li key={`forme-${forme.code}`}>
                              <ul
                                aria-label="reconnaissance-contractuelle"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${forme.libellé} [${forme.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.CAPACITÉ_AUTORISÉE} : ${reconnaissancesContractuellesSanitaire.capacitéAutorisée ? reconnaissancesContractuellesSanitaire.capacitéAutorisée : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.DATE_D_EFFET_ASR}
                                  {`: ${reconnaissancesContractuellesSanitaire.dateDEffetAsr ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDEffetAsr) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.NUMÉRO_ARHGOS} : ${reconnaissancesContractuellesSanitaire.numéroArhgos ? reconnaissancesContractuellesSanitaire.numéroArhgos : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.DATE_D_EFFET_CPOM}
                                  {`: ${reconnaissancesContractuellesSanitaire.dateDEffetCpom ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDEffetCpom) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.DATE_DE_FIN_CPOM}
                                  {`: ${reconnaissancesContractuellesSanitaire.dateDeFinCpom ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDeFinCpom) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.NUMÉRO_CPOM}
                                  {`: ${reconnaissancesContractuellesSanitaire.numéroCpom ? reconnaissancesContractuellesSanitaire.numéroCpom : 'N/A'}`}
                                </li>
                              </ul>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </li>
                ))
              }
            </ul>
          </li>
        ))}
      </ul>
    )
  }

  public get dateDeMiseÀJourDesReconnaissancesContractuelles(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.reconnaissancesContractuelles.dateMiseÀJourSource)
  }

  public get lesReconnaissancesContractuellesSontEllesRenseignées(): boolean {
    return this.établissementTerritorial.autorisationsEtCapacités.reconnaissancesContractuelles.activités.length !== 0
  }

  public get équipementsMatérielsLourds(): JSX.Element {
    const équipementsMatérielsLourdsDeLÉtablissement = this.établissementTerritorial.autorisationsEtCapacités.équipementsMatérielsLourds

    return (
      <ul
        aria-label="équipements"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {équipementsMatérielsLourdsDeLÉtablissement.équipements.map((équipements) => (
          <li
            key={`équipement-${équipements.code}`}
          >
            <ActionneurDAccordéon
              for={`équipements-matériels-lourds-accordion-${équipements.code}`}
              titre={`${équipements.libellé} [${équipements.code}]`}
            />
            <ul
              className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`équipements-matériels-lourds-accordion-${équipements.code}`}
            >
              {
                équipements.autorisations.map((autorisationÉquipementMatérielLourd) => {
                  return (
                    <li key={`forme-${autorisationÉquipementMatérielLourd.numéroArhgos}`}>
                      <ul
                        aria-label="équipement-matériel-lourd"
                        className="fr-tags-group"
                      >
                        <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                          {`${this.wording.NUMÉRO_ARHGOS} : ${autorisationÉquipementMatérielLourd.numéroArhgos ? autorisationÉquipementMatérielLourd.numéroArhgos : 'N/A'}`}
                        </li>
                        <li className="fr-tag">
                          {`${this.wording.DATE_D_AUTORISATION} : ${autorisationÉquipementMatérielLourd.dateDAutorisation ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDAutorisation) : 'N/A'}`}
                        </li>
                        <li className="fr-tag">
                          {`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre) : 'N/A'}`}
                        </li>
                        <li className="fr-tag">
                          {`${this.wording.DATE_DE_FIN} : ${autorisationÉquipementMatérielLourd.dateDeFin ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDeFin) : 'N/A'}`}
                        </li>
                      </ul>
                    </li>
                  )
                })
              }
            </ul>
          </li>
        ))
        }
      </ul>
    )
  }

  public get dateDeMiseÀJourDesÉquipementsMatérielsLourds(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.équipementsMatérielsLourds.dateMiseÀJourSource)
  }

  public get lesÉquipementsMatérielsLourdsSontIlsRenseignés(): boolean {
    return this.établissementTerritorial.autorisationsEtCapacités.équipementsMatérielsLourds.équipements.length !== 0
  }
}
