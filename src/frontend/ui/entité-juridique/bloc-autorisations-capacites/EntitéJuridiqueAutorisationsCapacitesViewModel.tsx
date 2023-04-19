import {
  AutorisationsActivités,
  AutresActivités,
  ReconnaissanceContractuelleActivités,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";

export class EntitéJuridiqueAutorisationsCapacitesViewModel {
  public graphiqueCapacitesParActivitesViewModel: GraphiqueCapacitésParActivitéViewModel;
  public autorisationsActivités: AutorisationsActivités;
  public autresActivités: AutresActivités;
  public reconnaissanceActivités: ReconnaissanceContractuelleActivités;
  public dateMiseAJourAutorisationActivités: string;

  constructor(
    private capacites: CapacitéSanitaire[],
    autorisationsSanitaire: AutorisationsActivités,
    autresActivitesSanitaire: AutresActivités,
    reconnaissancesContractuellesSanitaire: ReconnaissanceContractuelleActivités,
    wording: Wording
  ) {
    this.graphiqueCapacitesParActivitesViewModel = new GraphiqueCapacitésParActivitéViewModel(capacites, wording);
    this.autorisationsActivités = autorisationsSanitaire;
    this.autresActivités = autresActivitesSanitaire;
    this.reconnaissanceActivités = reconnaissancesContractuellesSanitaire;
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
  public lesReconnaissanceContractuellesNeSontPasRenseignées(): boolean {
    return !(this.reconnaissanceActivités.autorisations && this.reconnaissanceActivités.autorisations.length > 0);
  }
}
