import { annéesManquantes } from "../../../utils/dateUtils";
import { couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../commun/StringFormater";
import { AnneeModifiable } from "../capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";
import { IndicateurActivité } from "../IndicateurActivité";

export class GraphiqueNombreHADViewModel implements AnneeModifiable {
  public NOMBRE_ANNEES = 5;
  public valeurs: number[];

  constructor(private readonly indicateurActivité: IndicateurActivité[]) {
    this.valeurs = this.indicateurRenseignees.map((indicateur) => indicateur.value as number);
  }

  public annéesAvecDonnées(): number[] {
    return this.indicateurRenseignees.map((indicateur) => indicateur.année);
  }

  public get indicateurRenseignees(): IndicateurActivité[] {
    return this.indicateurActivité.filter((indicateur) => indicateur.value !== null);
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.indicateurActivité[0]?.dateMiseÀJourSource);
  }

  get couleursDeLHistogramme() {
    return this.indicateurRenseignees.map(() => {
      return { premierPlan: couleurDuFondHistogrammeSecondaire };
    });
  }

  public annéesManquantes(): number[] {
    return annéesManquantes(this.annéesAvecDonnées(), this.NOMBRE_ANNEES);
  }

  get libellés(): string[] {
    return this.annéesAvecDonnées().map((annee) => annee.toString());
  }
}
