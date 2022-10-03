import { DataSource, LoggerOptions } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../database/models/ActivitéMédicoSocialModel'
import { ActivitéSanitaireModel } from '../../../../database/models/ActivitéSanitaireModel'
import { AutorisationMédicoSocialModel } from '../../../../database/models/AutorisationMédicoSocialModel'
import { AutorisationSanitaireModel } from '../../../../database/models/AutorisationSanitaireModel'
import { AutreActivitéSanitaireModel } from '../../../../database/models/AutreActivitéSanitaireModel'
import { BudgetEtFinancesMédicoSocialModel } from '../../../../database/models/BudgetEtFinancesMédicoSocialModel'
import { CapacitéAutorisationSanitaireModel } from '../../../../database/models/CapacitéAutorisationSanitaireModel'
import { CpomModel } from '../../../../database/models/CpomModel'
import { DateMiseÀJourFichierSourceModel } from '../../../../database/models/DateMiseÀJourFichierSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ReconnaissanceContractuelleSanitaireModel } from '../../../../database/models/ReconnaissanceContractuelleSanitaireModel'
import { ÉquipementMatérielLourdSanitaireModel } from '../../../../database/models/ÉquipementMatérielLourdSanitaireModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    entities: [
      ActivitéSanitaireModel,
      ActivitéMédicoSocialModel,
      AutorisationMédicoSocialModel,
      AutorisationSanitaireModel,
      AutreActivitéSanitaireModel,
      BudgetEtFinancesMédicoSocialModel,
      CapacitéAutorisationSanitaireModel,
      CpomModel,
      DateMiseÀJourFichierSourceModel,
      EntitéJuridiqueModel,
      ÉquipementMatérielLourdSanitaireModel,
      ÉtablissementTerritorialIdentitéModel,
      ReconnaissanceContractuelleSanitaireModel,
    ],
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    migrations: ['./database/migrations/*.{js, ts}'],
    type: 'postgres',
    url: environmentVariables.DATABASE_URL,
  })
  return dataSource.initialize()
}
