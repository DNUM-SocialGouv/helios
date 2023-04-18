import { AutorisationActivites } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";

export class EntitéJuridiqueAutorisationsCapacitesViewModel {
  public graphiqueCapacitesParActivitesViewModel: GraphiqueCapacitésParActivitéViewModel;
  public autorisations: AutorisationActivites[];

  constructor(private capacites: CapacitéSanitaire[], private autorisationSanitare: AutorisationActivites[], wording: Wording) {
    this.graphiqueCapacitesParActivitesViewModel = new GraphiqueCapacitésParActivitéViewModel(capacites, wording);
    this.autorisations = autorisationSanitare;
  }

  public get lesAutorisationsCapacitesNeSontPasRenseignées() {
    return !(this.capacites && this.capacites.length > 0);
  }

  public lesAutorisationsActivitesNeSontPasRenseignées(): boolean {
    return !(this.autorisationSanitare && this.autorisationSanitare.length > 0);
  }
}
