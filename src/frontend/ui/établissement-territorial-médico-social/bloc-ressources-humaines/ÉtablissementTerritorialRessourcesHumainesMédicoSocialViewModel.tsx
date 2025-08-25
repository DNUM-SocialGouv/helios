import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import {
  couleurDuFond,
  couleurDuFondHistogrammePrimaire,
  couleurDuFondHistogrammeSecondaire,
  couleurErreur,
  couleurIdentifiant,
  couleurSecondPlanHistogrammeDeDépassement,
  noir,
  CouleurHistogramme,
} from "../../commun/Graphique/couleursGraphique";
import { couleurDesArcsDuDonut, Donut } from "../../commun/Graphique/Donut";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { HistogrammeVertical } from "../../commun/Graphique/HistogrammeVertical";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../../commun/StringFormater";
import { Transcription } from "../../commun/Transcription/Transcription";

type IndicateurAvecUnNombre = Exclude<
  keyof ÉtablissementTerritorialMédicoSocialRessourcesHumaines,
  "année" | "tauxDePrestationsExternes" | "tauxDEtpVacants" | "tauxDeRotationDuPersonnel" | "tauxDAbsentéisme"
>;

type IndicateurAvecUnTaux = Exclude<
  keyof ÉtablissementTerritorialMédicoSocialRessourcesHumaines,
  "année" | "nombreDEtpRéalisés" | "nombreDeCddDeRemplacement" | "tauxDAbsentéisme"
>;

export class ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel {
  private readonly SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE: number = 50;
  private readonly SEUIL_DU_TAUX_D_ETP_VACANTS_ATYPIQUE: number = 20;
  private readonly SEUIL_DU_TAUX_DE_PRESTATIONS_EXTERNES: number = 20;
  private readonly IDENTIFIANT_DE_LA_LÉGENDE_DES_TAUX_D_ABSENTÉISMES = "légende-graphique-médico-social-taux-d-absentéisme";
  private readonly BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_PAR_MOTIF = 20;
  private readonly BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_HORS_FORMATION = 40;

  private readonly couleursDuDoughnutDesTauxDAbsentéismes: Record<string, { couleurDeLArc: string; couleurDuLibellé: string }>;
  private readonly annéesAvecDesTauxDAbsentéismes: number[];

