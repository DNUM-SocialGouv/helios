import { Wording } from "../../../configuration/wording/Wording";

export class ÉtablissementTerritorialQualiteMédicoSocialViewModel {

  public wording: Wording;

  constructor(wording: Wording) {
    this.wording = wording;
  }


  public get lesReclamationsNeSontPasRenseignées(): boolean {
    return true;
  }

  public get lesReclamationsNeSontPasAutorisées(): boolean {
    return true;
  }

  public get lesDonnéesQualitePasRenseignees(): string[] {
    const nonRenseignees: string[] = [];
    return nonRenseignees;
  }

  public get lesDonnéesQualitePasAutorisés(): string[] {
    const nonAutorisés: string[] = [];
    return nonAutorisés;
  }
}
