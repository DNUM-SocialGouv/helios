import { DataSource, LoggerOptions } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { DateMiseÀJourFichierSourceModel } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { RechercheModel } from '../../../../../database/models/RechercheModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    entities: [
      RechercheModel,
      ActivitéSanitaireModel,
      ActivitéMédicoSocialModel,
      DateMiseÀJourSourceModel,
      DateMiseÀJourFichierSourceModel,
      EntitéJuridiqueModel,
      ÉtablissementTerritorialIdentitéModel,
    ],
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    migrations: ['./../database/migrations/*.{js, ts}'],
    type: 'postgres',
    url: environmentVariables.DATABASE_URL,
  })
  return dataSource.initialize()
}
