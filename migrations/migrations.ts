import { dependencies } from '../src/data-crawler/infrastructure/dependencies'

(async () => {
  try {
    const dataSource = (await dependencies).database
    await dataSource.runMigrations()
    await dataSource.destroy()
  } catch (error) {
    console.error('Error while connecting to the database', error)
    return error
  }
})()
