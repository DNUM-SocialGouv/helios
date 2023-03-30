import { ChangeEvent, ReactElement } from "react";

import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { Select } from "../../commun/Select/Select";
import { StringFormater } from "../../commun/StringFormater";

export class GraphiqueCapacitésParActivitéViewModel extends GraphiqueViewModel {
  private NOMBRE_ANNEES = 5;

  constructor(private readonly capacitésSanitaire: CapacitéSanitaire[], wording: Wording) {
    super(wording);
  }

  public get annéeInitiale() {
    return this.filtrerLesAnnéesAvecDesCapacités()[0];
  }

  public listeDéroulanteDesAnnéesDesCapacités(setAnnéeEnCours: Function): ReactElement {
    const annéesRangéesAntéChronologiquement = this.filtrerLesAnnéesAvecDesCapacités();

    if (annéesRangéesAntéChronologiquement.length > 0) {
      return (
        <Select
          label={this.wording.ANNÉE}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setAnnéeEnCours(Number(event.target.value));
          }}
          options={annéesRangéesAntéChronologiquement}
        />
      );
    }

    return <></>;
  }

  private filtrerLesAnnéesAvecDesCapacités() {
    const capacitésRenseignées = this.filtreLesCapacitésRenseignées();
    return this.annéesRangéesParAntéChronologie(capacitésRenseignées);
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

  private annéesRangéesParAntéChronologie(capacités: CapacitéSanitaire[]): number[] {
    return capacités.map((capacité) => capacité.année).sort((année1, année2) => année2 - année1);
  }

  public get lesCapacitésParActivitésSontEllesRenseignées(): boolean {
    return this.filtreLesCapacitésRenseignées().length > 0;
  }

  public get dateDeMiseÀJourDeLaCapacitéInstalléeParActivités(): string {
    return StringFormater.formateLaDate(this.capacitésSanitaire[0]?.dateMiseÀJourSource as string);
  }

  public capacitéParActivités(annéeSelectionnée: number): ReactElement {
    const capacitéAnnéeSelectionnée = this.capacitésSanitaire.find((capacité) => capacité.année === annéeSelectionnée);
    const litsEtPlaces = [
      {
        libellé: this.wording.MÉDECINE,
        nombreDeLits: capacitéAnnéeSelectionnée?.nombreDeLitsEnMédecine as number,
        nombreDePlaces: capacitéAnnéeSelectionnée?.nombreDePlacesEnMédecine as number,
      },
      {
        libellé: this.wording.CHIRURGIE,
        nombreDeLits: capacitéAnnéeSelectionnée?.nombreDeLitsEnChirurgie as number,
        nombreDePlaces: capacitéAnnéeSelectionnée?.nombreDePlacesEnChirurgie as number,
      },
      {
        libellé: this.wording.OBSTÉTRIQUE,
        nombreDeLits: capacitéAnnéeSelectionnée?.nombreDeLitsEnObstétrique as number,
        nombreDePlaces: capacitéAnnéeSelectionnée?.nombreDePlacesEnObstétrique as number,
      },
      {
        libellé: this.wording.SSR,
        nombreDeLits: capacitéAnnéeSelectionnée?.nombreDeLitsEnSsr as number,
        nombreDePlaces: capacitéAnnéeSelectionnée?.nombreDePlacesEnSsr as number,
      },
      {
        libellé: this.wording.USLD,
        nombreDeLits: capacitéAnnéeSelectionnée?.nombreDeLitsEnUsld as number,
        nombreDePlaces: 0,
      },
      {
        libellé: this.wording.PSYCHIATRIE,
        nombreDeLits: capacitéAnnéeSelectionnée?.nombreDeLitsOuPlacesEnPsyHospitalisationComplète as number,
        nombreDePlaces: capacitéAnnéeSelectionnée?.nombreDePlacesEnPsyHospitalisationPartielle as number,
      },
    ];
    const litsEtPlacesSansLignesVides = litsEtPlaces.filter((litEtPlace) => {
      return !(
        (litEtPlace.nombreDeLits === null && litEtPlace.nombreDePlaces === null) ||
        (litEtPlace.libellé === this.wording.USLD && litEtPlace.nombreDeLits === null)
      );
    });
    const libellés = litsEtPlacesSansLignesVides.map((litEtPlace) => litEtPlace.libellé);
    const lits = litsEtPlacesSansLignesVides.map((litEtPlace) => litEtPlace.nombreDeLits);
    const places = litsEtPlacesSansLignesVides.map((litEtPlace) => litEtPlace.nombreDePlaces);
    const chartColors = [this.couleurDuFondHistogrammeSecondaire];
    const identifiants = [this.wording.LITS, this.wording.PLACES];
    const ratioHistogrammeCapacitéParActivités = litsEtPlacesSansLignesVides.length < 3 ? 9 : 5;

    return this.afficheDeuxHistogrammesHorizontaux(
      chartColors,
      lits,
      places,
      libellés,
      ratioHistogrammeCapacitéParActivités,
      this.wording.ACTIVITÉS,
      identifiants,
      annéesManquantes(this.filtrerLesAnnéesAvecDesCapacités(), this.NOMBRE_ANNEES),
      this.NOMBRE_ANNEES
    );
  }
}
