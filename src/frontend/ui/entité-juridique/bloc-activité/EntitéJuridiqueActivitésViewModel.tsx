import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { Wording } from "../../../configuration/wording/Wording";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { GraphiqueNombreHADViewModel } from "../../indicateur-métier/nombre-de-had/GraphiqueNombreHADViewModel";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { ActivitesPsySSR, NombreDeJourneesPsySSRViewModel } from "../../indicateur-métier/nombre-journees-psy-ssr/NombreDeJourneesPsySSRViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class EntitéJuridiqueActivitésViewModel {
  public nombreDePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  public nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  public nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  public nombreHADViewModel: GraphiqueNombreHADViewModel;

  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], private wording: Wording) {
    this.nombreDePassageAuxUrgencesViewModel = this.createNombrePassageUrgenceViewModel();
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(entitéJuridiqueActivités, this.wording);
    this.nombreJourneesPsySSRViewModel = this.createNombreJourneesPsySSRViewModel();
    this.nombreHADViewModel = this.createNombreDeHADViewModel();
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

  private createNombreDeHADViewModel() {
    const indicateurNombreHAD: IndicateurActivité[] = this.entitéJuridiqueActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreSéjoursHad.dateMiseÀJourSource,
        value: activité.nombreSéjoursHad.value,
      };
    });
    return new GraphiqueNombreHADViewModel(indicateurNombreHAD);
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

  public get lesDonnéesActivitéPasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés) nonAutorisés.push(this.wording.NOMBRE_DE_SÉJOUR_MCO);
    if (!this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé) nonAutorisés.push(this.wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR);
    if (!this.nombreHADEstIlAutorisé) nonAutorisés.push(this.wording.NOMBRE_DE_HAD);
    if (!this.nombrePassageUrgenceEstIlAutorisé) nonAutorisés.push(this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES);
    return nonAutorisés;
  }

  public get nombrePassageUrgenceEstIlAutorisé(): boolean {
    return this.entitéJuridiqueActivités.some(
      (activité: EntitéJuridiqueActivités) => activité.nombreDePassagesAuxUrgences.dateMiseÀJourSource !== ''
    );
  }

  public get nombreHADEstIlAutorisé(): boolean {
    return this.entitéJuridiqueActivités.some(
      (activité: EntitéJuridiqueActivités) => activité.nombreSéjoursHad.dateMiseÀJourSource !== ''
    );
  }
}
