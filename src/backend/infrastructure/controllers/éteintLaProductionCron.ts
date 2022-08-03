import fetch from 'node-fetch'

import { Dependencies, dependencies } from '../dependencies'

async function éteintLaProductionCron(dependencies: Dependencies): Promise<void> {
  // TODO: refacto dans l'infra
  const app = 'helios'
  const apiUrl = 'api.osc-fr1.scalingo.com'
  const token = dependencies.environmentVariables['SCALINGO_TOKEN']
  const base64Token = Buffer.from(':' + token, 'utf-8').toString('base64')

  try {
    const exchangeResponse = await fetch('https://auth.scalingo.com/v1/tokens/exchange', {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const exchange = await exchangeResponse.json()

    await fetch(`https://${apiUrl}/v1/apps/${app}/scale`, {
      body: JSON.stringify({
        containers: [
          {
            amount: 0,
            name: 'web',
          },
        ],
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${exchange.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    dependencies.logger.info('La production est éteinte.')
  } catch (error) {
    dependencies.logger.error(error)
  }
}

éteintLaProductionCron(dependencies)
