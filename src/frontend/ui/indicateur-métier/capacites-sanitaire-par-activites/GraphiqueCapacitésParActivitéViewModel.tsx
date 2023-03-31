import { ReactElement } from "react";

import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { DeuxHistogrammesHorizontaux, HistogrammeData } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";

export class GraphiqueCapacitésParActivitéViewModel extends GraphiqueViewModel {
  private NOMBRE_ANNEES = 5;

  constructor(private readonly capacitésSanitaire: CapacitéSanitaire[], wording: Wording) {
    super(wording);
  }

  public get annéeInitiale() {
    return this.filtrerLesAnnéesAvecDesCapacités()[0];
  }

  public filtrerLesAnnéesAvecDesCapacités() {
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

    const valeurDeGauche: HistogrammeData = new HistogrammeData(
      libellés,
      lits,
      [{ data: lits, backgroundColor: [this.couleurDuFondHistogrammeSecondaire], isError: [false], label: this.wording.LITS }],
      this.wording.LITS
    );

    const valeurDeDroite: HistogrammeData = new HistogrammeData(
      libellés,
      places,
      [{ data: places, backgroundColor: [this.couleurDuFondHistogrammeSecondaire], isError: [false], label: this.wording.PLACES }],
      this.wording.PLACES
    );

    return (
      <DeuxHistogrammesHorizontaux
        annéesManquantes={annéesManquantes(this.filtrerLesAnnéesAvecDesCapacités(), this.NOMBRE_ANNEES)}
        nom={this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
        nombreDAnnéeTotale={this.NOMBRE_ANNEES}
        valeursDeDroite={valeurDeDroite}
        valeursDeGauche={valeurDeGauche}
      />
    );
  }
}
