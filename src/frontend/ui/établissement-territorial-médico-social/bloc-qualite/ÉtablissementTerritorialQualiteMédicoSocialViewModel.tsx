import { ÉtablissementTerritorialQualite } from "../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { Wording } from "../../../configuration/wording/Wording";

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

  public get lesDonnéesQualitePasRenseignees(): string[] {
    const nonRenseignees: string[] = [];
    if (this.lesReclamationsNeSontPasRenseignées) nonRenseignees.push(this.wording.RECLAMATIONS);
    return nonRenseignees;
  }

  public get lesDonnéesQualitePasAutorisés(): string[] {
    const nonAutorisés: string[] = [];
    if (this.lesReclamationsNeSontPasAutorisées) nonAutorisés.push(this.wording.RECLAMATIONS);
    return nonAutorisés;
  }

  public get buildReclamationsData(): any {
    const reclamationData: { [key: number]: any } = {};
    for (const reclamation of this.etablissementTerritorialQualiteMédicoSocial.reclamations) {
      const key = reclamation.année;
      const value = { total_clotures: reclamation.totalClotures, total_encours: reclamation.totalEncours, date_miseAJourSource: reclamation.dateMiseÀJourSource, details: reclamation.details };
      reclamationData[key] = value;
    };
    return reclamationData;
  }
}
