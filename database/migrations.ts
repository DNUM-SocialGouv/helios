import { dotEnvConfig } from '../src/data-crawler/infrastructure/gateways/dot-env/dotEnvConfig'
import { NodeEnvironmentVariables } from '../src/data-crawler/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from '../src/data-crawler/infrastructure/gateways/logger/ConsoleLogger'
import { typeOrmOrm } from '../src/data-crawler/infrastructure/gateways/orm/typeOrmOrm';

(async () => {
  try {
    dotEnvConfig()
    const logger = new ConsoleLogger()
    const environmentVariables = new NodeEnvironmentVariables(logger)
    const dataSource = await typeOrmOrm(environmentVariables)
    await dataSource.runMigrations()
    await dataSource.destroy()
  } catch (error) {
    console.error('Error while connecting to the database', error)
    return error
  }
})()
