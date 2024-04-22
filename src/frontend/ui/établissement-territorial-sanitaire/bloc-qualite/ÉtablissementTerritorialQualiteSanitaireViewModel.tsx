import {
  EvenementsIndesirables,
  ÉtablissementTerritorialQualite,
} from "../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { Wording } from "../../../configuration/wording/Wording";
import { transformDataInspections } from "../../../utils/transformDataInspections";
import { StringFormater } from "../../commun/StringFormater";


export class ÉtablissementTerritorialQualiteSanitaireViewModel {
  public wording: Wording;
  public etablissementTerritorialQualiteSanitaire: ÉtablissementTerritorialQualite;

  constructor(wording: Wording, etablissementTerritorialQualiteSanitaire: ÉtablissementTerritorialQualite) {
    this.wording = wording;
    this.etablissementTerritorialQualiteSanitaire = etablissementTerritorialQualiteSanitaire;
  }

  public get getInspectionsEtControles(): any {
    return transformDataInspections(this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.inspectionsEtControles);
  }

  public get dateMiseAJourSourceInspectionsEtControles(): string {
    return this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.dateMiseAJourSource;
  }

  public get lesInspectionsEtControlesNeSontPasRenseignées(): boolean {
    if(typeof this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.inspectionsEtControles !== 'undefined') {
      return (this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.inspectionsEtControles.length === 0);
    }
    return true
  }

  public get lesReclamationsNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.reclamations.length === 0;
  }

  public get lesReclamationsNeSontPasAutorisées(): boolean {
    return (
      this.etablissementTerritorialQualiteSanitaire.reclamations.length === 1 &&
      this.etablissementTerritorialQualiteSanitaire.reclamations[0].details.length === 0
    );
  }

  public get totalAssocieAuxsoins(): number {
    return (
      this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0].evenementsClotures.length +
      this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0].evenementsEncours.length
    );
  }

  public get totalDansET(): number {
    return (
      this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[1].evenementsClotures.length +
      this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[1].evenementsEncours.length
    );
  }

  public get lesEvenementsIndesirablesNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables.length === 2 && this.totalAssocieAuxsoins === 0 && this.totalDansET === 0;
  }

  public get lesEvenementsIndesirablesNeSontPasAutorisées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables.length === 0;
  }

  public get lesDonneesQualiteNeSontPasRenseignées(): boolean {
    return this.lesReclamationsNeSontPasRenseignées && this.lesEvenementsIndesirablesNeSontPasRenseignées;
  }

  public get lesDonnéesQualitePasRenseignees(): string[] {
    const nonRenseignees: string[] = [];
    if (this.lesInspectionsEtControlesNeSontPasRenseignées) nonRenseignees.push(this.wording.INSPECTIONS_CONTROLES);
    if (this.lesReclamationsNeSontPasRenseignées) nonRenseignees.push(this.wording.RECLAMATIONS);
    if (this.lesEvenementsIndesirablesNeSontPasRenseignées) nonRenseignees.push(this.wording.EVENEMENTS_INDESIRABLES_NON_RENSEIGNES);
    return nonRenseignees;
  }

  public get lesDonnéesQualitePasAutorisés(): string[] {
    const nonAutorisés: string[] = [];
    if (this.lesReclamationsNeSontPasAutorisées) nonAutorisés.push(this.wording.RECLAMATIONS);
    if (this.lesEvenementsIndesirablesNeSontPasAutorisées) nonAutorisés.push(this.wording.EVENEMENTS_INDESIRABLES);
    return nonAutorisés;
  }

  public get buildReclamationsData(): any {
    const reclamationData: { [key: number]: any } = {};
    for (const reclamation of this.etablissementTerritorialQualiteSanitaire.reclamations) {
      const key = reclamation.année;
      const value = {
        total_clotures: reclamation.totalClotures,
        total_encours: reclamation.totalEncours,
        dateMiseAJourSource: reclamation.dateMiseÀJourSource,
        details: reclamation.details,
      };
      reclamationData[key] = value;
    }
    return reclamationData;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.etablissementTerritorialQualiteSanitaire.reclamations[0]?.dateMiseÀJourSource as string);
  }

  public get dateMiseAJourEvenementsIndesirables(): string {
    return StringFormater.formatDate(this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0].dateMiseAJourSource as string);
  }

  public get buildEIsData(): any {
    const evenementsIndesirables: { [key: number]: EvenementsIndesirables[] } = {};
    this.anneesEIs.forEach((key) => {
      evenementsIndesirables[key] = [
        {
          libelle: this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0].libelle,
          evenementsEncours: [],
          evenementsClotures: [],
          dateMiseAJourSource: this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0].dateMiseAJourSource,
        },
        {
          libelle: this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[1].libelle,
          evenementsEncours: [],
          evenementsClotures: [],
          dateMiseAJourSource: this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[1].dateMiseAJourSource,
        },
      ];
    });

    for (let index = 0; index < this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables.length; index++) {
      for (const event of this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[index].evenementsEncours) {
        evenementsIndesirables[event.annee][index].evenementsEncours.push(event);
      }
      for (const event of this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[index].evenementsClotures) {
        evenementsIndesirables[event.annee][index].evenementsClotures.push(event);
      }
    }

    return evenementsIndesirables;
  }

  public get anneesEIs(): number[] {
    const annees: number[] = [];
    for (let index = 0; index < this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables.length; index++) {
      for (const event of this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[index].evenementsEncours) {
        if (!annees.includes(event.annee)) annees.push(event.annee);
      }
      for (const event of this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[index].evenementsClotures) {
        if (!annees.includes(event.annee)) annees.push(event.annee);
      }
    }
    return annees.sort().reverse();
  }
}
