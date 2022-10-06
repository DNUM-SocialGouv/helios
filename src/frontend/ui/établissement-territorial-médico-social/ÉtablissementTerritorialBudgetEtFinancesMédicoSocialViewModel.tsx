import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { Wording } from '../../configuration/wording/Wording'
import { GraphiqueViewModel } from '../commun/Graphique/GraphiqueViewModel'
import { MiseEnExergue } from '../commun/MiseEnExergue/MiseEnExergue'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly seuilMaximalDuTauxDeVétustéConstruction = 80

  constructor(
    private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocial['budgetEtFinances'],
    wording: Wording
  ) {
    super(wording, 0)
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
      <>
        <div className="fr-table">
          <table>
            <thead>
              <tr>
                <th>
                  {this.wording.ANNÉE}
                </th>
                <th>
                  {this.wording.MONTANT}
                </th>
              </tr>
            </thead>
            <tbody>
              {montantDesContributionsAuxFraisDeSiègeParAnnée.map((contributionAuxFraisDeSiège) =>
                <tr key={contributionAuxFraisDeSiège.année}>
                  <td>
                    {contributionAuxFraisDeSiège.année}
                  </td>
                  <td>
                    {contributionAuxFraisDeSiège.valeur}
                  </td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
        <MiseEnExergue>
          {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
        </MiseEnExergue>
      </>
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

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.leTauxDeVétustéConstructionEstIlAcceptable,
      this.wording.ANNÉE,
      this.wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION,
      this.seuilMaximalDuTauxDeVétustéConstruction
    )
  }

  public get dateMiseÀJourTauxDeVétustéConstruction(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].tauxDeVétustéConstruction?.dateMiseÀJourSource as string)
  }

  private leTauxDeVétustéConstructionEstIlAcceptable(valeur: number): boolean {
    return valeur >= 0 && valeur <= 80
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
