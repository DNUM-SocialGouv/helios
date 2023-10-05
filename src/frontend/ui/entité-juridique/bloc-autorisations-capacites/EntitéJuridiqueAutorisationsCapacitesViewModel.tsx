import {
  AutorisationsActivités,
  AutresActivités,
  EquipementsMateriauxLourdsActivités,
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
  public equipementsLourds: EquipementsMateriauxLourdsActivités;
  public dateMiseAJourAutorisationActivités: string;
  public wording: any;

  constructor(
    private capacites: CapacitéSanitaire[],
    autorisationsSanitaire: AutorisationsActivités,
    autresActivitesSanitaire: AutresActivités,
    reconnaissancesContractuellesSanitaire: ReconnaissanceContractuelleActivités,
    equipementsLourdsSanitaire: EquipementsMateriauxLourdsActivités,
    wording: Wording
  ) {
    this.graphiqueCapacitesParActivitesViewModel = new GraphiqueCapacitésParActivitéViewModel(capacites, wording);
    this.autorisationsActivités = autorisationsSanitaire;
    this.autresActivités = autresActivitesSanitaire;
    this.reconnaissanceActivités = reconnaissancesContractuellesSanitaire;
    this.wording = wording;
    this.equipementsLourds = equipementsLourdsSanitaire;
    this.dateMiseAJourAutorisationActivités = autorisationsSanitaire.dateMiseÀJourSource;
  }

  public get lesDonnéesAutorisationEtCapacitéPasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.lesAutorisationsCapacitesNeSontPasAutorisées) nonAutorisés.push(this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS);
    if (!this.lesAutorisationsActivitesNeSontPasAutorisées) nonAutorisés.push(this.wording.AUTORISATIONS_ACTIVITES);
    if (!this.lesAutresActivitesNeSontPasAutorisées) nonAutorisés.push(this.wording.AUTRES_ACTIVITÉS);
    if (!this.lesReconnaissanceContractuellesNeSontPasAutoriséess) nonAutorisés.push(this.wording.RECONNAISSANCES_CONTRACTUELLES);
    if (!this.lesEquipementsLourdsNeSontPasAutorisées) nonAutorisés.push(this.wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS);
    return nonAutorisés;
  }

  public get lesAutorisationsCapacitesNeSontPasRenseignées() {
    return !(this.capacites && this.capacites.length > 0);
  }

  public get lesAutorisationsCapacitesNeSontPasAutorisées(): boolean {
    return this.capacites[0].dateMiseÀJourSource !== '';
  }

  public get lesAutorisationsActivitesNeSontPasAutorisées(): boolean {
    return this.autorisationsActivités.dateMiseÀJourSource !== '';
  }
  public get lesAutresActivitesNeSontPasAutorisées(): boolean {
    return this.autresActivités.dateMiseÀJourSource !== '';
  }
  public get lesReconnaissanceContractuellesNeSontPasAutoriséess(): boolean {
    return this.reconnaissanceActivités.dateMiseÀJourSource !== '';
  }
  public get lesEquipementsLourdsNeSontPasAutorisées(): boolean {
    return this.equipementsLourds.dateMiseÀJourSource !== '';
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
  public lesEquipementsLourdsNeSontPasRenseignées(): boolean {
    return !(this.equipementsLourds.autorisations && this.equipementsLourds.autorisations.length > 0);
  }
}
