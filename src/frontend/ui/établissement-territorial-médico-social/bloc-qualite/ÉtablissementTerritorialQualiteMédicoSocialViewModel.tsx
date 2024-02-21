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
}
