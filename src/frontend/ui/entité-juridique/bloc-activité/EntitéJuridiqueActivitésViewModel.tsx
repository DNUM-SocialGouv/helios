import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { IndicateurActivité } from "../../../../backend/métier/entities/indicateurs/IndicateurActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class EntitéJuridiqueActivitésViewModel extends GraphiqueViewModel {
  // @ts-ignore
  public nombreDePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;

  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], wording: Wording) {
    super(wording);
    this.createNombrePassageUrgenceViewModel(wording);
  }

  private createNombrePassageUrgenceViewModel(wording: Wording) {
    const indicateurNombrePassage: IndicateurActivité[] = this.entitéJuridiqueActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreDePassagesAuxUrgences.dateMiseÀJourSource,
        value: activité.nombreDePassagesAuxUrgences.value,
      };
    });
    this.nombreDePassageAuxUrgencesViewModel = new NombrePassageAuxUrgencesViewModel(indicateurNombrePassage, wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return !this.activitéEstElleRenseignée;
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.entitéJuridiqueActivités.length > 0;
  }
}
