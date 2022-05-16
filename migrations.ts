import { dependencies } from './src/data-crawler/infrastructure/dependencies'
import { typeOrmOrm } from './src/data-crawler/infrastructure/gateways/orm/typeOrmOrm'
import { EnvironmentVariables } from './src/data-crawler/métier/gateways/EnvironmentVariables'

(async () => {
  try {
    let dataSource

    if (process.env['NODE_ENV'] === 'test') {
      const environmentVariables: EnvironmentVariables = {
        ORM_DEBUG: 'true',
        POSTGRES_DB: 'helios',
        POSTGRES_PASSWORD: 'h3li0s',
        POSTGRES_PORT: '5433',
        POSTGRES_USER: 'helios',
        SENTRY_AUTH_TOKEN: '1234567890',
        SENTRY_DSN: 'https://fake-sentry.io/11',
        SFTP_HOST: 'localhost',
        SFTP_IS_DEBUG: 'false',
        SFTP_LOCAL_PATH: 'data_test',
        SFTP_PASSWORD: 'fake_passw0rd',
        SFTP_PORT: '22',
        SFTP_PRIVATE_KEY: 'privateKey',
        SFTP_USERNAME: 'usr_finess_ls',
      }
      dataSource = await typeOrmOrm(environmentVariables)
    } else {
      console.log('pas test')
      dataSource = (await dependencies).database
    }
    await dataSource.runMigrations()
    await dataSource.destroy()
  } catch (error) {
    console.error('Error while connecting to the database', error)
    return error
  }
})()
