import { ÉtablissementTerritorialQualite } from "../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { Wording } from "../../../configuration/wording/Wording";
import { StringFormater } from "../../commun/StringFormater";


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

  public get lesEvenementsIndesirablesNeSontPasRenseignées(): boolean {
    // return this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[0].total === 0
    //   && this.etablissementTerritorialQualiteSanitaire.evenementsIndesirables[1].total === 0;
    return false;
  }

  public get lesEvenementsIndesirablesNeSontPasAutorisées(): boolean {
    return false;
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
    for (const reclamation of this.etablissementTerritorialQualiteSanitaire.reclamations) {
      const key = reclamation.année;
      const value = { total_clotures: reclamation.totalClotures, total_encours: reclamation.totalEncours, dateMiseAJourSource: reclamation.dateMiseÀJourSource, details: reclamation.details };
      reclamationData[key] = value;
    };
    return reclamationData;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.etablissementTerritorialQualiteSanitaire.reclamations[0]?.dateMiseÀJourSource as string);
  }

}
