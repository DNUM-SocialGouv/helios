import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { NombreDeJourneesPsySSRViewModel } from "../../indicateur-métier/nombre-journees-psy-ssr/NombreDeJourneesPsySSRViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class ÉtablissementTerritorialSanitaireActivitéViewModel extends GraphiqueViewModel {
  // @ts-ignore
  nombreDePassagesAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;

  constructor(private readonly établissementTerritorialSanitaireActivités: ÉtablissementTerritorialSanitaire["activités"], wording: Wording) {
    super(wording);
    this.createNombrePassageUrgenceViewModel(wording);
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(établissementTerritorialSanitaireActivités, wording);
    this.nombreJourneesPsySSRViewModel = new NombreDeJourneesPsySSRViewModel(établissementTerritorialSanitaireActivités, wording);
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

  private lIndicateurEstIlRenseigné(
    indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialSanitaireActivités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur].value !== null);
  }
}
