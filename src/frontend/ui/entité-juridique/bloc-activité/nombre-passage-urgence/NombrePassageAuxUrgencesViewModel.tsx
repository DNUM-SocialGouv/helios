import { EntitéJuridiqueActivités } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { Wording } from "../../../../configuration/wording/Wording";
import { CouleurHistogramme, GraphiqueViewModel } from "../../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../../commun/StringFormater";

export class NombrePassageAuxUrgencesViewModel extends GraphiqueViewModel {
  readonly ratioHistogrammeNombreDePassagesAuxUrgences = 7;
  public valeurs: number[];
  private années: number[];
  public nombreDeLibelléTotal = 5;

  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], wording: Wording) {
    super(wording);
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("nombreDePassagesAuxUrgences");
    this.valeurs = valeurs;
    this.années = années;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formateLaDate(this.entitéJuridiqueActivités[0].nombreDePassagesAuxUrgences.dateMiseÀJourSource);
  }

  get ratioLargeurSurHauteur() {
    return this.ratioHistogrammeNombreDePassagesAuxUrgences;
  }

  get libellés() {
    return this.années;
  }

  get libellésDeValeursManquantes() {
    return this.annéesManquantes(this.années, 5);
  }

  get libellésDesTicks() {
    return this.années.map((année) => ({ tailleDePolice: this.estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));
  }

  get libellésDesValeurs() {
    return Array(this.valeurs.length).fill({ couleur: this.couleurIdentifiant });
  }

  get identifiant() {
    return this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES;
  }

  get couleursDeLHistogramme() {
    const construisLaCouleurDeLaBarreHorizontale = (_valeur: number, année: number | string): CouleurHistogramme => {
      return this.estCeLAnnéePassée(année)
        ? {
            premierPlan: this.couleurDuFondHistogrammePrimaire,
            secondPlan: this.couleurDuFond,
          }
        : {
            premierPlan: this.couleurDuFondHistogrammeSecondaire,
            secondPlan: this.couleurDuFond,
          };
    };
    return this.construisLesCouleursDeLHistogramme(this.valeurs, this.années, construisLaCouleurDeLaBarreHorizontale);
  }

  private construisLesAnnéesEtSesValeurs(
    indicateur: Exclude<keyof EntitéJuridiqueActivités, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.entitéJuridiqueActivités.forEach((activité: EntitéJuridiqueActivités) => {
      if (activité[indicateur].value !== null) {
        années.push(activité.année);
      }

      if (activité[indicateur].value !== null) {
        // @ts-ignore
        valeurs.push(activité[indicateur].value);
      }
    });

    return [valeurs, années];
  }
}
