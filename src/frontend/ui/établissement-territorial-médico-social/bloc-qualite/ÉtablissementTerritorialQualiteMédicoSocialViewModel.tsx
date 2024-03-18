import { ÉtablissementTerritorialQualite } from "../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { Wording } from "../../../configuration/wording/Wording";
import { StringFormater } from "../../commun/StringFormater";


export class ÉtablissementTerritorialQualiteMédicoSocialViewModel {

  public wording: Wording;
  public etablissementTerritorialQualiteMédicoSocial: ÉtablissementTerritorialQualite;

  constructor(wording: Wording, etablissementTerritorialQualiteMédicoSocial: ÉtablissementTerritorialQualite) {
    this.wording = wording;
    this.etablissementTerritorialQualiteMédicoSocial = etablissementTerritorialQualiteMédicoSocial;
  }


  public get lesReclamationsNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteMédicoSocial.reclamations.length === 0;
  }

  public get lesReclamationsNeSontPasAutorisées(): boolean {
    return this.etablissementTerritorialQualiteMédicoSocial.reclamations.length === 1 &&
      this.etablissementTerritorialQualiteMédicoSocial.reclamations[0].details.length === 0;
  }

  public get totalAssocieAuxsoins(): number {
    return this.etablissementTerritorialQualiteMédicoSocial.evenementsIndesirables[0].evenementsClotures.length +
      this.etablissementTerritorialQualiteMédicoSocial.evenementsIndesirables[0].evenementsEncours.length;
  }

  public get totalDansET(): number {
    return this.etablissementTerritorialQualiteMédicoSocial.evenementsIndesirables[1].evenementsClotures.length +
      this.etablissementTerritorialQualiteMédicoSocial.evenementsIndesirables[1].evenementsEncours.length;
  }

  public get lesEvenementsIndesirablesNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteMédicoSocial.evenementsIndesirables.length === 2 && this.totalAssocieAuxsoins === 0
      && this.totalDansET === 0;
  }

  public get lesEvenementsIndesirablesNeSontPasAutorisées(): boolean {
    return this.etablissementTerritorialQualiteMédicoSocial.evenementsIndesirables.length === 0;
  }

  public get lesDonneesQualiteNeSontPasRenseignées(): boolean {
    return this.lesReclamationsNeSontPasRenseignées && this.lesEvenementsIndesirablesNeSontPasRenseignées;
  }


  public get lesDonnéesQualitePasRenseignees(): string[] {
    const nonRenseignees: string[] = [];
    if (this.lesReclamationsNeSontPasRenseignées) nonRenseignees.push(this.wording.RECLAMATIONS);
    if (this.lesEvenementsIndesirablesNeSontPasRenseignées) nonRenseignees.push(this.wording.EVENEMENTS_INDESIRABLES_NON_RENSEIGNES)
    return nonRenseignees;
  }

  public get lesDonnéesQualitePasAutorisés(): string[] {
    const nonAutorisés: string[] = [];
    if (this.lesReclamationsNeSontPasAutorisées) nonAutorisés.push(this.wording.RECLAMATIONS);
    if (this.lesEvenementsIndesirablesNeSontPasAutorisées) nonAutorisés.push(this.wording.EVENEMENTS_INDESIRABLES)
    return nonAutorisés;
  }

  public get buildReclamationsData(): any {
    const reclamationData: { [key: number]: any } = {};
    for (const reclamation of this.etablissementTerritorialQualiteMédicoSocial.reclamations) {
      const key = reclamation.année;
      const value = { total_clotures: reclamation.totalClotures, total_encours: reclamation.totalEncours, dateMiseAJourSource: reclamation.dateMiseÀJourSource, details: reclamation.details };
      reclamationData[key] = value;
    };
    return reclamationData;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.etablissementTerritorialQualiteMédicoSocial.reclamations[0]?.dateMiseÀJourSource as string);
  }

}
