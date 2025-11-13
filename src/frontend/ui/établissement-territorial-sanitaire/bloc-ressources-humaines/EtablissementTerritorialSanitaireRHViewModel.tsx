import { ReactElement } from "react";

import { EtablissementTerritorialSanitaireRH } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/EtablissementTerritorialSanitaireRH";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { couleurDuFond, couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { StringFormater } from "../../commun/StringFormater";

type IndicateurAvecNombre = Exclude<
  keyof EtablissementTerritorialSanitaireRH, "annee"
>;


export class EtablissementTerritorialSanitaireRHViewModel {
  constructor(private readonly ressourcesHumainesEtablissementSanitaire: EtablissementTerritorialSanitaireRH[], private readonly wording: Wording) {
  }

  public get lesDonneesRessourcesHumainesNeSontPasRenseigner(): boolean {
    return !this.nombreDEtpPmEstIlRenseigne
      && !this.nombreDEtpPnmEstIlRenseigne
      && !this.depensesInterimPmSontEllesRenseignees
      && !this.joursAbsenteismePmSontIlsRenseignes
      && !this.joursAbsenteismePnmSontIlsRenseignes;
  }
  public nombreEtpPmHistogramme(etabFiness: string, etabTitle: string): ReactElement {
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
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.NOMBRE_D_ETP_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={this.wording.NOMBRE_D_ETP_PM}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }


  public nombreEtpPnmHistogramme(etabFiness: string, etabTitle: string): ReactElement {
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
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.NOMBRE_D_ETP_PNM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={this.wording.NOMBRE_D_ETP_PNM}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public depensesInterimPmHistogramme(etabFiness: string, etabTitle: string): ReactElement {
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
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.formatInEuro}
        identifiant={this.wording.DEPENSES_INTERIM_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={this.wording.DEPENSES_INTERIM_PM}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public joursAbsenteismePmHistogramme(etabFiness: string, etabTitle: string): ReactElement {
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
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.JOURS_ABSENTEISME_PM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={this.wording.JOURS_ABSENTEISME_PM}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public joursAbsenteismePnmHistogramme(etabFiness: string, etabTitle: string): ReactElement {
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
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={this.wording.JOURS_ABSENTEISME_PNM}
        libellés={annees}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={this.wording.JOURS_ABSENTEISME_PNM}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  private extraireLesValeursNombreesDesIndicateurs(indicateur: IndicateurAvecNombre): [number[], string[]] {
    const valeurs: number[] = [];
    const annees: string[] = [];
    this.ressourcesHumainesEtablissementSanitaire.forEach((donneeRessourceHumaineEtablissementSanitaire: EtablissementTerritorialSanitaireRH) => {
      const valeur = donneeRessourceHumaineEtablissementSanitaire[indicateur].valeur;
      if (valeur !== null && valeur !== "") {
        annees.push(donneeRessourceHumaineEtablissementSanitaire.annee.toString());
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
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.nombreEtpPm.valeur !== null && ressourceHumaine.nombreEtpPm.valeur !== 0);
  }

  public get nombreDEtpPmEstIlAutorise(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.nombreEtpPm.valeur !== '');
  }

  public get nombreDEtpPnmEstIlRenseigne(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.nombreEtpPnm.valeur !== null && ressourceHumaine.nombreEtpPnm.valeur !== 0);
  }

  public get nombreDEtpPnmEstIlAutorise(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.nombreEtpPnm.valeur !== '');
  }

  public get depensesInterimPmSontEllesRenseignees(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.depensesInterimPm.valeur !== null && ressourceHumaine.depensesInterimPm.valeur !== 0);
  }

  public get depensesInterimPmSontEllesAutorisees(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.depensesInterimPm.valeur !== '');
  }

  public get joursAbsenteismePmSontIlsRenseignes(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePm.valeur !== null && ressourceHumaine.joursAbsenteismePm.valeur !== 0);
  }

  public get joursAbsenteismePmSontIlsAutorises(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePm.valeur !== '');
  }

  public get joursAbsenteismePnmSontIlsRenseignes(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePnm.valeur !== null && ressourceHumaine.joursAbsenteismePnm.valeur !== 0);
  }

  public get joursAbsenteismePnmSontIlsAutorises(): boolean {
    return this.ressourcesHumainesEtablissementSanitaire.some((ressourceHumaine) => ressourceHumaine.joursAbsenteismePnm.valeur !== '');
  }

  public get dateMiseAJourNombreEtpPm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEtablissementSanitaire[0].nombreEtpPm.dateMiseAJourSource);
  }

  public get dateMiseAJourNombreEtpPnm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEtablissementSanitaire[0].nombreEtpPnm.dateMiseAJourSource);
  }

  public get dateMiseAJourDepensesInterimPm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEtablissementSanitaire[0].depensesInterimPm.dateMiseAJourSource);
  }

  public get dateMiseAJourJoursAbsenteismePm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEtablissementSanitaire[0].joursAbsenteismePm.dateMiseAJourSource);
  }

  public get dateMiseAJourJoursAbsenteismePnm(): string {
    return StringFormater.formatDate(this.ressourcesHumainesEtablissementSanitaire[0].joursAbsenteismePnm.dateMiseAJourSource);
  }
}
