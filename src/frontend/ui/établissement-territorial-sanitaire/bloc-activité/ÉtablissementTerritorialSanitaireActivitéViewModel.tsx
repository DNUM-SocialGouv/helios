import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { DureeMoyenneSejourMCOViewModel } from "../../indicateur-métier/duree-moyenne-sejour-mco/DureeMoyenneDeSejourMCOViewModel";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { NombreDeJourneesPsySSRViewModel } from "../../indicateur-métier/nombre-journees-psy-ssr/NombreDeJourneesPsySSRViewModel";
import { NombreDeJourneesUsldViewModel } from "../../indicateur-métier/nombre-journees-usld/NombreDeJourneesUsldViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class EtablissementTerritorialSanitaireActiviteViewModel {
  // @ts-ignore
  nombreDePassagesAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  nombreDeJourneesUsldViewModel: NombreDeJourneesUsldViewModel;
  dureeMoyenneSejourMCOViewModel: DureeMoyenneSejourMCOViewModel;
  wording: Wording;

  constructor(private readonly établissementTerritorialSanitaireActivités: ÉtablissementTerritorialSanitaire["activités"], wording: Wording) {
    this.createNombrePassageUrgenceViewModel(wording);
    this.nombreDeJourneesUsldViewModel = this.createNombreDeJourneesUsldViewModel();
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(établissementTerritorialSanitaireActivités, wording);
    this.nombreJourneesPsySSRViewModel = new NombreDeJourneesPsySSRViewModel(établissementTerritorialSanitaireActivités, wording);
    this.dureeMoyenneSejourMCOViewModel = new DureeMoyenneSejourMCOViewModel(établissementTerritorialSanitaireActivités, wording);
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

  private createNombreDeJourneesUsldViewModel() {
    const indicateurNombreJourneesUsld: IndicateurActivité[] = this.établissementTerritorialSanitaireActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreJourneesUsld.dateMiseÀJourSource,
        value: activité.nombreJourneesUsld.value,
      };
    });
    return new NombreDeJourneesUsldViewModel(indicateurNombreJourneesUsld, this.wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
        !this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
        !this.nombreDePassagesAuxUrgencesEstIlRenseigné &&
        !this.nombreDeJourneesUsldEstIlRenseigne &&
        !this.dureeMoyenneSejourMCOViewModel.moyenneSejoursMCOSontIlsRenseignés)
    );
  }

  public get lesDonnéesActivitésPasRenseignee(): string[] {
    const nonRenseignes = [];
    if (!this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés) nonRenseignes.push(this.wording.NOMBRE_DE_SÉJOUR_MCO);
    if (!this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés) nonRenseignes.push(this.wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR);
    if (!this.nombreDePassagesAuxUrgencesEstIlRenseigné) nonRenseignes.push(this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES);
    if (!this.nombreDeJourneesUsldEstIlRenseigne) nonRenseignes.push(this.wording.NOMBRE_DE_JOURNEES_USLD)
    if (!this.dureeMoyenneSejourMCOViewModel.moyenneSejoursMCOSontIlsRenseignés) nonRenseignes.push(this.wording.MOYENNE_DE_SEJOUR_MCO)

    return nonRenseignes;
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

  public get nombreDeJourneesUsldEstIlRenseigne(): boolean {
    return this.lIndicateurEstIlRenseigné("nombreJourneesUsld");
  }

  public get nombreDeJourneesUsldEstIlAutorise(): boolean {
    return this.lIndicateurEstIlAutorisé("nombreJourneesUsld");
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
    if (!this.nombreDeJourneesUsldEstIlAutorise) nonAutorisés.push(this.wording.NOMBRE_DE_JOURNEES_USLD)
    if (!this.dureeMoyenneSejourMCOViewModel.moyenneSejoursMCOSontIlsAutorisés) nonAutorisés.push(this.wording.MOYENNE_DE_SEJOUR_MCO)

    return nonAutorisés;
  }
}
