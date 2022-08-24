import Link from 'next/link'
import { ReactElement } from 'react'

import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { CapacitéParActivité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation'
import { Paths } from '../../configuration/Paths'
import { Wording } from '../../configuration/wording/Wording'
import { ActionneurDAccordéon } from '../commun/Accordéon/ActionneurDAccordéon'
import { GraphiqueViewModel } from '../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../commun/StringFormater'
import '@gouvfr/dsfr/dist/component/tag/tag.min.css'
import styles from './BlocAutorisationEtCapacitéMédicoSocial.module.css'

export class ÉtablissementTerritorialMédicoSocialViewModel extends GraphiqueViewModel {
  readonly seuilValeurAtypique = 120
  readonly ratioHistogrammeCapacitéParActivité = 7
  readonly ratioHistogrammeBlocActivité = 2

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

  public get dateDeMiseÀJourDuTéléphoneEtDeLEmail(): string {
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

    return this.afficheUnHistogrammeVertical(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT
    )
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

    return this.afficheUnHistogrammeVertical(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE
    )
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

    return this.afficheUnHistogrammeVertical(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR
    )
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

    return this.afficheUnHistogrammeVertical(
      chartColors,
      valeurs,
      dataLabelsColor,
      années,
      this.wording.ANNÉE,
      this.wording.TAUX_RÉALISATION_ACTIVITÉ
    )
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
    const annéesManquantes = this.annéesManquantes(années, 3)
    const libellés = this.construisLesLibellés(années, valeurs, this.grosseursDePolicePourLesLibellés)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      libellés,
      this.ratioHistogrammeBlocActivité,
      this.wording.ANNÉE,
      this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES,
      annéesManquantes
    )
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
    const annéesManquantes = this.annéesManquantes(années, 3)
    const libellés = this.construisLesLibellés(années, valeurs, this.grosseursDePolicePourLesLibellés)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      libellés,
      this.ratioHistogrammeBlocActivité,
      this.wording.ANNÉE,
      this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES,
      annéesManquantes
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
    const annéesManquantes = this.annéesManquantes(années, 3)
    const libellés = this.construisLesLibellés(années, valeurs, this.grosseursDePolicePourLesLibellés)

    return this.afficheUnHistogrammeHorizontal(
      chartColors,
      valeurs,
      libellés,
      this.ratioHistogrammeBlocActivité,
      this.wording.ANNÉE,
      this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES,
      annéesManquantes
    )
  }

  public get dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.activités[0].duréeMoyenneSéjourAccompagnementPersonnesSorties.dateMiseÀJourSource)
  }

  public get autorisations(): JSX.Element {
    const autorisationsDeLÉtablissement = this.établissementTerritorial.autorisationsEtCapacités.autorisations

    return (
      <ul
        aria-label="disciplines"
        className={`fr-accordion ${styles['liste-autorisations']}`}
      >
        {autorisationsDeLÉtablissement.disciplines.map((discipline) => (
          <li
            className="fr-accordion__title"
            key={`discipline-${discipline.code}`}
          >
            <ActionneurDAccordéon
              for={`accordion-${discipline.code}`}
              titre={`${discipline.libellé} [${discipline.code}]`}
            />
            <ul
              className={`fr-accordion fr-collapse ${styles['liste-activités']}`}
              id={`accordion-${discipline.code}`}
            >
              {
                discipline.activités.map((activité) => (
                  <li
                    className="fr-accordion__title"
                    key={`activité-${activité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`accordion-${discipline.code}-${activité.code}`}
                      texteGras={false}
                      titre={`${activité.libellé} [${activité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${styles['liste-clientèles']}`}
                      id={`accordion-${discipline.code}-${activité.code}`}
                    >
                      {
                        activité.clientèles.map((clientèle) => {
                          const datesEtCapacités = clientèle.datesEtCapacités
                          return (
                            <li key={`clientèle-${clientèle.code}`}>
                              <ul
                                aria-label="dates-et-capacités"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${clientèle.libellé} [${clientèle.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_D_AUTORISATION} : ${datesEtCapacités.dateDAutorisation ? StringFormater.formateLaDate(datesEtCapacités.dateDAutorisation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.MISE_À_JOUR_AUTORISATION} : ${datesEtCapacités.dateDeMiseÀJourDAutorisation ? StringFormater.formateLaDate(datesEtCapacités.dateDeMiseÀJourDAutorisation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DERNIÈRE_INSTALLATION} : ${datesEtCapacités.dateDeDernièreInstallation ? StringFormater.formateLaDate(datesEtCapacités.dateDeDernièreInstallation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.CAPACITÉ_AUTORISÉE} : ${datesEtCapacités.capacitéAutoriséeTotale || 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.CAPACITÉ_INSTALLÉE} : ${datesEtCapacités.capacitéInstalléeTotale || 'N/A'}`}
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
    return this.établissementTerritorial.autorisationsEtCapacités.autorisations.disciplines.length !== 0
  }

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.autorisations.dateMiseÀJourSource)
  }

  public get capacitéParActivités(): JSX.Element {
    const [activités, capacités] = this.construisLesCapacitésParActivités()
    const couleursDuGraphe = Array(capacités.length).fill(this.couleurDuFondHistogrammeSecondaire).fill(this.couleurDuFondHistogrammePrimaire, 0, 1)
    const couleursDesLibellés = Array(capacités.length).fill('black')
    const taillesDePoliceDesLibellés = Array(capacités.length).fill('normal').fill('bold', 0, 1)
    const libellés = this.construisLesLibellés(activités, couleursDesLibellés, taillesDePoliceDesLibellés)

    return this.afficheUnHistogrammeHorizontal(
      couleursDuGraphe,
      capacités,
      libellés,
      this.ratioHistogrammeCapacitéParActivité,
      this.wording.ACTIVITÉ,
      this.wording.CAPACITÉ_INSTALLÉE,
      [],
      capacités.length
    )
  }

  public get lesCapacitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorial.autorisationsEtCapacités.capacités.capacitéParActivité.length !== 0
  }

  public get dateDeMiseÀJourDesCapacitésParActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorial.autorisationsEtCapacités.capacités.dateMiseÀJourSource)
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

  private construisLesCapacitésParActivités(): [string[], number[]] {
    const activités: string[] = []
    const capacités: number[] = []
    let capacitéTotale = 0

    this.établissementTerritorial.autorisationsEtCapacités.capacités.capacitéParActivité.forEach((activité: CapacitéParActivité) => {
      activités.push(activité.libellé)
      capacités.push(activité.capacité)
      capacitéTotale += activité.capacité
    })

    activités.splice(0, 0, this.wording.NOMBRE_TOTAL_DE_PLACE_PAR_ACTIVITÉ)
    capacités.splice(0, 0, capacitéTotale)
    return [activités, capacités]
  }

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }

  private lIndicateurEstIlRenseigné(indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): boolean {
    return this.établissementTerritorial.activités.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur].value !== null)
  }
}
