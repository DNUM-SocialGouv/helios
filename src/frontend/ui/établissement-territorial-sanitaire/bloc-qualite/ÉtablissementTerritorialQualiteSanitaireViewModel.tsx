import {
  EvenementsIndesirables,
  ÉtablissementTerritorialQualite,
} from "../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { Wording } from "../../../configuration/wording/Wording";
import { transformDataInspections } from "../../../utils/transformDataInspections";
import StringFormater from "../../commun/StringFormater";

export type QualiteQualiscopeViewModel = Readonly<{
  appreciationMco: string;
  appreciationCa: string;
  PriseEnChargeDouleur: string;
  dateCertification: string;
  certification: string;
}>;
export class ÉtablissementTerritorialQualiteSanitaireViewModel {
  public wording: Wording;
  public etablissementTerritorialQualiteSanitaire: ÉtablissementTerritorialQualite;
  public autorisations: any;

  constructor(wording: Wording, etablissementTerritorialQualiteSanitaire: ÉtablissementTerritorialQualite, autorisations: any) {
    this.wording = wording;
    this.etablissementTerritorialQualiteSanitaire = etablissementTerritorialQualiteSanitaire;
    this.autorisations = autorisations;
  }

  public get getInspectionsEtControles(): any {
    return transformDataInspections(this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.inspectionsEtControles);
  }

  public get dateMiseAJourSourceInspectionsEtControles(): string {
    return this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.dateMiseAJourSource;
  }

  public get lesInspectionsEtControlesNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.inspectionsEtControles.length === 0 && this.etablissementTerritorialQualiteSanitaire.inspectionsEtControles.dateMiseAJourSource !== "";
  }

  public get lesInspectionsEtControlesNeSontPasAutorisées(): boolean {
    return this.autorisations.Qualité.DonnéesSiicea === 'no';
  }

  public get lesReclamationsNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.reclamations.length === 0;
  }

  public get lesReclamationsNeSontPasAutorisées(): boolean {
    return this.autorisations.Qualité.DonnéesSirec === 'no';
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
    return this.autorisations.Qualité.DonnéesSivss === 'no';
  }

  public get lesDonneesHASNeSontPasAutorisees(): boolean {
    return this.autorisations.Qualité.DonnéesHas === 'no';
  }


  public get lesDonneesHASNeSontPasRenseignees(): boolean {
    return !this.etablissementTerritorialQualiteSanitaire.donneesQualiscopeHAS;
  }

  public get lesDonneesQualiteNeSontPasRenseignées(): boolean {
    return this.lesReclamationsNeSontPasRenseignées &&
      this.lesEvenementsIndesirablesNeSontPasRenseignées &&
      this.lesInspectionsEtControlesNeSontPasRenseignées &&
      this.lesDonneesHASNeSontPasRenseignees;
  }

  public get lesDonnéesQualitePasRenseignees(): string[] {
    const nonRenseignees: string[] = [];
    if (this.lesInspectionsEtControlesNeSontPasRenseignées) nonRenseignees.push(this.wording.INSPECTIONS_CONTROLES);
    if (this.lesReclamationsNeSontPasRenseignées) nonRenseignees.push(this.wording.RECLAMATIONS);
    if (this.lesEvenementsIndesirablesNeSontPasRenseignées) nonRenseignees.push(this.wording.EVENEMENTS_INDESIRABLES_NON_RENSEIGNES);
    if (this.lesDonneesHASNeSontPasRenseignees) nonRenseignees.push(this.wording.CERTIFICATION_QUALISCOPE);
    return nonRenseignees;
  }

  public get lesDonnéesQualitePasAutorisés(): string[] {
    const nonAutorisés: string[] = [];
    if (this.lesInspectionsEtControlesNeSontPasAutorisées) nonAutorisés.push(this.wording.INSPECTIONS_CONTROLES);
    if (this.lesReclamationsNeSontPasAutorisées) nonAutorisés.push(this.wording.RECLAMATIONS);
    if (this.lesEvenementsIndesirablesNeSontPasAutorisées) nonAutorisés.push(this.wording.EVENEMENTS_INDESIRABLES);
    if (this.lesDonneesHASNeSontPasAutorisees) nonAutorisés.push(this.wording.CERTIFICATION_QUALISCOPE);
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
    return StringFormater.formatDate(this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0]?.dateMiseAJourSource as string);
  }

  public get dateMiseAJourDonneesHAS(): string {
    return StringFormater.formatDate("2025-08-20");
  }

  public get donneesHAS(): QualiteQualiscopeViewModel {
    const donneesQualiscopeHAS = this.etablissementTerritorialQualiteSanitaire.donneesQualiscopeHAS;
    return {
      appreciationMco: donneesQualiscopeHAS?.scoreAppreciationMCO ?
        `${donneesQualiscopeHAS?.scoreAppreciationMCO} / 100  ${donneesQualiscopeHAS?.classeAppreciationMCO}  `
        : 'Non renseigné',
      appreciationCa: donneesQualiscopeHAS?.scoreAppreciationCA ?
        `${donneesQualiscopeHAS?.scoreAppreciationCA} / 100  ${donneesQualiscopeHAS?.classeAppreciationCA}  `
        : 'Non renseigné',
      PriseEnChargeDouleur: donneesQualiscopeHAS?.scorePriseEnChargeDouleur ?
        `${donneesQualiscopeHAS?.scorePriseEnChargeDouleur} %  ${donneesQualiscopeHAS?.classePriseEnChargeDouleur}  `
        : 'Non renseigné',
      dateCertification: donneesQualiscopeHAS?.dateCertification ?
        StringFormater.formatDate(donneesQualiscopeHAS?.dateCertification)
        : 'Non renseigné',
      certification: donneesQualiscopeHAS?.noteCertification ?? ''
    };
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
    return annees.toSorted((anneeA, anneeB) => anneeA - anneeB);
  }
}
