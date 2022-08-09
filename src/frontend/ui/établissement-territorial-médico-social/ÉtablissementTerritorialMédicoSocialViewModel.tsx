import Link from 'next/link'
import { ReactElement } from 'react'

import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { Paths } from '../../configuration/Paths'
import { Wording } from '../../configuration/wording/Wording'
import { GraphiqueViewModel } from '../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialMédicoSocialViewModel extends GraphiqueViewModel {
  readonly seuilValeurAtypique = 120

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialMédicoSocial, wording: Wording, private readonly paths: Paths) {
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
    return StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessÉtablissementTerritorial.value)
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
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.établissementTerritorial.identité.téléphone.value))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorial.identité.courriel.value)
    return `${téléphoneFormaté} | ${email}`
  }

  public get dateDeMiseÀJourDutéléphoneEtDeLEmail(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.téléphone.dateMiseÀJourSource)
  }

  public get entitéJuridiqueDeRattachement(): JSX.Element {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value}`
    const titreDeLEntitéJuridiqueDeRattachement = this.formateLeTitreDeLEntitéJuridiqueDeRattachement()
    const libellé = `EJ - ${titreDeLEntitéJuridiqueDeRattachement}`

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

  public get monoÉtablissement(): string {
    return this.établissementTerritorial.identité.estMonoÉtablissement ? this.wording.OUI : this.wording.NON
  }

  public get dateDeMiseÀJourDuMonoÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.estMonoÉtablissement.dateMiseÀJourSource)
  }

  public get principalOuSecondaire(): string {
    return this.établissementTerritorial.identité.typeÉtablissement.value === 'P' ?
      this.wording.PRINCIPAL :
      `${this.wording.SECONDAIRE} (${this.wording.PRINCIPAL} : ${StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessÉtablissementPrincipal.value)})`
  }

  public get dateDeMiseÀJourDuPrincipalOuDuSecondaire(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.identité.numéroFinessÉtablissementPrincipal.dateMiseÀJourSource)
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

  public get dateDeMiseÀJourDuTauxOccupationHébergementPermanent(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].tauxOccupationHébergementPermanent.dateMiseÀJourSource)
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

  public get dateDeMiseÀJourDuTauxOccupationHébergementTemporaire(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].tauxOccupationHébergementTemporaire.dateMiseÀJourSource)
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

  public get dateDeMiseÀJourDuTauxOccupationAccueilDeJour(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].tauxOccupationAccueilDeJour.dateMiseÀJourSource)
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

  public get dateDeMiseÀJourDuTauxRéalisationActivité(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].tauxRéalisationActivité.dateMiseÀJourSource)
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

  public get dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].fileActivePersonnesAccompagnées.dateMiseÀJourSource)
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('nombreMoyenJournéesAbsencePersonnesAccompagnées')
  }

  public get nombreMoyenJournéesAbsencePersonnesAccompagnées(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs('nombreMoyenJournéesAbsencePersonnesAccompagnées')
    const chartColors = this.fondDeCouleurPourPremierHistogramme
    const dataLabelsColor = this.construisLaCouleurDuLabel(valeurs, true)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES
    )
  }

  public get dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].nombreMoyenJournéesAbsencePersonnesAccompagnées.dateMiseÀJourSource)
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

  public get dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].duréeMoyenneSéjourAccompagnementPersonnesSorties.dateMiseÀJourSource)
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value)
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }

  private construisLesAnnéesEtSesTaux(indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
      if (activité[indicateur].value !== null) {
        années.push(activité.année)
      }

      if (activité[indicateur].value !== null) {
        // @ts-ignore
        valeurs.push(this.transformeEnTaux(activité[indicateur].value))
      }
    })

    return [valeurs, années]
  }

  private construisLesAnnéesEtSesValeurs(indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorial.activités.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
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
    const couleurDesAnnées = estHorizontal ? Array(valeurs.length).fill(this.couleurDeLaValeur) : Array(valeurs.length).fill(this.couleurDuFond)

    valeurs.forEach((valeur: number, index: number) => {
      if (valeur < maxAvantDePerdreLeContraste) {
        couleurDesAnnées[index] = 'black'
      }
    })

    return couleurDesAnnées
  }

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }

  private lIndicateurEstIlRenseigné(indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur].value !== null)
  }
}
