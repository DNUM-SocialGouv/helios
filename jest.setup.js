import '@testing-library/jest-dom/extend-expect'
import dotenv from 'dotenv-defaults'
import fs from 'fs'

const envConfig = dotenv.parse(fs.readFileSync('./.env.test').toString(), './.env')
for (const key in envConfig) {
  process.env[key] = envConfig[key]
}