  constructor(private readonly ressourcesHumainesMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[], private wording: Wording) {
    this.couleursDuDoughnutDesTauxDAbsentéismes = {
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[0], couleurDuLibellé: couleurIdentifiant },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[1], couleurDuLibellé: couleurIdentifiant },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[2], couleurDuLibellé: noir },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[3], couleurDuLibellé: noir },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[4], couleurDuLibellé: noir },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[5], couleurDuLibellé: noir },
    };
    this.annéesAvecDesTauxDAbsentéismes = this.anneesAvecTauxAbsenteisme();
  }

  public get annéeInitiale() {
    return this.annéesAvecDesTauxDAbsentéismes[0];
  }

  public get lesDonnéesRessourcesHumainesNeSontPasRenseignées(): boolean {
    return (
      !this.leNombreDEtpRéaliséEstIlRenseigné &&
      !this.leNombreDeCddDeRemplacementEstIlRenseigné &&
      !this.leTauxDePrestationsExternesEstIlRenseigné &&
      !this.leTauxDEtpVacantsEstIlRenseigné &&
      !this.leTauxDeRotationDuPersonnelEstIlRenseigné &&
      !this.lesTauxDAbsentéismeEstIlRenseigné
    );
  }

  public get lesDonnéesRHPasRenseignees(): (string | ReactElement)[] {
    const nonRenseignees = [];
    if (!this.leNombreDEtpRéaliséEstIlRenseigné) nonRenseignees.push(this.wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION);
    if (!this.leNombreDeCddDeRemplacementEstIlRenseigné) nonRenseignees.push(this.wording.NOMBRE_DE_CDD_DE_REMPLACEMENT);
    if (!this.leTauxDePrestationsExternesEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES);
    if (!this.leTauxDEtpVacantsEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_D_ETP_VACANTS_AU_31_12);
    if (!this.leTauxDeRotationDuPersonnelEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_DE_ROTATION_DU_PERSONNEL);
    if (!this.lesTauxDAbsentéismeEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_D_ABSENTÉISME);

    return nonRenseignees;
  }

  public get leNombreDEtpRéaliséEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDEtpRéalisés.valeur !== null);
  }

  public get leNombreDEtpRéaliséEstIlAutorisé(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDEtpRéalisés.valeur !== '');
  }

  public get nombreDEtpRéalisé(): ReactElement {
    const [valeurs, années] = this.extraisLesValeursNombréesDesIndicateurs("nombreDEtpRéalisés");
    const couleursDeLHistogramme = années.map((année) => ({
      premierPlan: estCeLAnnéePassée(année) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond,
    }));
    const listeAnnéesManquantes = annéesManquantes(années, 5);

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursDeLHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION}
        libellés={années}
        libellésDeValeursManquantes={listeAnnéesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuNombreDEtpRéalisé(): string {
    return StringFormater.formatDate(this.ressourcesHumainesMédicoSocial[0].nombreDEtpRéalisés.dateMiseÀJourSource);
  }

  public get leNombreDeCddDeRemplacementEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDeCddDeRemplacement.valeur !== null);
  }

  public get leNombreDeCddDeRemplacementEstIlAutorisé(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDeCddDeRemplacement.valeur !== '');
  }

  public get nombreDeCddDeRemplacement(): ReactElement {
    const [valeurs, années] = this.extraisLesValeursNombréesDesIndicateurs("nombreDeCddDeRemplacement");
    const couleursDeLHistogramme = années.map((année) => ({
      premierPlan: estCeLAnnéePassée(année) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond,
    }));
    const listeAnnéesManquantes = annéesManquantes(années, 5);
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursDeLHistogramme}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION}
        libellés={années}
        libellésDeValeursManquantes={listeAnnéesManquantes}
        nombreDeLibelléTotal={5}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuNombreDeCddDeRemplacement(): string {
    return StringFormater.formatDate(this.ressourcesHumainesMédicoSocial[0].nombreDeCddDeRemplacement.dateMiseÀJourSource);
  }

  public get leTauxDePrestationsExternesEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDePrestationsExternes.valeur !== null);
  }

  public get leTauxDePrestationsExternesEstIlAutorisé(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDePrestationsExternes.valeur !== '');
  }

  private construisLaCouleurDeLaBarreDeLHistogramme(valeur: number, année: string | number, estEnErreur: (valeur: number) => boolean) {
    if (!estEnErreur(valeur)) {
      return {
        premierPlan: couleurErreur,
        secondPlan: couleurSecondPlanHistogrammeDeDépassement,
      };
    }

    if (estCeLAnnéePassée(année)) {
      return {
        premierPlan: couleurDuFondHistogrammePrimaire,
        secondPlan: couleurDuFond,
      };
    }

    return {
      premierPlan: couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond,
    };
  }

  public get tauxDePrestationsExternes(): JSX.Element {
    const [valeurs, années] = this.extraisLesTauxDesIndicateurs("tauxDePrestationsExternes");

    const libellésDesValeurs = this.construisLesCouleursLibellésDeTaux(valeurs);
    const taillePoliceTick = années.map((année) => (estCeLAnnéePassée(année) ? "bold" : "normal"));

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={libellésDesValeurs}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) =>
          this.construisLaCouleurDeLaBarreDeLHistogramme(valeur, années[index], this.leTauxDePrestationsExternesEstIlDansLesBornesAcceptables.bind(this))
        )}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES}
        libellés={années}
        taillePoliceTicks={taillePoliceTick}
        valeurs={valeurs}
      />
    );
  }

  private leTauxDePrestationsExternesEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_DE_PRESTATIONS_EXTERNES;
  }

  public get dateDeMiseÀJourDuTauxDePrestationsExternes(): string {
    return StringFormater.formatDate(this.ressourcesHumainesMédicoSocial[0].tauxDePrestationsExternes.dateMiseÀJourSource);
  }

  public get leTauxDEtpVacantsEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDEtpVacants.valeur !== null);
  }

  public get leTauxDEtpVacantsEstIlAutorisé(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDEtpVacants.valeur !== '');
  }

  public get tauxDEtpVacants(): JSX.Element {
    const [valeurs, années] = this.extraisLesTauxDesIndicateurs("tauxDEtpVacants");
    const libellésDesValeurs = this.construisLesCouleursLibellésDeTaux(valeurs);
    const taillePoliceTick = années.map((année) => (estCeLAnnéePassée(année) ? "bold" : "normal"));

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={libellésDesValeurs}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) =>
          this.construisLaCouleurDeLaBarreDeLHistogramme(valeur, années[index], this.leTauxDEtpVacantsEstIlDansLesBornesAcceptables.bind(this))
        )}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_D_ETP_VACANTS_AU_31_12}
        libellés={années}
        taillePoliceTicks={taillePoliceTick}
        valeurs={valeurs}
      />
    );
  }

  private leTauxDEtpVacantsEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_D_ETP_VACANTS_ATYPIQUE;
  }

  public get dateDeMiseÀJourDuTauxDEtpVacants(): string {
    return StringFormater.formatDate(this.ressourcesHumainesMédicoSocial[0].tauxDEtpVacants.dateMiseÀJourSource);
  }

  public get leTauxDeRotationDuPersonnelEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDeRotationDuPersonnel.valeur !== null);
  }

  public get leTauxDeRotationDuPersonnelEstIlAutorisé(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDeRotationDuPersonnel.valeur !== '');
  }


  public get tauxDeRotationDuPersonnel(): JSX.Element {
    const [valeurs, années] = this.extraisLesTauxDesIndicateurs("tauxDeRotationDuPersonnel");
    const libellésDesValeurs = this.construisLesCouleursLibellésDeTaux(valeurs);
    const libellésDesTicks = années.map((année) => (estCeLAnnéePassée(année) ? "bold" : "normal"));

    return (
      <HistogrammeVertical
        annéesTotales={5}
        couleurDesLibelles={libellésDesValeurs}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) =>
          this.construisLaCouleurDeLaBarreDeLHistogramme(valeur, années[index], this.leTauxDeRotationDuPersonnelEstIlDansLesBornesAcceptables.bind(this))
        )}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_DE_ROTATION_DU_PERSONNEL}
        libellés={années}
        taillePoliceTicks={libellésDesTicks}
        valeurs={valeurs}
      />
    );
  }

  private leTauxDeRotationDuPersonnelEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE;
  }

  public get dateDeMiseÀJourDuTauxDeRotationDuPersonnel(): string {
    return StringFormater.formatDate(this.ressourcesHumainesMédicoSocial[0].tauxDeRotationDuPersonnel.dateMiseÀJourSource);
  }

  public get lesTauxDAbsentéismeEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDAbsentéisme.horsFormation !== null);
  }

  public get lesTauxDAbsentéismeEstIlAutorisé(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDAbsentéisme.dateMiseÀJourSource !== '');
  }

  public tauxDAbsentéisme(annéeEnCours: number): ReactElement {
    if (!annéeEnCours) return this.pasDeTauxDAbsentéisme;

    const tauxDAbsentéismesDeLAnnéeEnCours = this.trouveLesTauxDAbsentéismesDeLAnnée(annéeEnCours);
    const [valeursAvecMotif] = this.construisLesTauxDAbsentéisme(tauxDAbsentéismesDeLAnnéeEnCours);
    const couleursDuDoughnut: CouleurHistogramme[] = [];
    const couleursDesLibelles: string[] = [];
    let tauxDAbsentéismeCalcule = 0;
    valeursAvecMotif.forEach((tauxDAbsentéisme) => {
      if (!this.leTauxDAbsentéismeDUnMotifEstIlDansLesBornesAcceptables(tauxDAbsentéisme.valeur)) {
        couleursDuDoughnut.push({
          premierPlan: couleurErreur,
          secondPlan: couleurSecondPlanHistogrammeDeDépassement,
        });
        couleursDesLibelles.push(couleurDuFond);
      } else {
        couleursDuDoughnut.push(this.associeLaCouleurDeLArcAuMotifDuTauxDAbsentéisme(tauxDAbsentéisme.motif));
        couleursDesLibelles.push(this.associeLaCouleurDuLibelléAuMotifDAbsentéisme(tauxDAbsentéisme.motif));
      }
      tauxDAbsentéismeCalcule += tauxDAbsentéisme.valeur;
    });
    const valeursDesTauxDAbsentéismes = valeursAvecMotif.map((tauxDAbsentéisme) => tauxDAbsentéisme.valeur);
    const valeursDesTauxDAbsentéismesFormatted = valeursDesTauxDAbsentéismes.map((taux) => StringFormater.transformInRate(taux));
    const motifsDesTauxDAbsentéismes = valeursAvecMotif.map((tauxDAbsentéisme) => tauxDAbsentéisme.motif);
    const pourcentageDuTauxDAbsentéismeHorsFormation = StringFormater.formatCenterText(StringFormater.transformInRate(tauxDAbsentéismeCalcule));

    const listeAnnéesManquantes = annéesManquantes(this.annéesAvecDesTauxDAbsentéismes, 5);

    return (
      <>
        {this.wording.TAUX_D_ABSENTÉISME_HORS_FORMATION(
          pourcentageDuTauxDAbsentéismeHorsFormation,
          !this.leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(tauxDAbsentéismeCalcule),
          this.leTauxDAbsentéismeHorsFormationEstIlNul(tauxDAbsentéismeCalcule)
        )}
        {!this.leTauxDAbsentéismeHorsFormationEstIlNul(tauxDAbsentéismeCalcule) && (
          <Donut
            couleursDuDoughnut={couleursDuDoughnut}
            couleursLibelle={couleursDesLibelles}
            idDeLaLégende={this.IDENTIFIANT_DE_LA_LÉGENDE_DES_TAUX_D_ABSENTÉISMES}
            libellés={motifsDesTauxDAbsentéismes}
            valeurs={valeursDesTauxDAbsentéismes}
          />
        )}
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription
          disabled={listeAnnéesManquantes.length === 5}
          entêteLibellé={this.wording.MOTIF_DU_TAUX_D_ABSENTÉISME}
          identifiants={[this.wording.TAUX]}
          libellés={motifsDesTauxDAbsentéismes}
          valeurs={[StringFormater.addPercentToValues(valeursDesTauxDAbsentéismesFormatted)]}
        />
      </>
    );
  }

  private get pasDeTauxDAbsentéisme(): ReactElement {
    const listeAnnéesManquantes = annéesManquantes(this.annéesAvecDesTauxDAbsentéismes);

    return (
      <>
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription disabled={true} entêteLibellé={this.wording.ANNÉE} identifiants={[this.wording.TAUX_D_ABSENTÉISME]} libellés={[]} valeurs={[]} />
      </>
    );
  }

  public get dateDeMiseÀJourDesTauxDAbsentéismes(): string {
    return StringFormater.formatDate(this.ressourcesHumainesMédicoSocial[0].tauxDAbsentéisme.dateMiseÀJourSource);
  }

  private construisLesTauxDAbsentéisme(
    tauxDAbsentéismesDeLAnnéeEnCours: ÉtablissementTerritorialMédicoSocialRessourcesHumaines["tauxDAbsentéisme"]
  ): [{ valeur: number; motif: string }[], number] {
    const valeursAvecMotif = [];

    const tauxDAbsentéismeHorsFormation = tauxDAbsentéismesDeLAnnéeEnCours.horsFormation ?? 0;

    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieCourteDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE,
        valeur: tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieCourteDurée as number,
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieMoyenneDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE,
        valeur: tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieMoyenneDurée as number,
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieLongueDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE,
        valeur: tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieLongueDurée as number,
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourAccidentMaladieProfessionnelle)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE,
        valeur: tauxDAbsentéismesDeLAnnéeEnCours.pourAccidentMaladieProfessionnelle as number,
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaternitéPaternité)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ,
        valeur: tauxDAbsentéismesDeLAnnéeEnCours.pourMaternitéPaternité as number,
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourCongésSpéciaux)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX,
        valeur: tauxDAbsentéismesDeLAnnéeEnCours.pourCongésSpéciaux as number,
      });
    }

    return [valeursAvecMotif, tauxDAbsentéismeHorsFormation];
  }

  private trouveLesTauxDAbsentéismesDeLAnnée(annéeEnCours: number) {
    return this.ressourcesHumainesMédicoSocial.find((ressourcesHumaines) => ressourcesHumaines.année === annéeEnCours)
      ?.tauxDAbsentéisme as ÉtablissementTerritorialMédicoSocialRessourcesHumaines["tauxDAbsentéisme"];
  }

  private leTauxDAbsentéismeDUnMotifEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur < this.BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_PAR_MOTIF;
  }

  private leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur < this.BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_HORS_FORMATION;
  }

  private leTauxDAbsentéismeHorsFormationEstIlNul(valeur: number) {
    return valeur === 0;
  }

  private leTauxEstIlRenseigné(tauxDAbsentéismes: number | null) {
    return tauxDAbsentéismes !== null && tauxDAbsentéismes !== 0;
  }

  private associeLaCouleurDeLArcAuMotifDuTauxDAbsentéisme(motif: string) {
    return {
      premierPlan: this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDeLArc,
      secondPlan: this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDeLArc,
    };
  }

  private associeLaCouleurDuLibelléAuMotifDAbsentéisme(motif: string): string {
    return this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDuLibellé;
  }

  private extraisLesValeursNombréesDesIndicateurs(indicateur: IndicateurAvecUnNombre): [number[], string[]] {
    const valeurs: number[] = [];
    const années: string[] = [];
    this.ressourcesHumainesMédicoSocial.forEach((ressourceHumaineMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines) => {
      const valeur = ressourceHumaineMédicoSocial[indicateur].valeur;
      if (valeur !== null && valeur !== "") {
        années.push(ressourceHumaineMédicoSocial.année.toString());
        valeurs.push(valeur);
      }
    });

    return [valeurs, années];
  }

  private extraisLesTauxDesIndicateurs(indicateur: IndicateurAvecUnTaux): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.ressourcesHumainesMédicoSocial.forEach((ressourceHumaineMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines) => {
      const valeur = ressourceHumaineMédicoSocial[indicateur].valeur;
      if (valeur !== null && valeur !== "") {
        années.push(ressourceHumaineMédicoSocial.année);
        valeurs.push(StringFormater.transformInRate(valeur));
      }
    });

    return [valeurs, années];
  }

  public anneesAvecTauxAbsenteisme(): number[] {
    return this.ressourcesHumainesMédicoSocial
      .filter(filtreParPrésenceDesTauxDAbsentéisme)
      .map((ressourcesHumaines) => ressourcesHumaines.année)
      .reverse();

    function filtreParPrésenceDesTauxDAbsentéisme(ressourcesHumaines: ÉtablissementTerritorialMédicoSocialRessourcesHumaines): boolean {
      if (
        ressourcesHumaines.tauxDAbsentéisme.horsFormation !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaladieCourteDurée !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaladieMoyenneDurée !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaladieLongueDurée !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaternitéPaternité !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourAccidentMaladieProfessionnelle !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourCongésSpéciaux !== null
      ) {
        return true;
      }
      return false;
    }
  }

  private construisLesCouleursLibellésDeTaux(valeursDesTaux: number[]): string[] {
    return valeursDesTaux.map((valeur) => (valeur > 20 ? couleurDuFond : valeur < 0 ? couleurDuFond : couleurIdentifiant));
  }

  public get lesDonnéesRHPasAutorisés(): (string | ReactElement)[] {
    const nonAutorisés = [];
    if (!this.leNombreDEtpRéaliséEstIlAutorisé) nonAutorisés.push(this.wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION);
    if (!this.leNombreDeCddDeRemplacementEstIlAutorisé) nonAutorisés.push(this.wording.NOMBRE_DE_CDD_DE_REMPLACEMENT);
    if (!this.leTauxDePrestationsExternesEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES);
    if (!this.leTauxDEtpVacantsEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_D_ETP_VACANTS_AU_31_12);
    if (!this.leTauxDeRotationDuPersonnelEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_DE_ROTATION_DU_PERSONNEL);
    if (!this.lesTauxDAbsentéismeEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_D_ABSENTÉISME);

    return nonAutorisés;
  }
}
