import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { HistogrammeData } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { StringFormater } from "../../commun/StringFormater";

export class GraphiqueCapacitésParActivitéViewModel {
  public NOMBRE_ANNEES = 5;

  constructor(private readonly capacitésSanitaire: CapacitéSanitaire[], private wording: Wording) {}

  public get annéeInitiale() {
    return this.filtrerLesAnnéesAvecDesCapacités()[0];
  }

  public filtrerLesAnnéesAvecDesCapacités(): number[] {
    return this.filtreLesCapacitésRenseignées().map((capacité) => capacité.année);
  }

  private filtreLesCapacitésRenseignées() {
    return this.capacitésSanitaire.filter((capacités) => {
      return (
        capacités.nombreDeLitsEnMédecine !== null ||
        capacités.nombreDeLitsEnObstétrique !== null ||
        capacités.nombreDeLitsEnSsr !== null ||
        capacités.nombreDePlacesEnChirurgie !== null ||
        capacités.nombreDePlacesEnMédecine !== null ||
        capacités.nombreDePlacesEnObstétrique !== null ||
        capacités.nombreDePlacesEnSsr !== null ||
        capacités.nombreDeLitsEnUsld !== null ||
        capacités.nombreDeLitsEnChirurgie !== null ||
        capacités.nombreDeLitsOuPlacesEnPsyHospitalisationComplète !== null ||
        capacités.nombreDePlacesEnPsyHospitalisationPartielle !== null
      );
    });
  }

  public get lesCapacitésParActivitésSontEllesRenseignées(): boolean {
    return this.filtreLesCapacitésRenseignées().length > 0;
  }

  public get dateDeMiseÀJourDeLaCapacitéInstalléeParActivités(): string {
    return StringFormater.formateLaDate(this.capacitésSanitaire[0]?.dateMiseÀJourSource as string);
  }

  public annéesManquantes(): number[] {
    return annéesManquantes(this.filtrerLesAnnéesAvecDesCapacités(), this.NOMBRE_ANNEES);
  }

  private litsEtPlaces(annéeSelectionnée: number) {
    const capacitésSelectionnées = this.capacitésSanitaire.find((capacité) => capacité.année === annéeSelectionnée) as CapacitéSanitaire;
    const litsEtPlaces = [
      {
        libellé: this.wording.MÉDECINE,
        nombreDeLits: capacitésSelectionnées?.nombreDeLitsEnMédecine as number,
        nombreDePlaces: capacitésSelectionnées?.nombreDePlacesEnMédecine as number,
      },
      {
        libellé: this.wording.CHIRURGIE,
        nombreDeLits: capacitésSelectionnées?.nombreDeLitsEnChirurgie as number,
        nombreDePlaces: capacitésSelectionnées?.nombreDePlacesEnChirurgie as number,
      },
      {
        libellé: this.wording.OBSTÉTRIQUE,
        nombreDeLits: capacitésSelectionnées?.nombreDeLitsEnObstétrique as number,
        nombreDePlaces: capacitésSelectionnées?.nombreDePlacesEnObstétrique as number,
      },
      {
        libellé: this.wording.SSR,
        nombreDeLits: capacitésSelectionnées?.nombreDeLitsEnSsr as number,
        nombreDePlaces: capacitésSelectionnées?.nombreDePlacesEnSsr as number,
      },
      {
        libellé: this.wording.USLD,
        nombreDeLits: capacitésSelectionnées?.nombreDeLitsEnUsld as number,
        nombreDePlaces: 0,
      },
      {
        libellé: this.wording.PSYCHIATRIE,
        nombreDeLits: capacitésSelectionnées?.nombreDeLitsOuPlacesEnPsyHospitalisationComplète as number,
        nombreDePlaces: capacitésSelectionnées?.nombreDePlacesEnPsyHospitalisationPartielle as number,
      },
    ];

    return litsEtPlaces.filter((litEtPlace) => {
      return !(
        (litEtPlace.nombreDeLits === null && litEtPlace.nombreDePlaces === null) ||
        (litEtPlace.libellé === this.wording.USLD && litEtPlace.nombreDeLits === null)
      );
    });
  }

  private libellés(annéeEnCours: number) {
    return this.litsEtPlaces(annéeEnCours).map((litEtPlace) => litEtPlace.libellé);
  }

  private lits(annéeEnCours: number) {
    return this.litsEtPlaces(annéeEnCours).map((litEtPlace) => litEtPlace.nombreDeLits);
  }

  private places(annéeEnCours: number) {
    return this.litsEtPlaces(annéeEnCours).map((litEtPlace) => litEtPlace.nombreDePlaces);
  }

  private valueFormatter(value: number): string {
    return value === null || value === undefined ? this.wording.NON_RENSEIGNÉ : value.toString();
  }

  public valeursLits(annéeEnCours: number): HistogrammeData {
    const lits = this.lits(annéeEnCours);
    return new HistogrammeData(
      this.libellés(annéeEnCours),
      lits,
      [
        {
          data: lits,
          backgroundColor: ["#4E68BB"],
          isError: [false],
          label: this.wording.LITS,
        },
      ],
      this.wording.LITS,
      2,
      this.valueFormatter.bind(this)
    );
  }

  public valeursPlaces(annéeEnCours: number): HistogrammeData {
    const places = this.places(annéeEnCours);
    return new HistogrammeData(
      this.libellés(annéeEnCours),
      places,
      [
        {
          data: places,
          backgroundColor: ["#4E68BB"],
          isError: [false],
          label: this.wording.PLACES,
        },
      ],
      this.wording.PLACES,
      2,
      this.valueFormatter.bind(this)
    );
  }
}
