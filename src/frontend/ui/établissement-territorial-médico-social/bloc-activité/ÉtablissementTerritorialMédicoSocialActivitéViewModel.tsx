import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocial } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialActivité } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import {
  couleurDuFond,
  couleurDuFondHistogrammePrimaire,
  couleurDuFondHistogrammeSecondaire,
  couleurErreur,
  couleurIdentifiant,
  couleurSecondPlanHistogrammeDeDépassement,
  TaillePoliceTick,
  CouleurHistogramme,
} from "../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { HistogrammeVertical } from "../../commun/Graphique/HistogrammeVertical";
import { StringFormater } from "../../commun/StringFormater";

export class ÉtablissementTerritorialMédicoSocialActivitéViewModel {
  readonly seuilValeurAtypique = 120;

  constructor(private readonly établissementTerritorialActivité: ÉtablissementTerritorialMédicoSocial["activités"], private wording: Wording) {}

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

    return (
      <HistogrammeVertical
        annéesTotales={3}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
        libellés={années}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationHébergementPermanent(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementPermanent.dateMiseÀJourSource);
  }

  public get leTauxOccupationHébergementTemporaireEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxOccupationHébergementTemporaire");
  }

  public get tauxOccupationHébergementTemporaire(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationHébergementTemporaire");

    return (
      <HistogrammeVertical
        annéesTotales={3}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
        libellés={années}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationHébergementTemporaire(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementTemporaire.dateMiseÀJourSource);
  }

  public get leTauxOccupationAccueilDeJourEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxOccupationAccueilDeJour");
  }

  public get tauxOccupationAccueilDeJour(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationAccueilDeJour");

    return (
      <HistogrammeVertical
        annéesTotales={3}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
        libellés={années}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationAccueilDeJour(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxOccupationAccueilDeJour.dateMiseÀJourSource);
  }

  public get leTauxRéalisationActivitéEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("tauxRéalisationActivité");
  }

  public get tauxRéalisationActivité(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxRéalisationActivité");

    return (
      <HistogrammeVertical
        annéesTotales={3}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_RÉALISATION_ACTIVITÉ}
        libellés={années}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuTauxRéalisationActivité(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxRéalisationActivité.dateMiseÀJourSource);
  }

  public get laFileActivePersonnesAccompagnéesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigné("fileActivePersonnesAccompagnées");
  }

  public get fileActivePersonnesAccompagnées(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("fileActivePersonnesAccompagnées");

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreHorizontale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes(années)}
        nombreDeLibelléTotal={3}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].fileActivePersonnesAccompagnées.dateMiseÀJourSource);
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("nombreMoyenJournéesAbsencePersonnesAccompagnées");
  }

  public get nombreMoyenJournéesAbsencePersonnesAccompagnées(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("nombreMoyenJournéesAbsencePersonnesAccompagnées");

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreHorizontale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes(années)}
        nombreDeLibelléTotal={3}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].nombreMoyenJournéesAbsencePersonnesAccompagnées.dateMiseÀJourSource);
  }

  public get laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigné("duréeMoyenneSéjourAccompagnementPersonnesSorties");
  }

  public get duréeMoyenneSéjourAccompagnementPersonnesSorties(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("duréeMoyenneSéjourAccompagnementPersonnesSorties");

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreHorizontale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes(années)}
        nombreDeLibelléTotal={3}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].duréeMoyenneSéjourAccompagnementPersonnesSorties.dateMiseÀJourSource);
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
        valeurs.push(StringFormater.transformInRate(activité[indicateur].value));
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
    let premierPlan = couleurDuFondHistogrammeSecondaire;
    let secondPlan = couleurDuFond;

    if (estCeLAnnéePassée(année)) {
      premierPlan = couleurDuFondHistogrammePrimaire;
      secondPlan = couleurDuFond;
    }

    if (!this.leTauxEstIlDansLesBornesAcceptables(valeur)) {
      premierPlan = couleurErreur;
      secondPlan = couleurSecondPlanHistogrammeDeDépassement;
    }
    return { premierPlan, secondPlan };
  };

  private construisLaCouleurDeLaBarreHorizontale = (_valeur: number, année: number | string): CouleurHistogramme => {
    return estCeLAnnéePassée(année)
      ? {
          premierPlan: couleurDuFondHistogrammePrimaire,
          secondPlan: couleurDuFond,
        }
      : {
          premierPlan: couleurDuFondHistogrammeSecondaire,
          secondPlan: couleurDuFond,
        };
  };

  private construisLesLibellésDesValeurs(valeurs: number[]): string[] {
    return valeurs.map((valeur) => (valeur > 20 ? couleurDuFond : couleurIdentifiant));
  }

  private construisLesLibellésDesTicks(libellés: (number | string)[]): TaillePoliceTick[] {
    return libellés.map((année) => (estCeLAnnéePassée(année) ? "bold" : "normal"));
  }
}
