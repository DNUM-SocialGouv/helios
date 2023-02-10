import { IndicateurActivité } from "../../../../../backend/métier/entities/indicateurs/IndicateurActivité";
import { Wording } from "../../../../configuration/wording/Wording";
import { CouleurHistogramme, GraphiqueViewModel } from "../../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../../commun/StringFormater";

export class NombrePassageAuxUrgencesViewModel extends GraphiqueViewModel {
  readonly ratioHistogrammeNombreDePassagesAuxUrgences = 7;
  public valeurs: number[];
  private années: number[];
  public nombreDeLibelléTotal = 5;

  constructor(private readonly indicateurActivité: IndicateurActivité[], wording: Wording) {
    super(wording);
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs();
    this.valeurs = valeurs;
    this.années = années;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formateLaDate(this.indicateurActivité[0].dateMiseÀJourSource);
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

  private construisLesAnnéesEtSesValeurs(): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.indicateurActivité.forEach((indicateur: IndicateurActivité) => {
      if (indicateur.value !== null) {
        années.push(indicateur.année);
      }

      if (indicateur.value !== null) {
        valeurs.push(indicateur.value);
      }
    });

    return [valeurs, années];
  }
}
