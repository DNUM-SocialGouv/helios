import { AutorisationActivites, AutorisationsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";

export class EntitéJuridiqueAutorisationsCapacitesViewModel {
  public graphiqueCapacitesParActivitesViewModel: GraphiqueCapacitésParActivitéViewModel;
  public autorisationsActivités: AutorisationActivites[];
  public dateMiseAJourAutorisationActivités: string;

  constructor(private capacites: CapacitéSanitaire[], autorisationsSanitaire: AutorisationsActivités, wording: Wording) {
    this.graphiqueCapacitesParActivitesViewModel = new GraphiqueCapacitésParActivitéViewModel(capacites, wording);
    this.autorisationsActivités = autorisationsSanitaire.autorisations;
    this.dateMiseAJourAutorisationActivités = autorisationsSanitaire.dateMiseÀJourSource;
  }

  public get lesAutorisationsCapacitesNeSontPasRenseignées() {
    return !(this.capacites && this.capacites.length > 0);
  }

  public lesAutorisationsActivitesNeSontPasRenseignées(): boolean {
    return !(this.autorisationsActivités && this.autorisationsActivités.length > 0);
  }
}
