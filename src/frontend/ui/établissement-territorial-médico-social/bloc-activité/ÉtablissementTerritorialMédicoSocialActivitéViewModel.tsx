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

  constructor(private readonly établissementTerritorialActivité: ÉtablissementTerritorialMédicoSocial["activités"], private readonly wording: Wording) { }



  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné &&
        !this.laFileActivePersonnesAccompagnéesEstElleRenseignée &&
        !this.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée &&
        !this.leTauxOccupationExternatEstIlRenseigne &&
        !this.leTauxOccupationSemiInternatEstIlRenseigne &&
        !this.leTauxOccupationInternatEstIlRenseigne &&
        !this.leTauxOccupationAutreEstIlRenseigne &&
        !this.leTauxOccupationSeancesEstIlRenseigne &&
        !this.leTauxOccupationGlobalEstIlRenseigne)
    );
  }


  public get lesDonnéesActiviteEHPADNeSontPasRenseignées(): boolean {
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
  public get lesDonnéesActivitésPasRenseignees(): string[] {
    const nonRenseignee = [];
    if (!this.leTauxOccupationExternatEstIlRenseigne) nonRenseignee.push(this.wording.TAUX_OCCUPATION_EXTERNAT);
    if (!this.leTauxOccupationSemiInternatEstIlRenseigne) nonRenseignee.push(this.wording.TAUX_OCCUPATION_SEMI_INTERNAT);
    if (!this.leTauxOccupationInternatEstIlRenseigne) nonRenseignee.push(this.wording.TAUX_OCCUPATION_INTERNAT);
    if (!this.leTauxOccupationAutreEstIlRenseigne) nonRenseignee.push(this.wording.TAUX_OCCUPATION_AUTRE);
    if (!this.leTauxOccupationSeancesEstIlRenseigne) nonRenseignee.push(this.wording.TAUX_OCCUPATION_SEANCES);
    if (!this.laFileActivePersonnesAccompagnéesEstElleRenseignée) nonRenseignee.push(this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES);
    if (!this.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné) nonRenseignee.push(this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES);
    if (!this.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée) nonRenseignee.push(this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES);
    if (!this.leTauxOccupationGlobalEstIlRenseigne) nonRenseignee.push(this.wording.TAUX_OCCUPATION_GLOBAL);

    return nonRenseignee;
  }

  public get lesDonneesActivitesEHPADPasRenseignees(): string[] {
    const nonRenseignee = [];
    if (!this.leTauxOccupationHébergementPermanentEstIlRenseigné) nonRenseignee.push(this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT);
    if (!this.leTauxOccupationHébergementTemporaireEstIlRenseigné) nonRenseignee.push(this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE);
    if (!this.leTauxOccupationAccueilDeJourEstIlRenseigné) nonRenseignee.push(this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR);
    if (!this.leTauxRéalisationActivitéEstIlRenseigné) nonRenseignee.push(this.wording.TAUX_RÉALISATION_ACTIVITÉ);
    if (!this.laFileActivePersonnesAccompagnéesEstElleRenseignée) nonRenseignee.push(this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES);
    if (!this.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné) nonRenseignee.push(this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES);
    if (!this.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée) nonRenseignee.push(this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES);

    return nonRenseignee;
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorialActivité.length !== 0;
  }

  public get leTauxOccupationHébergementPermanentEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationHébergementPermanent");
  }

  public get leTauxOccupationHébergementPermanentEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationHébergementPermanent");
  }

  public tauxOccupationHébergementPermanentHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationHébergementPermanent");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourCNSA(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxOccupationHébergementPermanent.dateMiseÀJourSource);
  }

  public get leTauxOccupationHébergementTemporaireEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationHébergementTemporaire");
  }

  public get leTauxOccupationHébergementTemporaireEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationHébergementTemporaire");
  }

  public tauxOccupationHébergementTemporaireHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationHébergementTemporaire");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxOccupationAccueilDeJourEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationAccueilDeJour");
  }

  public get leTauxOccupationAccueilDeJourEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationAccueilDeJour");
  }

  public tauxOccupationAccueilDeJourHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationAccueilDeJour");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxRéalisationActivitéEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxRéalisationActivité");
  }

  public get leTauxRéalisationActivitéEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("tauxRéalisationActivité");
  }

  public tauxRéalisationActivitéHistrogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxRéalisationActivité");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_RÉALISATION_ACTIVITÉ}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_RÉALISATION_ACTIVITÉ}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuTauxRéalisationActivité(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxRéalisationActivité.dateMiseÀJourSource);
  }

  public get laFileActivePersonnesAccompagnéesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigne("fileActivePersonnesAccompagnées");
  }

  public get laFileActivePersonnesAccompagnéesEstElleAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("fileActivePersonnesAccompagnées");
  }

  public fileActivePersonnesAccompagnéesHistrogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("fileActivePersonnesAccompagnées");

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreHorizontale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes(années, 5)}
        nomGraph={this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].fileActivePersonnesAccompagnées.dateMiseÀJourSource);
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigne("nombreMoyenJournéesAbsencePersonnesAccompagnées");
  }

  public get leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("nombreMoyenJournéesAbsencePersonnesAccompagnées");
  }

  public nombreMoyenJournéesAbsencePersonnesAccompagnéesHistrogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("nombreMoyenJournéesAbsencePersonnesAccompagnées");

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreHorizontale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes(années, 5)}
        nomGraph={this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxOccupationExternatEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationExternat");
  }

  public get leTauxOccupationExternatEstIlAutorise(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationExternat");
  }

  public tauxOccupationExternatHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationExternat");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_EXTERNAT}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_EXTERNAT}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxOccupationSemiInternatEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationSemiInternat");
  }

  public get leTauxOccupationSemiInternatEstIlAutorise(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationSemiInternat");
  }

  public tauxOccupationSemiInternatHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationSemiInternat");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_SEMI_INTERNAT}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_SEMI_INTERNAT}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxOccupationInternatEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationInternat");
  }

  public get leTauxOccupationInternatEstIlAutorise(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationInternat");
  }

  public tauxOccupationInternatHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationInternat");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_INTERNAT}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_INTERNAT}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxOccupationAutreEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationAutre");
  }

  public get leTauxOccupationAutreEstIlAutorise(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationAutre");
  }

  public tauxOccupationAutreHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationAutre");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_AUTRE}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_AUTRE}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get leTauxOccupationSeancesEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationSeances");
  }

  public get leTauxOccupationSeancesEstIlAutorise(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationSeances");
  }
  public tauxOccupationSeancesHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationSeances");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_SEANCES}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_SEANCES}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }
  public get dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].nombreMoyenJournéesAbsencePersonnesAccompagnées.dateMiseÀJourSource);
  }

  public get laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée(): boolean {
    return this.lIndicateurEstIlRenseigne("duréeMoyenneSéjourAccompagnementPersonnesSorties");
  }

  public get laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("duréeMoyenneSéjourAccompagnementPersonnesSorties");
  }

  public duréeMoyenneSéjourAccompagnementPersonnesSortiesHistrogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("duréeMoyenneSéjourAccompagnementPersonnesSorties");

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreHorizontale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes(années, 5)}
        nomGraph={this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
        nombreDeLibelléTotal={5}
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
  private lIndicateurEstIlRenseigne(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialActivité.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur].value !== null);
  }

  private lIndicateurEstIlAutorise(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialActivité.some((activité: ÉtablissementTerritorialMédicoSocialActivité) => activité[indicateur].value !== '');
  }

  public get lesDonnéesActivitésPasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.leTauxOccupationExternatEstIlAutorise) nonAutorisés.push(this.wording.TAUX_OCCUPATION_EXTERNAT);
    if (!this.leTauxOccupationSemiInternatEstIlAutorise) nonAutorisés.push(this.wording.TAUX_OCCUPATION_SEMI_INTERNAT);
    if (!this.leTauxOccupationSemiInternatEstIlAutorise) nonAutorisés.push(this.wording.TAUX_OCCUPATION_INTERNAT);
    if (!this.leTauxOccupationAutreEstIlAutorise) nonAutorisés.push(this.wording.TAUX_OCCUPATION_AUTRE);
    if (!this.leTauxOccupationSeancesEstIlAutorise) nonAutorisés.push(this.wording.TAUX_OCCUPATION_SEANCES);
    if (!this.laFileActivePersonnesAccompagnéesEstElleAutorisé) nonAutorisés.push(this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES);
    if (!this.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlAutorisé) nonAutorisés.push(this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES);
    if (!this.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleAutorisé) nonAutorisés.push(this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES);
    if (!this.leTauxOccupationGlobalEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_OCCUPATION_GLOBAL);

    return nonAutorisés;
  }

  public get lesDonneesActivitesEHPADPasAutorisees(): string[] {
    const nonAutorises = [];
    if (!this.leTauxOccupationHébergementPermanentEstIlAutorisé) nonAutorises.push(this.wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT);
    if (!this.leTauxOccupationHébergementTemporaireEstIlAutorisé) nonAutorises.push(this.wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE);
    if (!this.leTauxOccupationAccueilDeJourEstIlAutorisé) nonAutorises.push(this.wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR);
    if (!this.leTauxRéalisationActivitéEstIlAutorisé) nonAutorises.push(this.wording.TAUX_RÉALISATION_ACTIVITÉ);
    if (!this.laFileActivePersonnesAccompagnéesEstElleAutorisé) nonAutorises.push(this.wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES);
    if (!this.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlAutorisé) nonAutorises.push(this.wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES);
    if (!this.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleAutorisé) nonAutorises.push(this.wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES);

    return nonAutorises;
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

  public get leTauxOccupationGlobalEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigne("tauxOccupationGlobal");
  }

  public get leTauxOccupationGlobalEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorise("tauxOccupationGlobal");
  }

  public tauxOccupationGlobalHistrogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxOccupationGlobal");

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={this.construisLesLibellésDesValeurs(valeurs)}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => {
          return this.construisLaCouleurDeLaBarreVerticale(valeur, années[index]);
        })}
        entêteLibellé={this.wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.TAUX_OCCUPATION_GLOBAL}
        isVigieRh={false}
        libellés={années}
        nomGraph={this.wording.TAUX_OCCUPATION_GLOBAL}
        taillePoliceTicks={this.construisLesLibellésDesTicks(années)}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuTauxOccupationGlobal(): string {
    return StringFormater.formatDate(this.établissementTerritorialActivité[0].tauxOccupationGlobal.dateMiseÀJourSource);
  }
}
