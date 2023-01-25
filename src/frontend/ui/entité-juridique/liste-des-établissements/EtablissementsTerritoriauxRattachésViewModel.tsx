import { Dispatch, SetStateAction } from "react";

import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Wording } from "../../../configuration/wording/Wording";
import { ÉtablissementTerritorialRattachéViewModel } from "./ÉtablissementTerritorialRattachéViewModel";

export class EtablissementsTerritoriauxRattachésViewModel {
  private établissementTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[];
  LIMIT_ET_AFFICHES: number = 10;
  private voirTout = false;
  public établissementSanitaires: ÉtablissementTerritorialRattachéViewModel[];
  public établissementMedicauxSociaux: ÉtablissementTerritorialRattachéViewModel[];

  constructor(établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[], wording: Wording) {
    this.établissementTerritoriauxRattachésViewModels = établissementsTerritoriauxRattachés.map(
      (établissement) => new ÉtablissementTerritorialRattachéViewModel(établissement, wording)
    );
    this.établissementSanitaires = this.établissementTerritoriauxRattachésViewModels.filter(this.uniquementETSanitaires).sort(this.trierParNuméroFiness);
    this.établissementMedicauxSociaux = this.établissementTerritoriauxRattachésViewModels
      .filter(this.uniquementETMedicauxSociaux)
      .sort(this.trierParNuméroFiness);
  }

  public voirPlus(setVoirPlus: Dispatch<SetStateAction<boolean>>): void {
    this.voirTout = true;
    setVoirPlus(true);
  }

  public voirMoins(setVoirPlus: Dispatch<SetStateAction<boolean>>): void {
    this.voirTout = false;
    setVoirPlus(false);
  }

  public get nombreEtablissements(): number {
    return this.établissementTerritoriauxRattachésViewModels.length;
  }

  public get établissementSanitairesPaginés(): ÉtablissementTerritorialRattachéViewModel[] {
    return this.établissementSanitaires.slice(0, this.voirTout ? this.établissementSanitaires.length : this.LIMIT_ET_AFFICHES);
  }

  public get établissementMédicoSociauxPaginés(): ÉtablissementTerritorialRattachéViewModel[] {
    return this.établissementMedicauxSociaux.slice(0, this.voirTout ? this.établissementMedicauxSociaux.length : this.LIMIT_ET_AFFICHES);
  }

  public get depasseLimiteAffichage(): boolean {
    return this.établissementMedicauxSociaux.length > this.LIMIT_ET_AFFICHES || this.établissementSanitaires.length > this.LIMIT_ET_AFFICHES;
  }

  public get plusDETSanitaire(): boolean {
    return this.établissementSanitaires.length > this.établissementMedicauxSociaux.length;
  }

  private trierParNuméroFiness(établissement1: ÉtablissementTerritorialRattachéViewModel, établissement2: ÉtablissementTerritorialRattachéViewModel) {
    return établissement1.numéroFiness.localeCompare(établissement2.numéroFiness);
  }

  private uniquementETMedicauxSociaux(établissement: ÉtablissementTerritorialRattachéViewModel) {
    return établissement.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL;
  }

  private uniquementETSanitaires(établissement: ÉtablissementTerritorialRattachéViewModel) {
    return établissement.domaine === DomaineÉtablissementTerritorial.SANITAIRE;
  }
}
