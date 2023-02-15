import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class EntitéJuridiqueActivitésViewModel extends GraphiqueViewModel {
  // @ts-ignore
  public nombreDePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  public nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;

  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], wording: Wording) {
    super(wording);
    this.createNombrePassageUrgenceViewModel(wording);
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(entitéJuridiqueActivités, wording);
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
    return !this.activitéEstElleRenseignée || !this.nombrePassageUrgenceEstIlRenseigné();
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.entitéJuridiqueActivités.length > 0;
  }

  private nombrePassageUrgenceEstIlRenseigné(): boolean {
    return this.entitéJuridiqueActivités.some((activité: EntitéJuridiqueActivités) => activité.nombreDePassagesAuxUrgences.value !== null);
  }
}
