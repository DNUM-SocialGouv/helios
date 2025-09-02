import { Dispatch, SetStateAction } from "react";

import { EtablissementTerritorialRattacheViewModel } from "./ÉtablissementTerritorialRattachéViewModel";
import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Wording } from "../../../configuration/wording/Wording";

export class EtablissementsTerritoriauxRattachésViewModel {
  private établissementTerritoriauxRattachésViewModels: EtablissementTerritorialRattacheViewModel[];
  private voirTout = false;
  public readonly LIMIT_ET_AFFICHES: number = 10;
  public établissementSanitaires: EtablissementTerritorialRattacheViewModel[];
  public établissementMedicauxSociaux: EtablissementTerritorialRattacheViewModel[];

  constructor(établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[], wording: Wording) {
    this.établissementTerritoriauxRattachésViewModels = établissementsTerritoriauxRattachés.map(
      (établissement) => new EtablissementTerritorialRattacheViewModel(établissement, wording)
    );
    this.établissementSanitaires = this.établissementTerritoriauxRattachésViewModels.filter(this.uniquementETSanitaires).sort(this.trierParCategorieFiness);
    this.établissementMedicauxSociaux = this.établissementTerritoriauxRattachésViewModels
      .filter(this.uniquementETMedicauxSociaux)
      .sort(this.trierParCategorieFiness);
  }

  public voirPlus(setVoirPlus: Dispatch<SetStateAction<boolean>>): void {
    this.metLeFocusSurLePremierETSupplémentaire();
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

  public get établissementSanitairesPaginés(): EtablissementTerritorialRattacheViewModel[] {
    return this.établissementsPaginés(this.établissementSanitaires);
  }

  public get établissementMédicoSociauxPaginés(): EtablissementTerritorialRattacheViewModel[] {
    return this.établissementsPaginés(this.établissementMedicauxSociaux);
  }

  public get depasseLimiteAffichage(): boolean {
    return this.établissementMedicauxSociaux.length > this.LIMIT_ET_AFFICHES || this.établissementSanitaires.length > this.LIMIT_ET_AFFICHES;
  }

  public get plusDETSanitaire(): boolean {
    return this.établissementSanitaires.length > this.établissementMedicauxSociaux.length;
  }

  private trierParCategorieFiness(établissement1: EtablissementTerritorialRattacheViewModel, établissement2: EtablissementTerritorialRattacheViewModel) {
    return établissement1.libelléCatégorieÉtablissement.localeCompare(établissement2.libelléCatégorieÉtablissement);
  }

  private uniquementETMedicauxSociaux(établissement: EtablissementTerritorialRattacheViewModel) {
    return établissement.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL;
  }

  private uniquementETSanitaires(établissement: EtablissementTerritorialRattacheViewModel) {
    return établissement.domaine === DomaineÉtablissementTerritorial.SANITAIRE;
  }

  private metLeFocusSurLePremierETSupplémentaire() {
    this.plusDETSanitaire
      ? (this.metLeFocusSurSanitaire())
      : (this.metLeFocusSurMedicauxSociaux());
  }

  private metLeFocusSurSanitaire() {
    this.établissementSanitaires[this.LIMIT_ET_AFFICHES].doitAvoirLeFocus = true;
  }

  private metLeFocusSurMedicauxSociaux() {
    this.établissementMedicauxSociaux[this.LIMIT_ET_AFFICHES].doitAvoirLeFocus = true;
  }

  private établissementsPaginés(établissements: EtablissementTerritorialRattacheViewModel[]) {
    return établissements.slice(0, this.voirTout ? établissements.length : this.LIMIT_ET_AFFICHES);
  }
}
