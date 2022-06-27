/* eslint-disable no-console */
import { ConsoleLogger } from './ConsoleLogger'

describe('Logger', () => {
  const message = 'any message'

  it('affiche un message de debug', () => {
    // GIVEN
    jest.spyOn(console, 'debug').mockImplementation()
    const logger = new ConsoleLogger()

    // WHEN
    logger.debug(message)

    // THEN
    expect(console.debug).toHaveBeenCalledWith(`[Helios] ${message}`)
  })

  it('affiche un message d’erreur', () => {
    // GIVEN
    jest.spyOn(console, 'error').mockImplementation()
    const logger = new ConsoleLogger()

    // WHEN
    logger.error(message)

    // THEN
    expect(console.error).toHaveBeenCalledWith(`[Helios] ${message}`)
  })

  it('affiche un message d’information', () => {
    // GIVEN
    jest.spyOn(console, 'info').mockImplementation()
    const logger = new ConsoleLogger()

    // WHEN
    logger.info(message)

    // THEN
    expect(console.info).toHaveBeenCalledWith(`[Helios] ${message}`)
  })
})
