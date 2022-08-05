import { DataSource, LoggerOptions } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { DateMiseÀJourFichierSourceModel } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    entities: [
      ActivitéSanitaireModel,
      ActivitéMédicoSocialModel,
      DateMiseÀJourFichierSourceModel,
      EntitéJuridiqueModel,
      ÉtablissementTerritorialIdentitéModel,
    ],
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    migrations: ['./src/../database/migrations/*.{js, ts}'],
    type: 'postgres',
    url: environmentVariables.DATABASE_URL,
  })
  return dataSource.initialize()
}
