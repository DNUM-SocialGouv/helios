import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { NombreDeJourneesPsySSRViewModel } from "../../indicateur-métier/nombre-journees-psy-ssr/NombreDeJourneesPsySSRViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class ÉtablissementTerritorialSanitaireActivitéViewModel {
  // @ts-ignore
  nombreDePassagesAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  wording: Wording;

  constructor(private readonly établissementTerritorialSanitaireActivités: ÉtablissementTerritorialSanitaire["activités"], wording: Wording) {
    this.createNombrePassageUrgenceViewModel(wording);
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(établissementTerritorialSanitaireActivités, wording);
    this.nombreJourneesPsySSRViewModel = new NombreDeJourneesPsySSRViewModel(établissementTerritorialSanitaireActivités, wording);
    this.wording = wording;
  }

  private createNombrePassageUrgenceViewModel(wording: Wording) {
    const indicateurNombrePassage: IndicateurActivité[] = this.établissementTerritorialSanitaireActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreDePassagesAuxUrgences.dateMiseÀJourSource,
        value: activité.nombreDePassagesAuxUrgences.value,
      };
    });
    this.nombreDePassagesAuxUrgencesViewModel = new NombrePassageAuxUrgencesViewModel(indicateurNombrePassage, wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
        !this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
        !this.nombreDePassagesAuxUrgencesEstIlRenseigné)
    );
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorialSanitaireActivités.length !== 0;
  }

  public get nombreDePassagesAuxUrgencesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("nombreDePassagesAuxUrgences");
  }

  public get nombreDePassagesAuxUrgencesEstIlAutorisé(): boolean {
    return this.lIndicateurEstIlAutorisé("nombreDePassagesAuxUrgences");
  }

  private lIndicateurEstIlRenseigné(
    indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialSanitaireActivités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur].value !== null);
  }

  private lIndicateurEstIlAutorisé(
    indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialSanitaireActivités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur].value !== '');
  }

  public get lesDonnéesActivitésPasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsAutorisés) nonAutorisés.push(this.wording.NOMBRE_DE_SÉJOUR_MCO);
    if (!this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsAutorisé) nonAutorisés.push(this.wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR);
    if (!this.nombreDePassagesAuxUrgencesEstIlAutorisé) nonAutorisés.push(this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES);

    return nonAutorisés;
  }
}
