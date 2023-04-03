import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { Wording } from "../../../configuration/wording/Wording";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { GraphiqueNombreHADViewModel } from "../../indicateur-métier/nombre-de-had/GraphiqueNombreHADViewModel";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { ActivitesPsySSR, NombreDeJourneesPsySSRViewModel } from "../../indicateur-métier/nombre-journees-psy-ssr/NombreDeJourneesPsySSRViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class EntitéJuridiqueActivitésViewModel {
  // @ts-ignore
  public nombreDePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  public nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  public nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  // @ts-ignore
  public nombreHADViewModel: GraphiqueNombreHADViewModel;

  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], private wording: Wording) {
    this.nombreDePassageAuxUrgencesViewModel = this.createNombrePassageUrgenceViewModel();
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(entitéJuridiqueActivités, this.wording);
    this.nombreJourneesPsySSRViewModel = this.createNombreJourneesPsySSRViewModel();
    this.createNombreDeHADViewModel(wording);
  }

  private createNombreJourneesPsySSRViewModel() {
    return new NombreDeJourneesPsySSRViewModel(
      this.entitéJuridiqueActivités.map(
        (activite): ActivitesPsySSR => ({
          ...activite,
          nombreJournéesCompletePsy: activite.nombreJournéesCompletesPsy,
          nombreJournéesPartielsSsr: activite.nombreJournéesPartiellesSsr,
        })
      ),
      this.wording
    );
  }

  private createNombrePassageUrgenceViewModel() {
    const indicateurNombrePassage: IndicateurActivité[] = this.entitéJuridiqueActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreDePassagesAuxUrgences.dateMiseÀJourSource,
        value: activité.nombreDePassagesAuxUrgences.value,
      };
    });
    return new NombrePassageAuxUrgencesViewModel(indicateurNombrePassage, this.wording);
  }

  private createNombreDeHADViewModel(wording: Wording) {
    const indicateurNombreHAD: IndicateurActivité[] = this.entitéJuridiqueActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreSéjoursHad.dateMiseÀJourSource,
        value: activité.nombreSéjoursHad.value,
      };
    });
    this.nombreHADViewModel = new GraphiqueNombreHADViewModel(indicateurNombreHAD, wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.nombrePassageUrgenceEstIlRenseigné() &&
        !this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
        !this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
        !this.nombreHADEstIlRenseigné())
    );
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.entitéJuridiqueActivités.length > 0;
  }

  public nombrePassageUrgenceEstIlRenseigné(): boolean {
    return this.entitéJuridiqueActivités.some(
      (activité: EntitéJuridiqueActivités) => activité.nombreDePassagesAuxUrgences.value !== null && activité.nombreDePassagesAuxUrgences.value !== undefined
    );
  }
  public nombreHADEstIlRenseigné(): boolean {
    return this.entitéJuridiqueActivités.some(
      (activité: EntitéJuridiqueActivités) => activité.nombreSéjoursHad.value !== null && activité.nombreSéjoursHad.value !== undefined
    );
  }
}
