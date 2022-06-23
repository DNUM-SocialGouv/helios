import { dotEnvConfig } from '../data-crawler/legacy/infrastructure/gateways/dot-env/dotEnvConfig'
import { NodeEnvironmentVariables } from '../data-crawler/legacy/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from '../data-crawler/legacy/infrastructure/gateways/logger/ConsoleLogger'
import { typeOrmOrm } from '../data-crawler/legacy/infrastructure/gateways/orm/typeOrmOrm'

(async () => {
  const logger = new ConsoleLogger()
  try {
    dotEnvConfig()
    const environmentVariables = new NodeEnvironmentVariables(logger)
    const orm = await typeOrmOrm(environmentVariables)
    await orm.runMigrations()
    await orm.destroy()
  } catch (error) {
    logger.error('Error while connecting to the ../database ' + error)
    return error
  }
})()
