import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { ActivitesPsySSR, NombreDeJourneesPsySSRViewModel } from "../../indicateur-métier/nombre-journees-psy-ssr/NombreDeJourneesPsySSRViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class EntitéJuridiqueActivitésViewModel extends GraphiqueViewModel {
  // @ts-ignore
  public nombreDePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  public nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  public nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;

  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], wording: Wording) {
    super(wording);
    this.createNombrePassageUrgenceViewModel(wording);
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(entitéJuridiqueActivités, wording);
    this.nombreJourneesPsySSRViewModel = this.createNombreJourneesPsySSRViewModel(wording);
  }

  private createNombreJourneesPsySSRViewModel(wording: Wording) {
    return new NombreDeJourneesPsySSRViewModel(
      this.entitéJuridiqueActivités.map(
        (activite): ActivitesPsySSR => ({
          ...activite,
          nombreJournéesCompletePsy: activite.nombreJournéesCompletesPsy,
          nombreJournéesPartielsSsr: activite.nombreJournéesPartiellesSsr,
        })
      ),
      wording
    );
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
    return (
      !this.activitéEstElleRenseignée ||
      (!this.nombrePassageUrgenceEstIlRenseigné() &&
        !this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
        !this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés)
    );
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.entitéJuridiqueActivités.length > 0;
  }

  private nombrePassageUrgenceEstIlRenseigné(): boolean {
    return this.entitéJuridiqueActivités.some((activité: EntitéJuridiqueActivités) => activité.nombreDePassagesAuxUrgences.value !== null);
  }
}
