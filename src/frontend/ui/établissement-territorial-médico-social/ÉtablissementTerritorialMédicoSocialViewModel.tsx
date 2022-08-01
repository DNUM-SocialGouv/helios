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

  public get entitéJuridiqueDeRattachement(): JSX.Element {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorial.identité.numéroFinessEntitéJuridique}`
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

  private formateLeTitreDeLEntitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorial.identité.numéroFinessEntitéJuridique)
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
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

  private lIndicateurEstIlRenseigné(indicateur: keyof ÉtablissementTerritorialMédicoSocialActivité): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur] !== null)
  }
}
