import { dotEnvConfig } from '../datacrawler/legacy/infrastructure/gateways/dot-env/dotEnvConfig'
import { NodeEnvironmentVariables } from '../datacrawler/legacy/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from '../datacrawler/legacy/infrastructure/gateways/logger/ConsoleLogger'
import { typeOrmOrm } from '../datacrawler/legacy/infrastructure/gateways/orm/typeOrmOrm'

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
