import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Wording } from '../../configuration/wording/Wording'
import { MiseEnExergue } from '../commun/MiseEnExergue/MiseEnExergue'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel {
  constructor(
    private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocial['budgetEtFinances'],
    private readonly wording: Wording
  ) {}

  public get montantDeLaContributionAuxFraisDeSiège(): JSX.Element {
    const montantDesContributionsAuxFraisDeSiègeParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (montantParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège) {
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
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.contributionAuxFraisDeSiège)
  }

  private annéesManquantes(années: number[], annéesTotales: number): number[] {
    const annéeEnCours = new Date().getFullYear()

    return Array(annéesTotales)
      .fill(annéeEnCours)
      .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
      .reverse()
      .filter((année) => !années.includes(année))
  }
}
