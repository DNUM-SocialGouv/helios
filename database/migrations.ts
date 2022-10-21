import { dotEnvConfig } from '../download_data_source/infrastructure/gateways/dot-env/dotEnvConfig'
import { NodeEnvironmentVariables } from '../download_data_source/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from '../download_data_source/infrastructure/gateways/logger/ConsoleLogger'
import { typeOrmOrm } from '../download_data_source/infrastructure/gateways/orm/typeOrmOrm'

(async () => {
  const sensDeLaMigration = process.argv[2]
  const logger = new ConsoleLogger()
  try {
    dotEnvConfig()
    const environmentVariables = new NodeEnvironmentVariables(logger)
    const orm = await typeOrmOrm(environmentVariables)

    if (sensDeLaMigration === 'down') {
      logger.info('Enlève la dernière migration')
      await orm.undoLastMigration()
    } else {
      logger.info('Applique toutes les migrations')
      await orm.runMigrations()
    }

    await orm.destroy()
  } catch (error) {
    logger.error('Error while connecting to the ../database: ' + error)
    return error
  }
})()
