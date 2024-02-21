import { ÉtablissementTerritorialQualite } from "../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { Wording } from "../../../configuration/wording/Wording";

export class ÉtablissementTerritorialQualiteSanitaireViewModel {

  public wording: Wording;
  public etablissementTerritorialQualiteSanitaire: ÉtablissementTerritorialQualite;

  constructor(wording: Wording, etablissementTerritorialQualiteSanitaire: ÉtablissementTerritorialQualite) {
    this.wording = wording;
    this.etablissementTerritorialQualiteSanitaire = etablissementTerritorialQualiteSanitaire;
  }


  public get lesReclamationsNeSontPasRenseignées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.reclamations.length === 0;
  }

  public get lesReclamationsNeSontPasAutorisées(): boolean {
    return this.etablissementTerritorialQualiteSanitaire.reclamations.length === 1 &&
      this.etablissementTerritorialQualiteSanitaire.reclamations[0].details.length === 0;
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
