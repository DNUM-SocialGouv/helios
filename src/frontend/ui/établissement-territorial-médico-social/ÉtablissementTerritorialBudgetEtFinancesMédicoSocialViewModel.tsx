import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Wording } from '../../configuration/wording/Wording'

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel {
  constructor(
    private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocial['budgetEtFinances'],
    private readonlywording: Wording
  ) {}
}
