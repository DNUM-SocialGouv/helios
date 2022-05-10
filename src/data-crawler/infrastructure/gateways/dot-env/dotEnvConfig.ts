import dotenv from 'dotenv-defaults'

export const dotEnvConfig = () => {
  dotenv.config({
    defaults: './.env',
    encoding: 'utf8',
    path: './.env.local',
  })
}
