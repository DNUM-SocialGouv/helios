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
      && !this.joursAbsenteismePmSontIlsRenseignes
      && !this.joursAbsenteismePnmSontIlsRenseignes;
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
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.NOMBRE_D_ETP_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }


  public get nombreEtpPnm(): ReactElement {
    const [valeurs, annees] = this.extraireLesValeursNombreesDesIndicateurs("nombreEtpPnm");
    const couleursHistogramme = annees.map((annee) => ({
      premierPlan: estCeLAnnéePassée(annee) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond
    }));
    const anneesManquantes: number[] = annéesManquantes(annees, 5);
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.NOMBRE_D_ETP_PNM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get depensesInterimPm(): ReactElement {
    const [valeurs, annees] = this.extraireLesValeursNombreesDesIndicateurs("depensesInterimPm");
    const couleursHistogramme = annees.map((annee) => ({
      premierPlan: estCeLAnnéePassée(annee) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond
    }));
    const anneesManquantes: number[] = annéesManquantes(annees, 5);
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        formateur={StringFormater.formatInEuro}
        identifiant={this.wording.DEPENSES_INTERIM_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get joursAbsenteismePm(): ReactElement {
    const [valeurs, annees] = this.extraireLesValeursNombreesDesIndicateurs("joursAbsenteismePm");
    const couleursHistogramme = annees.map((annee) => ({
      premierPlan: estCeLAnnéePassée(annee) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond
    }));
    const anneesManquantes: number[] = annéesManquantes(annees, 5);
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.JOURS_ABSENTEISME_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get joursAbsenteismePnm(): ReactElement {
    const [valeurs, annees] = this.extraireLesValeursNombreesDesIndicateurs("joursAbsenteismePnm");
    const couleursHistogramme = annees.map((annee) => ({
      premierPlan: estCeLAnnéePassée(annee) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond
    }));
    const anneesManquantes: number[] = annéesManquantes(annees, 5);
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.JOURS_ABSENTEISME_PNM}
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

  public get lesDonnéesRHPasRenseignees(): (string | ReactElement)[] {
    const nonRenseignees = [];
    if (!this.nombreDEtpPmEstIlRenseigne) nonRenseignees.push(this.wording.NOMBRE_D_ETP_PM);
    if (!this.nombreDEtpPnmEstIlRenseigne) nonRenseignees.push(this.wording.NOMBRE_D_ETP_PNM);
    if (!this.depensesInterimPmSontEllesRenseignees) nonRenseignees.push(this.wording.DEPENSES_INTERIM_PM);
    if (!this.joursAbsenteismePmSontIlsRenseignes) nonRenseignees.push(this.wording.JOURS_ABSENTEISME_PM);
    if (!this.joursAbsenteismePnmSontIlsRenseignes) nonRenseignees.push(this.wording.JOURS_ABSENTEISME_PNM);
    return nonRenseignees;
  }

  public get lesDonnéesRHPasAutorisees(): (string | ReactElement)[] {
    const nonAutorisees = [];
    if (!this.nombreDEtpPmEstIlAutorise) nonAutorisees.push(this.wording.NOMBRE_D_ETP_PM);
    if (!this.nombreDEtpPnmEstIlAutorise) nonAutorisees.push(this.wording.NOMBRE_D_ETP_PNM);
    if (!this.depensesInterimPmSontEllesAutorisees) nonAutorisees.push(this.wording.DEPENSES_INTERIM_PM);
    if (!this.joursAbsenteismePmSontIlsAutorises) nonAutorisees.push(this.wording.JOURS_ABSENTEISME_PM);
    if (!this.joursAbsenteismePnmSontIlsAutorises) nonAutorisees.push(this.wording.JOURS_ABSENTEISME_PNM);
    return nonAutorisees;
  }

  public get nombreDEtpPmEstIlRenseigne(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.nombreEtpPm.valeur !== null && ressourceHumaine.nombreEtpPm.valeur !== 0);
  }

  public get nombreDEtpPmEstIlAutorise(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.nombreEtpPm.valeur !== '');
  }

  public get nombreDEtpPnmEstIlRenseigne(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.nombreEtpPnm.valeur !== null && ressourceHumaine.nombreEtpPnm.valeur !== 0);
  }

  public get nombreDEtpPnmEstIlAutorise(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.nombreEtpPnm.valeur !== '');
  }

  public get depensesInterimPmSontEllesRenseignees(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.depensesInterimPm.valeur !== null && ressourceHumaine.depensesInterimPm.valeur !== 0);
  }

  public get depensesInterimPmSontEllesAutorisees(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.depensesInterimPm.valeur !== '');
  }

  public get joursAbsenteismePmSontIlsRenseignes(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePm.valeur !== null && ressourceHumaine.joursAbsenteismePm.valeur !== 0);
  }

  public get joursAbsenteismePmSontIlsAutorises(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePm.valeur !== '');
  }

  public get joursAbsenteismePnmSontIlsRenseignes(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePnm.valeur !== null && ressourceHumaine.joursAbsenteismePnm.valeur !== 0);
  }

  public get joursAbsenteismePnmSontIlsAutorises(): boolean {
    return this.ressourcesHumainesEntiteJuridique.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePnm.valeur !== '');
  }

  public get dateMiseAJourNombreEtpPm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEntiteJuridique[0].nombreEtpPm.dateMiseAJourSource);
  }

  public get dateMiseAJourNombreEtpPnm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEntiteJuridique[0].nombreEtpPnm.dateMiseAJourSource);
  }

  public get dateMiseAJourDepensesInterimPm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEntiteJuridique[0].depensesInterimPm.dateMiseAJourSource);
  }

  public get dateMiseAJourJoursAbsenteismePm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEntiteJuridique[0].joursAbsenteismePm.dateMiseAJourSource);
  }

  public get dateMiseAJourJoursAbsenteismePnm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEntiteJuridique[0].joursAbsenteismePnm.dateMiseAJourSource);
  }
}
