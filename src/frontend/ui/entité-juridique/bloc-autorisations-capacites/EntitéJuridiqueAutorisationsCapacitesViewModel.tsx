import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";

export class EntitéJuridiqueAutorisationsCapacitesViewModel {
  public graphiqueCapacitesParActivitesViewModel: GraphiqueCapacitésParActivitéViewModel;

  constructor(private capacites: CapacitéSanitaire[], wording: Wording) {
    this.graphiqueCapacitesParActivitesViewModel = new GraphiqueCapacitésParActivitéViewModel(capacites, wording);
  }

  public get lesAutorisationsCapacitesNeSontPasRenseignées() {
    return this.capacites && this.capacites.length > 0;
  }
}
