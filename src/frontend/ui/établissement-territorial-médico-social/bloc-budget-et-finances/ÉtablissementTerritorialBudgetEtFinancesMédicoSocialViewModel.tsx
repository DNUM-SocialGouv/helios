import { ChartData, ChartOptions, ScriptableScaleContext } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import { CadreBudgétaire } from "../../../../backend/métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { CouleurHistogramme, GraphiqueViewModel, LibelléDeDonnéeGraphe, LibelléDeTickGraphe } from "../../commun/Graphique/GraphiqueViewModel";
import { HistogrammeVertical } from "../../commun/Graphique/HistogrammeVertical";
import { IndicateurTabulaire, IndicateurTabulaireProps } from "../../commun/IndicateurTabulaire/IndicateurTabulaire";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../../commun/StringFormater";
import { Transcription } from "../../commun/Transcription/Transcription";
import { CompteDeResultatViewModel } from "./compte-de-resultat/CompteDeResultatViewModel";

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly seuilMinimalDuTauxDeVétustéConstruction = 0;
  private readonly seuilMaximalDuTauxDeVétustéConstruction = 80;
  private readonly seuilDuContrasteDuLibellé = 10;
  private readonly seuilMinimalDuTauxDeCaf = -21;
  private readonly seuilMaximalDuTauxDeCaf = 21;
  private readonly seuilDuTauxDeCaf = 2;
  private readonly couleurDuSeuil = "#18753C";
  private readonly nombreDAnnéesParIndicateur = 3;
  public compteDeResultatViewModel: CompteDeResultatViewModel;

  constructor(private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[], wording: Wording) {
    super(wording);
    this.compteDeResultatViewModel = new CompteDeResultatViewModel(budgetEtFinancesMédicoSocial, wording);
  }

  public get lesDonnéesBudgetEtFinancesNeSontPasRenseignées(): boolean {
    return (
      !this.compteDeResultatViewModel.leCompteDeRésultatEstIlRenseigné &&
      !this.leRésultatNetComptableEstIlRenseigné &&
      !this.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné &&
      !this.leTauxDeCafEstIlRenseigné &&
      !this.leTauxDeVétustéEstIlRenseigné &&
      !this.leFondsDeRoulementEstIlRenseigné
    );
  }

  public get montantDeLaContributionAuxFraisDeSiège(): ReactElement {
    const montantDesContributionsAuxFraisDeSiègeParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (montantParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur) {
          montantParAnnée.push({
            année: budgetEtFinancesMédicoSocial.année,
            valeur: StringFormater.formatInEuro(budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur),
          });
        }
        return montantParAnnée;
      },
      []
    );

    const listeAnnéesManquantes = annéesManquantes(
      this.budgetEtFinancesMédicoSocial.map((montantDesContributionsAuxFraisDeSiègeParAnnée) => montantDesContributionsAuxFraisDeSiègeParAnnée.année)
    );

    return <IndicateurTabulaire annéesManquantes={listeAnnéesManquantes} valeursParAnnée={montantDesContributionsAuxFraisDeSiègeParAnnée} />;
  }

  public get dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].contributionAuxFraisDeSiège?.dateMiseÀJourSource as string);
  }

  public get leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.contributionAuxFraisDeSiège.valeur);
  }

  public get leTauxDeVétustéEstIlRenseigné(): boolean {
    const [années] = this.construisLesAnnéesEtSesTaux("tauxDeVétustéConstruction");

    return années.length > 0;
  }

  public get tauxDeVétustéConstruction(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxDeVétustéConstruction");
    const construisLaCouleurDeLaBarre = (valeur: number, année: number | string): CouleurHistogramme => {
      let premierPlan = this.couleurDuFondHistogrammeSecondaire;
      let secondPlan = this.couleurDuFond;

      if (estCeLAnnéePassée(année)) {
        premierPlan = this.couleurDuFondHistogrammePrimaire;
        secondPlan = this.couleurDuFond;
      }

      if (this.leTauxDeVétustéConstructionEstIlAberrant(valeur)) {
        premierPlan = this.couleurDuFondHistogrammeDeDépassement;
        secondPlan = this.couleurSecondPlanHistogrammeDeDépassement;
      }
      return { premierPlan, secondPlan };
    };
    const libellésDesValeurs = valeurs.map((valeur) => ({ couleur: valeur > this.seuilDuContrasteDuLibellé ? this.couleurDuFond : this.couleurIdentifiant }));
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));

    return (
      <HistogrammeVertical
        annéesTotales={3}
        couleursDeLHistogramme={this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarre)}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION}
        libellés={années}
        libellésDesTicks={libellésDesTicks}
        libellésDesValeurs={libellésDesValeurs}
        valeurs={valeurs}
      />
    );
  }

  public get dateMiseÀJourTauxDeVétustéConstruction(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].tauxDeVétustéConstruction?.dateMiseÀJourSource as string);
  }

  private leTauxDeVétustéConstructionEstIlAberrant = (valeur: number): boolean => {
    return valeur > this.seuilMaximalDuTauxDeVétustéConstruction || valeur < this.seuilMinimalDuTauxDeVétustéConstruction;
  };

  public get résultatNetComptable(): ReactElement {
    const résultatNetComptableParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (résultatNetComptableParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.résultatNetComptable.valeur) {
          résultatNetComptableParAnnée.push({
            année: budgetEtFinancesMédicoSocial.année,
            valeur: StringFormater.formatInEuro(budgetEtFinancesMédicoSocial.résultatNetComptable.valeur),
          });
        }
        return résultatNetComptableParAnnée;
      },
      []
    );

    const listeAnnéesManquantes = annéesManquantes(this.budgetEtFinancesMédicoSocial.map((résultatNetComptableParAnnée) => résultatNetComptableParAnnée.année));

    return <IndicateurTabulaire annéesManquantes={listeAnnéesManquantes} valeursParAnnée={résultatNetComptableParAnnée} />;
  }

  public get dateMiseÀJourRésultatNetComptable(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].résultatNetComptable?.dateMiseÀJourSource as string);
  }

  public get leRésultatNetComptableEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.résultatNetComptable.valeur);
  }

  public get leTauxDeCafEstIlRenseigné(): boolean {
    const [années] = this.construisLesAnnéesEtSesTaux("tauxDeCafNette");

    return années.length > 0;
  }

  public get tauxDeCaf(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxDeCafNette");
    const construisLaCouleurDeLaBarre = (valeur: number, année: number | string): CouleurHistogramme => {
      let premierPlan = this.couleurDuFondHistogrammeSecondaire;
      let secondPlan = this.couleurDuFond;

      if (estCeLAnnéePassée(année)) {
        premierPlan = this.couleurDuFondHistogrammePrimaire;
        secondPlan = this.couleurDuFond;
      }

      if (this.leTauxDeCafEstIlAberrant(valeur)) {
        premierPlan = this.couleurDuFondHistogrammeDeDépassement;
        secondPlan = this.couleurSecondPlanHistogrammeDeDépassement;
      }
      return { premierPlan, secondPlan };
    };
    const libellésDesValeurs = valeurs.map(() => ({ couleur: this.couleurDuFond }));
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }));

    return this.afficheLHistogrammeDuTauxDeCaf(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarre),
      libellésDesValeurs,
      libellésDesTicks
    );
  }

  public get dateMiseÀJourTauxDeCaf(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].tauxDeCafNette?.dateMiseÀJourSource as string);
  }

  public get fondDeRoulementNetGlobal(): ReactElement {
    const annéesSousCadreAutreQueErrd: number[] = [];
    const fondsDeRoulementNetGlobalParAnnée: IndicateurTabulaireProps["valeursParAnnée"] = this.budgetEtFinancesMédicoSocial.reduce(
      (fondsParAnnée: IndicateurTabulaireProps["valeursParAnnée"], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.cadreBudgétaire === CadreBudgétaire.ERRD) {
          if (budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur) {
            fondsParAnnée.push({
              année: budgetEtFinancesMédicoSocial.année,
              miseEnForme: budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur < 0 ? "fr-text--bold fr-text-default--error" : "",
              valeur: StringFormater.formatInEuro(budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur),
            });
          }
        } else {
          annéesSousCadreAutreQueErrd.push(budgetEtFinancesMédicoSocial.année);
        }
        return fondsParAnnée;
      },
      []
    );
    const annéesAvecDonnées = fondsDeRoulementNetGlobalParAnnée.map((fondsDeRoulementNetGlobalParAnnée) => fondsDeRoulementNetGlobalParAnnée.année);

    const annéesAvecMiseEnExergue = annéesManquantes(annéesAvecDonnées.concat(annéesSousCadreAutreQueErrd), this.nombreDAnnéesParIndicateur);

    return <IndicateurTabulaire annéesManquantes={annéesAvecMiseEnExergue} valeursParAnnée={fondsDeRoulementNetGlobalParAnnée} />;
  }

  public get dateMiseÀJourFondDeRoulementNetGlobal(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].fondsDeRoulement?.dateMiseÀJourSource as string);
  }

  public get leFondsDeRoulementEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.fondsDeRoulement.valeur);
  }

  private afficheLHistogrammeDuTauxDeCaf(
    valeurs: number[],
    années: number[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    libellésDesTicks: LibelléDeTickGraphe[]
  ) {
    const minDeLHistogramme = Math.min(...valeurs) < this.seuilMinimalDuTauxDeCaf ? this.seuilMinimalDuTauxDeCaf : undefined;
    const maxDeLHistogramme = Math.max(...valeurs) > this.seuilMaximalDuTauxDeCaf ? this.seuilMaximalDuTauxDeCaf : undefined;
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          data: valeurs,
          datalabels: { labels: { title: { color: libellésDesValeurs.map((libelléDeValeur) => libelléDeValeur.couleur) } } },
          maxBarThickness: 60,
          type: "bar",
          xAxisID: "x",
        },
        {
          borderColor: this.couleurDuSeuil,
          data: [
            { x: -1, y: this.seuilDuTauxDeCaf },
            { x: 2, y: this.seuilDuTauxDeCaf },
          ],
          type: "line",
          xAxisID: "xLine",
        },
        {
          borderColor: this.couleurDelAbscisse,
          data: [
            { x: -1, y: 0 },
            { x: 2, y: 0 },
          ],
          type: "line",
          xAxisID: "xLine2",
        },
      ],
      labels: années,
    };
    const listeAnnéesManquantes = annéesManquantes(années);

    return (
      <>
        {annéesManquantes.length < this.nombreDAnnéesParIndicateur && (
          <Bar
            // @ts-ignore
            data={data}
            options={this.construisLesOptionsDeLHistogrammeDuTauxDeCaf(couleursDeLHistogramme, libellésDesTicks, maxDeLHistogramme, minDeLHistogramme)}
          />
        )}
        {annéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription
          disabled={annéesManquantes.length === this.nombreDAnnéesParIndicateur}
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[this.wording.TAUX_DE_CAF]}
          libellés={années}
          valeurs={[StringFormater.addPercentToValues(valeurs)]}
        />
      </>
    );
  }

  private leTauxDeCafEstIlAberrant = (valeur: number): boolean => {
    return valeur < this.seuilMinimalDuTauxDeCaf || valeur > this.seuilMaximalDuTauxDeCaf;
  };

  private construisLesOptionsDeLHistogrammeDuTauxDeCaf(
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesTicks: LibelléDeTickGraphe[],
    maxDeLHistogramme: number | undefined,
    minDeLHistogramme: number | undefined
  ): ChartOptions<"bar"> {
    return {
      animation: false,
      plugins: {
        datalabels: {
          align: "end",
          anchor: "start",
          clamp: true,
          font: {
            family: "Marianne",
            size: 16,
            weight: 700,
          },
          formatter: (value: number, _context: Context): string => value.toLocaleString("fr") + " %",
          textStrokeColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          textStrokeWidth: 2,
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            color: this.couleurDelAbscisse,
            // @ts-ignore
            font: { weight: libellésDesTicks.map((libellé) => libellé.tailleDePolice) },
            padding: 10,
          },
        },
        xLine: {
          display: false,
          max: 1,
          min: 0,
          type: "linear",
        },
        xLine2: {
          display: false,
          max: 1,
          min: 0,
          type: "linear",
        },
        y: {
          grid: {
            color: this.couleurDuFondDeLaLigne,
            drawBorder: false,
            drawOnChartArea: true,
            drawTicks: false,
          },
          max: maxDeLHistogramme,
          min: minDeLHistogramme,
          ticks: {
            callback: (tickValue: string | number) => {
              return tickValue === this.seuilDuTauxDeCaf ? `${tickValue} (seuil)` : tickValue;
            },
            color: this.couleurDelAbscisse,
            // @ts-ignore
            font: {
              weight: (context: ScriptableScaleContext) =>
                context.tick && context.tick.value === this.seuilDuTauxDeCaf ? this.policeGrasse : this.policeNormale,
            },
            includeBounds: false,
            stepSize: 2,
          },
        },
      },
    };
  }

  private construisLesAnnéesEtSesTaux(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialBudgetEtFinances, "année" | "cadreBudgétaire" | "chargesEtProduits" | "recettesEtDépenses">
  ): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) => {
      const valeur = budgetEtFinancesMédicoSocial[indicateur].valeur;
      if (valeur !== null) {
        années.push(budgetEtFinancesMédicoSocial.année);
        valeurs.push(StringFormater.transformInRate(valeur));
      }
    });

    return [valeurs, années];
  }
}
