import { ÉtablissementTerritorialMédicoSocial } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { Wording } from '../../../configuration/wording/Wording'
import { CouleurHistogramme, GraphiqueViewModel } from '../../commun/Graphique/GraphiqueViewModel'
import { IndicateurTabulaire } from '../../commun/IndicateurTabulaire/IndicateurTabulaire'
import { StringFormater } from '../../commun/StringFormater'

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly seuilMinimalDuTauxDeVétustéConstruction = 0
  private readonly seuilMaximalDuTauxDeVétustéConstruction = 80
  private readonly seuilDuContrasteDuLibellé = 10

  constructor(
    private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocial['budgetEtFinances'],
    wording: Wording
  ) {
    super(wording)
  }

  public get desDonnéesBudgetEtFinancesSontRenseignées(): boolean {
    return this.budgetEtFinancesMédicoSocial.length > 0
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
      this.budgetEtFinancesMédicoSocial.map((montantDesContributionsAuxFraisDeSiègeParAnnée) => montantDesContributionsAuxFraisDeSiègeParAnnée.année),
      3
    )

    return (
      <IndicateurTabulaire
        annéesManquantes={annéesManquantes}
        valeursParAnnée={montantDesContributionsAuxFraisDeSiègeParAnnée}
      />
    )
  }

  public get dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].contributionAuxFraisDeSiège?.dateMiseÀJourSource as string)
  }

  public get leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.contributionAuxFraisDeSiège.valeur)
  }

  public get tauxDeVétustéConstruction(): JSX.Element {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux()
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
    const libellésDesValeurs = valeurs.map((valeur) => ({ couleur:  valeur > this.seuilDuContrasteDuLibellé ? this.couleurDuFond : this.couleurIdentifiant }))
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
      this.budgetEtFinancesMédicoSocial.map((résultatNetComptableParAnnée) => résultatNetComptableParAnnée.année),
      3
    )

    return (
      <IndicateurTabulaire
        annéesManquantes={annéesManquantes}
        valeursParAnnée={résultatNetComptableParAnnée}
      />
    )
  }

  public get dateMiseÀJourRésultatNetComptable(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].résultatNetComptable?.dateMiseÀJourSource as string)
  }

  public get leRésultatNetComptableEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.résultatNetComptable.valeur)
  }

  private construisLesAnnéesEtSesTaux(): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) => {
      if (budgetEtFinancesMédicoSocial.tauxDeVétustéConstruction.valeur !== null) {
        années.push(budgetEtFinancesMédicoSocial.année)
        valeurs.push(this.transformeEnTaux(budgetEtFinancesMédicoSocial.tauxDeVétustéConstruction.valeur))
      }
    })

    return [valeurs, années]
  }

  private transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }
}
