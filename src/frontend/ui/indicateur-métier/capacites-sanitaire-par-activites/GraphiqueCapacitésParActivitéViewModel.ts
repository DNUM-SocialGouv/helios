import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { HistogrammeData } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { StringFormater } from "../../commun/StringFormater";

interface AnneeModifiable {
  NOMBRE_ANNEES: number;
  annéeInitiale: number;
  annéesAvecDonnées: () => number[];
  annéesManquantes: () => number[];
}

export class GraphiqueCapacitésParActivitéViewModel implements AnneeModifiable {
  public NOMBRE_ANNEES = 5;

  constructor(private readonly capacitésSanitaire: CapacitéSanitaire[], private wording: Wording) {}

  public get annéeInitiale() {
    return this.annéesAvecDonnées()[0];
  }

  public annéesAvecDonnées(): number[] {
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
    return annéesManquantes(this.annéesAvecDonnées(), this.NOMBRE_ANNEES);
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
      this.wording.LITS,
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
      this.valueFormatter.bind(this)
    );
  }

  public valeursPlaces(annéeEnCours: number): HistogrammeData {
    const places = this.places(annéeEnCours);
    return new HistogrammeData(
      this.wording.PLACES,
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
      this.valueFormatter.bind(this)
    );
  }
}
