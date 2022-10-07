import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { Wording } from '../../configuration/wording/Wording'
import { GraphiqueViewModel } from '../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialMédicoSocialActivitéViewModel extends GraphiqueViewModel {
  readonly seuilValeurAtypique = 120
  readonly ratioHistogrammeBlocActivité = 2

  constructor(
    private readonly établissementTerritorialActivité: ÉtablissementTerritorialMédicoSocial['activités'],
    wording: Wording
  ) {
    super(wording, établissementTerritorialActivité.length)
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorialActivité.length === 0 ? false : true
  }

  public get leTauxOccupationHébergementPermanentEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxOccupationHébergementPermanent')
  }

  public get tauxOccupationHébergementPermanent(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxOccupationHébergementPermanent')

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.leTauxEstIlDansLesBornesAcceptables,
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT
    )
  }

  public get dateDeMiseÀJourDuTauxOccupationHébergementPermanent(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementPermanent.dateMiseÀJourSource)
  }

  public get leTauxOccupationHébergementTemporaireEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxOccupationHébergementTemporaire')
  }

  public get tauxOccupationHébergementTemporaire(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxOccupationHébergementTemporaire')

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.leTauxEstIlDansLesBornesAcceptables,
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE
    )
  }

  public get dateDeMiseÀJourDuTauxOccupationHébergementTemporaire(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementTemporaire.dateMiseÀJourSource)
  }

  public get leTauxOccupationAccueilDeJourEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxOccupationAccueilDeJour')
  }

  public get tauxOccupationAccueilDeJour(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxOccupationAccueilDeJour')

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.leTauxEstIlDansLesBornesAcceptables,
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR
    )
  }

  public get dateDeMiseÀJourDuTauxOccupationAccueilDeJour(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxOccupationAccueilDeJour.dateMiseÀJourSource)
  }

  public get leTauxRéalisationActivitéEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné('tauxRéalisationActivité')
  }

  public get tauxRéalisationActivité(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxRéalisationActivité')

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.leTauxEstIlDansLesBornesAcceptables,
      this.wording.ANNÉE,
      this.wording.TAUX_RÉALISATION_ACTIVITÉ
    )
  }

  public get dateDeMiseÀJourDuTauxRéalisationActivité(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxRéalisationActivité.dateMiseÀJourSource)
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
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].fileActivePersonnesAccompagnées.dateMiseÀJourSource)
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
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].nombreMoyenJournéesAbsencePersonnesAccompagnées.dateMiseÀJourSource)
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
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].duréeMoyenneSéjourAccompagnementPersonnesSorties.dateMiseÀJourSource)
  }

  private leTauxEstIlDansLesBornesAcceptables = (valeur: number): boolean => {
    return valeur <= this.seuilValeurAtypique
  }

  private construisLesAnnéesEtSesTaux(indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.établissementTerritorialActivité.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
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
    this.établissementTerritorialActivité.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
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
  private lIndicateurEstIlRenseigné(indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, 'année' | 'dateMiseÀJourSource' | 'numéroFinessÉtablissementTerritorial'>): boolean {
    return this.établissementTerritorialActivité.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur].value !== null)
  }

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }
}
