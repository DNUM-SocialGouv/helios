import { ReactElement } from "react";

import { EntiteJuridiqueRessourcesHumaines } from "../../../../backend/métier/entities/entité-juridique/EntiteJuridiqueRessourcesHumaines";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { couleurDuFond, couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { StringFormater } from "../../commun/StringFormater";

type IndicateurAvecNombre = Exclude<
  keyof EntiteJuridiqueRessourcesHumaines, "annee"
>;

export class EntiteJuridiqueRessourcesHumainesViewModel {

  constructor(private readonly ressourcesHumainesEntiteJuridique: EntiteJuridiqueRessourcesHumaines[], private readonly wording: Wording) {
  }

  public get lesDonneesRessourcesHumainesNeSontPasRenseigner(): boolean {
    return !this.nombreDEtpPmEstIlRenseigne
      && !this.nombreDEtpPnmEstIlRenseigne
      && !this.depensesInterimPmSontEllesRenseignees
      && !this.joursAbsenteismePmSontIlsRenseignes;
  }

  public get lesDonnéesRHPasRenseignees(): (string | ReactElement)[] {
    const nonRenseignees = [];
    if (!this.nombreDEtpPmEstIlRenseigne) nonRenseignees.push(this.wording.NOMBRE_D_ETP_PM);
    if (!this.nombreDEtpPnmEstIlRenseigne) nonRenseignees.push(this.wording.NOMBRE_D_ETP_PNM);
    if (!this.depensesInterimPmSontEllesRenseignees) nonRenseignees.push(this.wording.DEPENSES_INTERIM_PM);
    if (!this.joursAbsenteismePmSontIlsRenseignes) nonRenseignees.push(this.wording.JOURS_ABSENTEISME_PM);
    return nonRenseignees;
  }

  public get nombreDEtpPmEstIlRenseigne(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.nombreEtpPm.valeur !== null);
  }
  public get nombreDEtpPnmEstIlRenseigne(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.nombreEtpPnm.valeur !== null);
  }
  public get depensesInterimPmSontEllesRenseignees(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.depensesInterimPm.valeur !== null);
  }
  public get joursAbsenteismePmSontIlsRenseignes(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePm.valeur !== null);
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
    const anneesManquantes: number[] = annéesManquantes(annees, 5);
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
