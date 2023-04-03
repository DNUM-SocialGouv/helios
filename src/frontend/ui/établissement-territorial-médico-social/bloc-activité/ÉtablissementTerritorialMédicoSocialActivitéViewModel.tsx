import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocial } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialActivité } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { CouleurHistogramme, GraphiqueViewModel, LibelléDeDonnéeGraphe, LibelléDeTickGraphe } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";

export class ÉtablissementTerritorialMédicoSocialActivitéViewModel extends GraphiqueViewModel {
  readonly seuilValeurAtypique = 120;

  constructor(private readonly établissementTerritorialActivité: ÉtablissementTerritorialMédicoSocial["activités"], wording: Wording) {
    super(wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.leTauxOccupationHébergementPermanentEstIlRenseigné &&
        !this.leTauxOccupationHébergementTemporaireEstIlRenseigné &&
        !this.leTauxOccupationAccueilDeJourEstIlRenseigné &&
        !this.leTauxRéalisationActivitéEstIlRenseigné &&
        !this.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné &&
        !this.laFileActivePersonnesAccompagnéesEstElleRenseignée &&
        !this.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée)
    );
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorialActivité.length === 0 ? false : true;
  }

  public get leTauxOccupationHébergementPermanentEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxOccupationHébergementPermanent");
  }

  public get tauxOccupationHébergementPermanent(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationHébergementPermanent");

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreVerticale),
      this.construisLesLibellésDesValeurs(valeurs),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationHébergementPermanent(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementPermanent.dateMiseÀJourSource);
  }

  public get leTauxOccupationHébergementTemporaireEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxOccupationHébergementTemporaire");
  }

  public get tauxOccupationHébergementTemporaire(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationHébergementTemporaire");

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreVerticale),
      this.construisLesLibellésDesValeurs(valeurs),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationHébergementTemporaire(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementTemporaire.dateMiseÀJourSource);
  }

  public get leTauxOccupationAccueilDeJourEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxOccupationAccueilDeJour");
  }

  public get tauxOccupationAccueilDeJour(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationAccueilDeJour");

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreVerticale),
      this.construisLesLibellésDesValeurs(valeurs),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationAccueilDeJour(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxOccupationAccueilDeJour.dateMiseÀJourSource);
  }

  public get leTauxRéalisationActivitéEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxRéalisationActivité");
  }

  public get tauxRéalisationActivité(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxRéalisationActivité");

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreVerticale),
      this.construisLesLibellésDesValeurs(valeurs),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.TAUX_RÉALISATION_ACTIVITÉ
    );
  }

  public get dateDeMiseÀJourDuTauxRéalisationActivité(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].tauxRéalisationActivité.dateMiseÀJourSource);
  }

  public get laFileActivePersonnesAccompagnéesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigné("fileActivePersonnesAccompagnées");
  }

  public get fileActivePersonnesAccompagnées(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("fileActivePersonnesAccompagnées");

    return this.afficheUnHistogrammeHorizontal(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreHorizontale),
      Array(valeurs.length).fill({ couleur: this.couleurIdentifiant }),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES,
      annéesManquantes(années)
    );
  }

  public get dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].fileActivePersonnesAccompagnées.dateMiseÀJourSource);
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("nombreMoyenJournéesAbsencePersonnesAccompagnées");
  }

  public get nombreMoyenJournéesAbsencePersonnesAccompagnées(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("nombreMoyenJournéesAbsencePersonnesAccompagnées");

    return this.afficheUnHistogrammeHorizontal(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreHorizontale),
      Array(valeurs.length).fill({ couleur: this.couleurIdentifiant }),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES,
      annéesManquantes(années)
    );
  }

  public get dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].nombreMoyenJournéesAbsencePersonnesAccompagnées.dateMiseÀJourSource);
  }

  public get laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigné("duréeMoyenneSéjourAccompagnementPersonnesSorties");
  }

  public get duréeMoyenneSéjourAccompagnementPersonnesSorties(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("duréeMoyenneSéjourAccompagnementPersonnesSorties");

    return this.afficheUnHistogrammeHorizontal(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, this.construisLaCouleurDeLaBarreHorizontale),
      Array(valeurs.length).fill({ couleur: this.couleurIdentifiant }),
      this.construisLesLibellésDesTicks(années),
      this.wording.ANNÉE,
      this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES,
      annéesManquantes(années)
    );
  }

  public get dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialActivité[0].duréeMoyenneSéjourAccompagnementPersonnesSorties.dateMiseÀJourSource);
  }

  private leTauxEstIlDansLesBornesAcceptables = (valeur: number): boolean => {
    return valeur <= this.seuilValeurAtypique;
  };

  private construisLesAnnéesEtSesTaux(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.établissementTerritorialActivité.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
      if (activité[indicateur].value !== null) {
        années.push(activité.année);
      }

      if (activité[indicateur].value !== null) {
        // @ts-ignore
        valeurs.push(StringFormater.transformeEnTaux(activité[indicateur].value));
      }
    });

    return [valeurs, années];
  }

  private construisLesAnnéesEtSesValeurs(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): [number[], string[]] {
    const valeurs: number[] = [];
    const années: string[] = [];
    this.établissementTerritorialActivité.forEach((activité: ÉtablissementTerritorialMédicoSocialActivité) => {
      if (activité[indicateur].value !== null) {
        années.push(activité.année.toString());
      }

      if (activité[indicateur].value !== null) {
        // @ts-ignore
        valeurs.push(activité[indicateur].value);
      }
    });

    return [valeurs, années];
  }
  private lIndicateurEstIlRenseigné(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialActivité.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur].value !== null);
  }

  private construisLaCouleurDeLaBarreVerticale = (valeur: number, année: number | string): CouleurHistogramme => {
    let premierPlan = this.couleurDuFondHistogrammeSecondaire;
    let secondPlan = this.couleurDuFond;

    if (estCeLAnnéePassée(année)) {
      premierPlan = this.couleurDuFondHistogrammePrimaire;
      secondPlan = this.couleurDuFond;
    }

    if (!this.leTauxEstIlDansLesBornesAcceptables(valeur)) {
      premierPlan = this.couleurDuFondHistogrammeDeDépassement;
      secondPlan = this.couleurSecondPlanHistogrammeDeDépassement;
    }
    return { premierPlan, secondPlan };
  };

  private construisLaCouleurDeLaBarreHorizontale = (_valeur: number, année: number | string): CouleurHistogramme => {
    return estCeLAnnéePassée(année)
      ? {
          premierPlan: this.couleurDuFondHistogrammePrimaire,
          secondPlan: this.couleurDuFond,
        }
      : {
          premierPlan: this.couleurDuFondHistogrammeSecondaire,
          secondPlan: this.couleurDuFond,
        };
  };

  private construisLesLibellésDesValeurs(valeurs: number[]): LibelléDeDonnéeGraphe[] {
    return valeurs.map((valeur) => ({ couleur: valeur > this.SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX ? this.couleurDuFond : this.couleurIdentifiant }));
  }

  private construisLesLibellésDesTicks(libellés: (number | string)[]): LibelléDeTickGraphe[] {
    return libellés.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));
  }
}
