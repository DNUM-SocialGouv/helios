import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { CouleurHistogramme, GraphiqueViewModel, LibelléDeDonnéeGraphe } from "../../commun/Graphique/GraphiqueViewModel";
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

export class ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE: number = 50;
  private readonly SEUIL_DU_TAUX_D_ETP_VACANTS_ATYPIQUE: number = 20;
  private readonly SEUIL_DU_TAUX_DE_PRESTATIONS_EXTERNES: number = 20;
  private readonly IDENTIFIANT_DE_LA_LÉGENDE_DES_TAUX_D_ABSENTÉISMES = "légende-graphique-médico-social-taux-d-absentéisme";
  private readonly BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_PAR_MOTIF = 20;
  private readonly BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_HORS_FORMATION = 40;

  private readonly couleursDuDoughnutDesTauxDAbsentéismes: Record<string, { couleurDeLArc: string; couleurDuLibellé: string }>;
  private readonly annéesAvecDesTauxDAbsentéismes: number[];

  constructor(private readonly ressourcesHumainesMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[], wording: Wording) {
    super(wording);
    this.couleursDuDoughnutDesTauxDAbsentéismes = {
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[0], couleurDuLibellé: "#000" },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[1], couleurDuLibellé: "#000" },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[2], couleurDuLibellé: "#FFF" },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[3], couleurDuLibellé: "#FFF" },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[4], couleurDuLibellé: "#FFF" },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[5], couleurDuLibellé: "#FFF" },
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

  private get leNombreDEtpRéaliséEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDEtpRéalisés.valeur !== null);
  }

  public get nombreDEtpRéalisé(): ReactElement {
    const [valeurs, années] = this.extraisLesValeursNombréesDesIndicateurs("nombreDEtpRéalisés");
    const couleursDeLHistogramme = années.map((année) => ({
      premierPlan: estCeLAnnéePassée(année) ? this.couleurDuFondHistogrammePrimaire : this.couleurDuFondHistogrammeSecondaire,
      secondPlan: this.couleurDuFond,
    }));
    const libellésDesValeurs = Array(valeurs.length).fill({ couleur: this.couleurIdentifiant });
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));
    const listeAnnéesManquantes = annéesManquantes(années);

    return this.afficheUnHistogrammeHorizontal(
      valeurs,
      années,
      couleursDeLHistogramme,
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION,
      listeAnnéesManquantes
    );
  }

  public get dateDeMiseÀJourDuNombreDEtpRéalisé(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].nombreDEtpRéalisés.dateMiseÀJourSource);
  }

  private get leNombreDeCddDeRemplacementEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDeCddDeRemplacement.valeur !== null);
  }

  public get nombreDeCddDeRemplacement(): ReactElement {
    const [valeurs, années] = this.extraisLesValeursNombréesDesIndicateurs("nombreDeCddDeRemplacement");
    const couleursDeLHistogramme = années.map((année) => ({
      premierPlan: estCeLAnnéePassée(année) ? this.couleurDuFondHistogrammePrimaire : this.couleurDuFondHistogrammeSecondaire,
      secondPlan: this.couleurDuFond,
    }));
    const libellésDesValeurs = Array(valeurs.length).fill({ couleur: this.couleurIdentifiant });
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));
    const listeAnnéesManquantes = annéesManquantes(années);

    return this.afficheUnHistogrammeHorizontal(
      valeurs,
      années,
      couleursDeLHistogramme,
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION,
      listeAnnéesManquantes
    );
  }

  public get dateDeMiseÀJourDuNombreDeCddDeRemplacement(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].nombreDeCddDeRemplacement.dateMiseÀJourSource);
  }

  private get leTauxDePrestationsExternesEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDePrestationsExternes.valeur !== null);
  }

  public get tauxDePrestationsExternes(): JSX.Element {
    const [valeurs, années] = this.extraisLesTauxDesIndicateurs("tauxDePrestationsExternes");
    const construisLaCouleurDeLaBarreDeLHistogramme = (valeur: number, année: string | number) => {
      if (!this.leTauxDePrestationsExternesEstIlDansLesBornesAcceptables(valeur)) {
        return {
          premierPlan: this.couleurDuFondHistogrammeDeDépassement,
          secondPlan: this.couleurSecondPlanHistogrammeDeDépassement,
        };
      }

      if (estCeLAnnéePassée(année)) {
        return {
          premierPlan: this.couleurDuFondHistogrammePrimaire,
          secondPlan: this.couleurDuFond,
        };
      }

      return {
        premierPlan: this.couleurDuFondHistogrammeSecondaire,
        secondPlan: this.couleurDuFond,
      };
    };
    const libellésDesValeurs = this.construisLesLibellésDesValeursDeTaux(valeurs);
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarreDeLHistogramme),
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES
    );
  }

  private leTauxDePrestationsExternesEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_DE_PRESTATIONS_EXTERNES;
  }

  public get dateDeMiseÀJourDuTauxDePrestationsExternes(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].tauxDePrestationsExternes.dateMiseÀJourSource);
  }

  private get leTauxDEtpVacantsEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDEtpVacants.valeur !== null);
  }

  public get tauxDEtpVacants(): JSX.Element {
    const [valeurs, années] = this.extraisLesTauxDesIndicateurs("tauxDEtpVacants");
    const construisLaCouleurDeLaBarreDeLHistogramme = (valeur: number, année: string | number) => {
      if (!this.leTauxDEtpVacantsEstIlDansLesBornesAcceptables(valeur)) {
        return {
          premierPlan: this.couleurDuFondHistogrammeDeDépassement,
          secondPlan: this.couleurSecondPlanHistogrammeDeDépassement,
        };
      }

      if (estCeLAnnéePassée(année)) {
        return {
          premierPlan: this.couleurDuFondHistogrammePrimaire,
          secondPlan: this.couleurDuFond,
        };
      }

      return {
        premierPlan: this.couleurDuFondHistogrammeSecondaire,
        secondPlan: this.couleurDuFond,
      };
    };
    const libellésDesValeurs = this.construisLesLibellésDesValeursDeTaux(valeurs);
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarreDeLHistogramme),
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.TAUX_D_ETP_VACANTS_AU_31_12
    );
  }

  private leTauxDEtpVacantsEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_D_ETP_VACANTS_ATYPIQUE;
  }

  public get dateDeMiseÀJourDuTauxDEtpVacants(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].tauxDEtpVacants.dateMiseÀJourSource);
  }

  private get leTauxDeRotationDuPersonnelEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDeRotationDuPersonnel.valeur !== null);
  }

  public get tauxDeRotationDuPersonnel(): JSX.Element {
    const [valeurs, années] = this.extraisLesTauxDesIndicateurs("tauxDeRotationDuPersonnel");
    const construisLaCouleurDeLaBarreDeLHistogramme = (valeur: number, année: string | number) => {
      if (!this.leTauxDeRotationDuPersonnelEstIlDansLesBornesAcceptables(valeur)) {
        return {
          premierPlan: this.couleurDuFondHistogrammeDeDépassement,
          secondPlan: this.couleurSecondPlanHistogrammeDeDépassement,
        };
      }

      if (estCeLAnnéePassée(année)) {
        return {
          premierPlan: this.couleurDuFondHistogrammePrimaire,
          secondPlan: this.couleurDuFond,
        };
      }

      return {
        premierPlan: this.couleurDuFondHistogrammeSecondaire,
        secondPlan: this.couleurDuFond,
      };
    };
    const libellésDesValeurs = this.construisLesLibellésDesValeursDeTaux(valeurs);
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarreDeLHistogramme),
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.TAUX_DE_ROTATION_DU_PERSONNEL
    );
  }

  private leTauxDeRotationDuPersonnelEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE;
  }

  public get dateDeMiseÀJourDuTauxDeRotationDuPersonnel(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].tauxDeRotationDuPersonnel.dateMiseÀJourSource);
  }

  private get lesTauxDAbsentéismeEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDAbsentéisme.horsFormation !== null);
  }

  public tauxDAbsentéisme(annéeEnCours: number): ReactElement {
    if (!annéeEnCours) return this.pasDeTauxDAbsentéisme;

    const tauxDAbsentéismesDeLAnnéeEnCours = this.trouveLesTauxDAbsentéismesDeLAnnée(annéeEnCours);
    const [valeursAvecMotif, tauxDAbsentéismeHorsFormation] = this.construisLesTauxDAbsentéisme(tauxDAbsentéismesDeLAnnéeEnCours);
    const couleursDuDoughnut: CouleurHistogramme[] = [];
    const libellésDesValeurs: LibelléDeDonnéeGraphe[] = [];
    valeursAvecMotif.forEach((tauxDAbsentéisme) => {
      if (!this.leTauxDAbsentéismeDUnMotifEstIlDansLesBornesAcceptables(tauxDAbsentéisme.valeur)) {
        couleursDuDoughnut.push({
          premierPlan: this.couleurDuFondHistogrammeDeDépassement,
          secondPlan: this.couleurSecondPlanHistogrammeDeDépassement,
        });
        libellésDesValeurs.push({ couleur: this.couleurDuFond });
      } else {
        couleursDuDoughnut.push(this.associeLaCouleurDeLArcAuMotifDuTauxDAbsentéisme(tauxDAbsentéisme.motif));
        libellésDesValeurs.push(this.associeLaCouleurDuLibelléAuMotifDAbsentéisme(tauxDAbsentéisme.motif));
      }
    });
    const valeursDesTauxDAbsentéismes = valeursAvecMotif.map((tauxDAbsentéisme) => tauxDAbsentéisme.valeur);
    const motifsDesTauxDAbsentéismes = valeursAvecMotif.map((tauxDAbsentéisme) => tauxDAbsentéisme.motif);
    const pourcentageDuTauxDAbsentéismeHorsFormation = StringFormater.ajouteLePourcentage([tauxDAbsentéismeHorsFormation])[0];
    const texteCentral = this.leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(tauxDAbsentéismeHorsFormation)
      ? pourcentageDuTauxDAbsentéismeHorsFormation
      : `! ${pourcentageDuTauxDAbsentéismeHorsFormation}`;

    const listeAnnéesManquantes = annéesManquantes(this.annéesAvecDesTauxDAbsentéismes);

    return (
      <>
        {this.wording.TAUX_D_ABSENTÉISME_HORS_FORMATION(
          pourcentageDuTauxDAbsentéismeHorsFormation,
          !this.leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(tauxDAbsentéismeHorsFormation),
          this.leTauxDAbsentéismeHorsFormationEstIlNul(tauxDAbsentéismeHorsFormation)
        )}
        {!this.leTauxDAbsentéismeHorsFormationEstIlNul(tauxDAbsentéismeHorsFormation) &&
          this.afficheUnDiagrammeEnDonut(
            valeursDesTauxDAbsentéismes,
            motifsDesTauxDAbsentéismes,
            couleursDuDoughnut,
            libellésDesValeurs,
            texteCentral,
            tauxDAbsentéismeHorsFormation,
            this.IDENTIFIANT_DE_LA_LÉGENDE_DES_TAUX_D_ABSENTÉISMES
          )}
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription
          disabled={listeAnnéesManquantes.length === 3}
          entêteLibellé={this.wording.MOTIF_DU_TAUX_D_ABSENTÉISME}
          identifiants={[this.wording.TAUX]}
          libellés={motifsDesTauxDAbsentéismes}
          valeurs={[StringFormater.ajouteLePourcentage(valeursDesTauxDAbsentéismes)]}
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
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].tauxDAbsentéisme.dateMiseÀJourSource);
  }

  private construisLesTauxDAbsentéisme(
    tauxDAbsentéismesDeLAnnéeEnCours: ÉtablissementTerritorialMédicoSocialRessourcesHumaines["tauxDAbsentéisme"]
  ): [{ valeur: number; motif: string }[], number] {
    const valeursAvecMotif = [];

    const tauxDAbsentéismeHorsFormation = StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.horsFormation || 0);

    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieCourteDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieCourteDurée as number),
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieMoyenneDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieMoyenneDurée as number),
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieLongueDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieLongueDurée as number),
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourAccidentMaladieProfessionnelle)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourAccidentMaladieProfessionnelle as number),
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaternitéPaternité)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaternitéPaternité as number),
      });
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourCongésSpéciaux)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourCongésSpéciaux as number),
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

  private associeLaCouleurDuLibelléAuMotifDAbsentéisme(motif: string) {
    return { couleur: this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDuLibellé };
  }

  private extraisLesValeursNombréesDesIndicateurs(indicateur: IndicateurAvecUnNombre): [number[], string[]] {
    const valeurs: number[] = [];
    const années: string[] = [];
    this.ressourcesHumainesMédicoSocial.forEach((ressourceHumaineMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines) => {
      const valeur = ressourceHumaineMédicoSocial[indicateur].valeur;
      if (valeur !== null) {
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
      if (valeur !== null) {
        années.push(ressourceHumaineMédicoSocial.année);
        valeurs.push(StringFormater.transformeEnTaux(valeur));
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

  private construisLesLibellésDesValeursDeTaux(valeursDesTaux: number[]) {
    return valeursDesTaux.map((valeur) => ({
      couleur: valeur > this.SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX ? this.couleurDuFond : valeur < 0 ? this.couleurDuFond : this.couleurIdentifiant,
    }));
  }
}
