import { AutorisationsActivités, AutresActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";

export class EntitéJuridiqueAutorisationsCapacitesViewModel {
  public graphiqueCapacitesParActivitesViewModel: GraphiqueCapacitésParActivitéViewModel;
  public autorisationsActivités: AutorisationsActivités;
  public autresActivités: AutresActivités;
  public dateMiseAJourAutorisationActivités: string;

  constructor(
    private capacites: CapacitéSanitaire[],
    autorisationsSanitaire: AutorisationsActivités,
    autresActivitesSanitaire: AutresActivités,
    wording: Wording
  ) {
    this.graphiqueCapacitesParActivitesViewModel = new GraphiqueCapacitésParActivitéViewModel(capacites, wording);
    this.autorisationsActivités = autorisationsSanitaire;
    this.autresActivités = autresActivitesSanitaire;
    this.dateMiseAJourAutorisationActivités = autorisationsSanitaire.dateMiseÀJourSource;
  }

  public get lesAutorisationsCapacitesNeSontPasRenseignées() {
    return !(this.capacites && this.capacites.length > 0);
  }

  public lesAutorisationsActivitesNeSontPasRenseignées(): boolean {
    return !(this.autorisationsActivités.autorisations && this.autorisationsActivités.autorisations.length > 0);
  }
  public lesAutresActivitesNeSontPasRenseignées(): boolean {
    return !(this.autresActivités.autorisations && this.autresActivités.autorisations.length > 0);
  }
}
