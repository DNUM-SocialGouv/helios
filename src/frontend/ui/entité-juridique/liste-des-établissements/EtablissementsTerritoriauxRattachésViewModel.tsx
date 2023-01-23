import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Wording } from "../../../configuration/wording/Wording";
import { ÉtablissementTerritorialRattachéViewModel } from "./ÉtablissementTerritorialRattachéViewModel";

export class EtablissementsTerritoriauxRattachésViewModel {
  private établissementTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[];

  constructor(établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[], wording: Wording) {
    this.établissementTerritoriauxRattachésViewModels = établissementsTerritoriauxRattachés.map(
      (établissement) => new ÉtablissementTerritorialRattachéViewModel(établissement, wording)
    );
  }

  public get nombreEtablissements(): number {
    return this.établissementTerritoriauxRattachésViewModels.length;
  }

  public get établissementSanitaires(): ÉtablissementTerritorialRattachéViewModel[] {
    return this.établissementTerritoriauxRattachésViewModels.filter((établissement) => établissement.domaine === DomaineÉtablissementTerritorial.SANITAIRE);
  }

  public get établissementMedicauxSociaux(): ÉtablissementTerritorialRattachéViewModel[] {
    return this.établissementTerritoriauxRattachésViewModels.filter((établissement) => établissement.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL);
  }
}
