import { ReactElement } from "react";

import { EntiteJuridiqueRessourcesHumaines } from "../../../../backend/métier/entities/entité-juridique/EntiteJuridiqueRessourcesHumaines";
import { Wording } from "../../../configuration/wording/Wording";
import { estCeLAnnéePassée } from "../../../utils/dateUtils";
import { couleurDuFond, couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { StringFormater } from "../../commun/StringFormater";

type IndicateurAvecNombre = Exclude<
  keyof EntiteJuridiqueRessourcesHumaines, "annee"
>;

export class EntiteJuridiqueRessourcesHumainesViewModel {

  constructor(private readonly ressourcesHumainesEntiteJuridique: EntiteJuridiqueRessourcesHumaines[], private readonly wording: Wording) {
  }



  public get dateMiseAJourNombreEtpPm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEntiteJuridique[0].nombreEtpPm.dateMiseAJourSource);
  }

  public get nombreEtpPm(): ReactElement {
    const [valeurs, annees] = this.extraireLesValeursNombreesDesIndicateurs("nombreEtpPm");
    const couleursHistogramme = annees.map((annee) => ({
      premierPlan: estCeLAnnéePassée(annee) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond
    }));
    //TODO: compléter les années manquantes
    const anneesManquantes: number[] = [];
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.NOMBRE_D_ETP_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  private extraireLesValeursNombreesDesIndicateurs(indicateur: IndicateurAvecNombre): [number[], string[]] {
    const valeurs: number[] = [];
    const annees: string[] = [];
    //TODO: Remplacer les valeurs fictives 
    this.ressourcesHumainesEntiteJuridique.forEach((donneeRessourceHumaineEntiteJuridique: EntiteJuridiqueRessourcesHumaines) => {
      const valeur = donneeRessourceHumaineEntiteJuridique[indicateur].valeur;
      if (valeur !== null && valeur !== "") {
        annees.push(donneeRessourceHumaineEntiteJuridique.annee.toString());
        valeurs.push(valeur);
      }
    });
    return [valeurs, annees]
  }

}
