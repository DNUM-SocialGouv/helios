import { ChartData, ChartOptions, ScriptableScaleContext } from 'chart.js'
import { Context } from 'chartjs-plugin-datalabels'
import { ChangeEvent } from 'react'
import { Bar } from 'react-chartjs-2'

import { CadreBudgétaire } from '../../../../../database/models/BudgetEtFinancesMédicoSocialModel'
import { ÉtablissementTerritorialMédicoSocial } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { Wording } from '../../../configuration/wording/Wording'
import { CouleurHistogramme, GraphiqueViewModel, LibelléDeDonnéeGraphe, LibelléDeTickGraphe } from '../../commun/Graphique/GraphiqueViewModel'
import { IndicateurTabulaire, IndicateurTabulaireProps } from '../../commun/IndicateurTabulaire/IndicateurTabulaire'
import { MiseEnExergue } from '../../commun/MiseEnExergue/MiseEnExergue'
import { Select } from '../../commun/Select/Select'
import { StringFormater } from '../../commun/StringFormater'
import { TableIndicateur } from '../../commun/TableIndicateur/TableIndicateur'

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly seuilMinimalDuTauxDeVétustéConstruction = 0
  private readonly seuilMaximalDuTauxDeVétustéConstruction = 80
  private readonly seuilDuContrasteDuLibellé = 10
  private readonly seuilMinimalDuTauxDeCaf = -21
  private readonly seuilMaximalDuTauxDeCaf = 21
  private readonly seuilDuTauxDeCaf = 2
  private readonly couleurDuSeuil = '#18753C'
  private readonly nombreDAnnéesParIndicateur = 3

  constructor(
    private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[],
    wording: Wording
  ) {
    super(wording)
  }

  public get annéeInitiale() {
    return this.budgetEtFinancesMédicoSocial[this.budgetEtFinancesMédicoSocial.length - 1]?.année
  }

  public intituléDuCompteDeRésultat(annéeEnCours: number) {
    return this.budgetEtFinanceEnCours(annéeEnCours).cadreBudgétaire === CadreBudgétaire.ERRD ?
      this.wording.COMPTE_DE_RÉSULTAT_ERRD :
      this.wording.COMPTE_DE_RÉSULTAT_CA
  }

  public listeDéroulanteDesAnnéesDuCompteDeRésultat(setAnnéeEnCours: Function): JSX.Element {
    const annéesRangéesAntéChronologiquement = this.annéesRangéesParAntéChronologie()

    if (annéesRangéesAntéChronologiquement.length > 0) {
      return (
        <Select
          label={this.wording.ANNÉE}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setAnnéeEnCours(Number(event.target.value))
          }}
          options={annéesRangéesAntéChronologiquement}
        />
      )
    }

    return <></>
  }

  public get leCompteDeRésultatEstIlRenseigné(): boolean {
    return this.lesAnnéesManquantesDuCompteDeRésultat().length < this.nombreDAnnéesParIndicateur
  }

  public compteDeRésultat(annéeEnCours: number): JSX.Element {
    const budgetEtFinance = this.budgetEtFinanceEnCours(annéeEnCours)
    const entêtePremièreColonne = this.wording.TITRE_BUDGÉTAIRE
    const chartColors = [
      this.couleurDuFondHistogrammePrimaire,
      this.couleurDuFondHistogrammeSecondaire,
      this.couleurDuFondHistogrammeSecondaire,
      this.couleurDuFondHistogrammeSecondaire,
    ]
    const dépensesOuCharges = []
    const recettesOuProduits = []
    const libellés = []
    const entêtesDesAutresColonnes = []
    const annéesManquantes = this.lesAnnéesManquantesDuCompteDeRésultat()

    let ratioHistogramme = 2
    if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
      const totalDesCharges = budgetEtFinance.chargesEtProduits.charges as number
      const totalDesProduits = budgetEtFinance.chargesEtProduits.produits as number
      dépensesOuCharges.push(totalDesCharges)
      recettesOuProduits.push(totalDesProduits)
      libellés.push(this.wording.TOTAL)
      entêtesDesAutresColonnes.push(this.wording.CHARGES, this.wording.PRODUITS)
      ratioHistogramme = 5
    } else {
      const dépensesGroupeI = budgetEtFinance.recettesEtDépenses.dépensesGroupe1 as number
      const dépensesGroupeII = budgetEtFinance.recettesEtDépenses.dépensesGroupe2 as number
      const dépensesGroupeIII = budgetEtFinance.recettesEtDépenses.dépensesGroupe3 as number
      const recettesGroupeI = budgetEtFinance.recettesEtDépenses.recettesGroupe1 as number
      const recettesGroupeII = budgetEtFinance.recettesEtDépenses.recettesGroupe2 as number
      const recettesGroupeIII = budgetEtFinance.recettesEtDépenses.recettesGroupe3 as number
      const totalDesDépenses = dépensesGroupeI + dépensesGroupeII + dépensesGroupeIII
      const totalDesRecettes = recettesGroupeI + recettesGroupeII + recettesGroupeIII
      dépensesOuCharges.push(totalDesDépenses, dépensesGroupeI, dépensesGroupeII, dépensesGroupeIII)
      recettesOuProduits.push(totalDesRecettes, recettesGroupeI, recettesGroupeII, recettesGroupeIII)
      libellés.push(this.wording.TOTAL, this.wording.GROUPE_I, this.wording.GROUPE_II, this.wording.GROUPE_III)
      entêtesDesAutresColonnes.push(this.wording.DÉPENSES, this.wording.RECETTES)
    }

    return this.afficheUnCarrousel(
      chartColors,
      dépensesOuCharges,
      recettesOuProduits,
      libellés,
      ratioHistogramme,
      entêtePremièreColonne,
      entêtesDesAutresColonnes,
      annéesManquantes
    )
  }

  public get desDonnéesBudgetEtFinancesSontNonRenseignées(): boolean {
    return !this.leCompteDeRésultatEstIlRenseigné
      && !this.leRésultatNetComptableEstIlRenseigné
      && !this.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné
      && !this.leTauxDeCafEstIlRenseigné
      && !this.leTauxDeVétustéEstIlRenseigné
  }

  public get montantDeLaContributionAuxFraisDeSiège(): JSX.Element {
    const montantDesContributionsAuxFraisDeSiègeParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (montantParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur) {
          montantParAnnée.push({
            année: budgetEtFinancesMédicoSocial.année,
            valeur: StringFormater.formateLeMontantEnEuros(budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur),
          })
        }
        return montantParAnnée
      },
      []
    )

    const annéesManquantes = this.annéesManquantes(
      this.budgetEtFinancesMédicoSocial.map((montantDesContributionsAuxFraisDeSiègeParAnnée) => montantDesContributionsAuxFraisDeSiègeParAnnée.année)
    )

    return <IndicateurTabulaire
      annéesManquantes={annéesManquantes}
      valeursParAnnée={montantDesContributionsAuxFraisDeSiègeParAnnée}
    />
  }

  public get dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].contributionAuxFraisDeSiège?.dateMiseÀJourSource as string)
  }

  public get leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.contributionAuxFraisDeSiège.valeur)
  }

  public get leTauxDeVétustéEstIlRenseigné(): boolean {
    const [années] = this.construisLesAnnéesEtSesTaux('tauxDeVétustéConstruction')

    return années.length > 0
  }

  public get tauxDeVétustéConstruction(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxDeVétustéConstruction')
    const construisLaCouleurDeLaBarre = (valeur: number, année: number | string): CouleurHistogramme => {
      let premierPlan = this.couleurDuFondHistogrammeSecondaire
      let secondPlan = this.couleurDuFond

      if (this.estCeLAnnéePassée(année)) {
        premierPlan = this.couleurDuFondHistogrammePrimaire
        secondPlan = this.couleurDuFond
      }

      if (this.leTauxDeVétustéConstructionEstIlAberrant(valeur)) {
        premierPlan = this.couleurDuFondHistogrammeDeDépassement
        secondPlan = this.couleurSecondPlanHistogrammeDeDépassement
      }
      return { premierPlan, secondPlan }
    }
    const libellésDesValeurs = valeurs.map((valeur) => ({ couleur: valeur > this.seuilDuContrasteDuLibellé ? this.couleurDuFond : this.couleurIdentifiant }))
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: this.estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }))

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarre),
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION
    )
  }

  public get dateMiseÀJourTauxDeVétustéConstruction(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].tauxDeVétustéConstruction?.dateMiseÀJourSource as string)
  }

  private leTauxDeVétustéConstructionEstIlAberrant = (valeur: number): boolean => {
    return valeur > this.seuilMaximalDuTauxDeVétustéConstruction || valeur < this.seuilMinimalDuTauxDeVétustéConstruction
  }

  public get résultatNetComptable(): JSX.Element {
    const résultatNetComptableParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (résultatNetComptableParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.résultatNetComptable.valeur) {
          résultatNetComptableParAnnée.push({
            année: budgetEtFinancesMédicoSocial.année,
            valeur: StringFormater.formateLeMontantEnEuros(budgetEtFinancesMédicoSocial.résultatNetComptable.valeur),
          })
        }
        return résultatNetComptableParAnnée
      },
      []
    )

    const annéesManquantes = this.annéesManquantes(
      this.budgetEtFinancesMédicoSocial.map((résultatNetComptableParAnnée) => résultatNetComptableParAnnée.année)
    )

    return <IndicateurTabulaire
      annéesManquantes={annéesManquantes}
      valeursParAnnée={résultatNetComptableParAnnée}
    />
  }

  public get dateMiseÀJourRésultatNetComptable(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].résultatNetComptable?.dateMiseÀJourSource as string)
  }

  public get leRésultatNetComptableEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.résultatNetComptable.valeur)
  }

  public get leTauxDeCafEstIlRenseigné(): boolean {
    const [années] = this.construisLesAnnéesEtSesTaux('tauxDeCafNette')

    return années.length > 0
  }

  public get tauxDeCaf(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux('tauxDeCafNette')
    const construisLaCouleurDeLaBarre = (valeur: number, année: number | string): CouleurHistogramme => {
      let premierPlan = this.couleurDuFondHistogrammeSecondaire
      let secondPlan = this.couleurDuFond

      if (this.estCeLAnnéePassée(année)) {
        premierPlan = this.couleurDuFondHistogrammePrimaire
        secondPlan = this.couleurDuFond
      }

      if (this.leTauxDeCafEstIlAberrant(valeur)) {
        premierPlan = this.couleurDuFondHistogrammeDeDépassement
        secondPlan = this.couleurSecondPlanHistogrammeDeDépassement
      }
      return { premierPlan, secondPlan }
    }
    const libellésDesValeurs = valeurs.map(() => ({ couleur: this.couleurDuFond }))
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: this.estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }))

    return this.afficheLHistogrammeDuTauxDeCaf(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarre),
      libellésDesValeurs,
      libellésDesTicks
    )
  }

  public get dateMiseÀJourTauxDeCaf(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].tauxDeCafNette?.dateMiseÀJourSource as string)
  }

  public get fondDeRoulementNetGlobal(): JSX.Element {
    const annéesSousCadreAutreQueErrd: number[] = []
    const fondsDeRoulementNetGlobalParAnnée: IndicateurTabulaireProps['valeursParAnnée'] = this.budgetEtFinancesMédicoSocial.reduce(
      (fondsParAnnée: IndicateurTabulaireProps['valeursParAnnée'], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.cadreBudgétaire === CadreBudgétaire.ERRD) {
          if (budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur) {
            fondsParAnnée.push({
              année: budgetEtFinancesMédicoSocial.année,
              miseEnForme: budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur < 0 ? 'fr-text--bold fr-text-default--error' : '',
              valeur: StringFormater.formateLeMontantEnEuros(budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur),
            })
          }
        } else {
          annéesSousCadreAutreQueErrd.push(budgetEtFinancesMédicoSocial.année)
        }
        return fondsParAnnée
      },
      []
    )
    const annéesAvecDonnées = fondsDeRoulementNetGlobalParAnnée.map((fondsDeRoulementNetGlobalParAnnée) => fondsDeRoulementNetGlobalParAnnée.année)

    const annéesAvecMiseEnExergue = this.annéesManquantes(
      annéesAvecDonnées.concat(annéesSousCadreAutreQueErrd),
      this.nombreDAnnéesParIndicateur
    )

    return <IndicateurTabulaire
      annéesManquantes={annéesAvecMiseEnExergue}
      valeursParAnnée={fondsDeRoulementNetGlobalParAnnée}
    />
  }

  public get dateMiseÀJourFondDeRoulementNetGlobal(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].fondsDeRoulement?.dateMiseÀJourSource as string)
  }

  public get leFondsDeRoulementEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.fondsDeRoulement.valeur)
  }

  private afficheLHistogrammeDuTauxDeCaf(
    valeurs: number[],
    années: number[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    libellésDesTicks: LibelléDeTickGraphe[]
  ) {
    const minDeLHistogramme = Math.min(...valeurs) < this.seuilMinimalDuTauxDeCaf ? this.seuilMinimalDuTauxDeCaf : undefined
    const maxDeLHistogramme = Math.max(...valeurs) > this.seuilMaximalDuTauxDeCaf ? this.seuilMaximalDuTauxDeCaf : undefined
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          data: valeurs,
          datalabels: { labels: { title: { color: libellésDesValeurs.map((libelléDeValeur) => libelléDeValeur.couleur) } } },
          maxBarThickness: 60,
          type: 'bar',
          xAxisID: 'x',
        },
        {
          borderColor: this.couleurDuSeuil,
          data: [
            { x: -1, y: this.seuilDuTauxDeCaf },
            { x: 2, y: this.seuilDuTauxDeCaf },
          ],
          type: 'line',
          xAxisID: 'xLine',
        },
        {
          borderColor: this.couleurDelAbscisse,
          data: [
            { x: -1, y: 0 },
            { x: 2, y: 0 },
          ],
          type: 'line',
          xAxisID: 'xLine2',
        },
      ],
      labels: années,
    }
    const annéesManquantes = this.annéesManquantes(années)
    const valeursFrançaises = this.transformeEnFrançais(valeurs) as string[]

    return (
      <>
        {
          annéesManquantes.length < this.nombreDAnnéesParIndicateur &&
          <Bar
            // @ts-ignore
            data={data}
            options={this.construisLesOptionsDeLHistogrammeDuTauxDeCaf(couleursDeLHistogramme, libellésDesTicks, maxDeLHistogramme, minDeLHistogramme)}
          />
        }
        {annéesManquantes.length > 0 && (
          <MiseEnExergue>
            {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
          </MiseEnExergue>
        )}
        <TableIndicateur
          disabled={annéesManquantes.length === this.nombreDAnnéesParIndicateur}
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[this.wording.TAUX_DE_CAF]}
          libellés={années}
          valeurs={[this.ajouteLePourcentage(valeursFrançaises)]}
        />
      </>
    )
  }

  private leTauxDeCafEstIlAberrant = (valeur: number): boolean => {
    return valeur < this.seuilMinimalDuTauxDeCaf || valeur > this.seuilMaximalDuTauxDeCaf
  }

  private construisLesOptionsDeLHistogrammeDuTauxDeCaf(
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesTicks: LibelléDeTickGraphe[],
    maxDeLHistogramme: number | undefined,
    minDeLHistogramme: number | undefined
  ): ChartOptions<'bar'> {
    return {
      animation: false,
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'start',
          clamp: true,
          font: {
            family: 'Marianne',
            size: 16,
            weight: 700,
          },
          formatter: (value: number, _context: Context): string => value.toLocaleString('fr') + ' %',
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
          type: 'linear',
        },
        xLine2: {
          display: false,
          max: 1,
          min: 0,
          type: 'linear',
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
              return tickValue === this.seuilDuTauxDeCaf ? `${tickValue} (seuil)` : tickValue
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
    }
  }

  private construisLesAnnéesEtSesTaux(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialBudgetEtFinances, 'année' | 'cadreBudgétaire' | 'chargesEtProduits' | 'recettesEtDépenses'>
  ): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) => {
      const valeur = budgetEtFinancesMédicoSocial[indicateur].valeur
      if (valeur !== null) {
        années.push(budgetEtFinancesMédicoSocial.année)
        valeurs.push(this.transformeEnTaux(valeur))
      }
    })

    return [valeurs, années]
  }

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }

  private budgetEtFinanceEnCours(annéeEnCours: number): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
    return this.budgetEtFinancesMédicoSocial
      .find((budgetEtFinance) => budgetEtFinance.année === annéeEnCours) as ÉtablissementTerritorialMédicoSocialBudgetEtFinances
  }

  private lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    const années: number[] = []

    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinance) => {
      if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
        if (
          budgetEtFinance.chargesEtProduits.charges !== null &&
          budgetEtFinance.chargesEtProduits.produits !== null
        ) {
          années.push(budgetEtFinance.année)
        }
      } else {
        if (
          budgetEtFinance.recettesEtDépenses.dépensesGroupe1 !== null &&
          budgetEtFinance.recettesEtDépenses.dépensesGroupe2 !== null &&
          budgetEtFinance.recettesEtDépenses.dépensesGroupe3 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe1 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe2 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe3 !== null
        ) {
          années.push(budgetEtFinance.année)
        }
      }
    })

    return années
  }

  private lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return this.annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat())
  }

  private annéesRangéesParAntéChronologie(): number[] {
    return this.budgetEtFinancesMédicoSocial
      .filter(filtreParCadreBudgétaireEtRecettesEtDépenses)
      .map((budgetEtFinance) => budgetEtFinance.année)
      .reverse()

    function filtreParCadreBudgétaireEtRecettesEtDépenses(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances): boolean {
      if (budgetEtFinance.cadreBudgétaire !== CadreBudgétaire.CA_PA && (
        budgetEtFinance.recettesEtDépenses.dépensesGroupe1 !== null ||
          budgetEtFinance.recettesEtDépenses.dépensesGroupe2 !== null ||
          budgetEtFinance.recettesEtDépenses.dépensesGroupe3 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe1 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe2 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe3 !== null
      )) {
        return true
      } else if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA && (
        budgetEtFinance.chargesEtProduits.charges !== null ||
          budgetEtFinance.chargesEtProduits.produits !== null
      )) {
        return true
      }
      return false
    }
  }
}
