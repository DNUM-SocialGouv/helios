import { Repository } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test/EntitéJuridiqueModelTestFactory'
import { getOrm } from '../../../testHelper'
import { TypeOrmEntitéJuridiqueHeliosLoader } from './TypeOrmEntitéJuridiqueHeliosLoader'

describe('récupère les numéro FINESS des entités Juridiques', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
  })

  beforeEach(async () => {
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('récupère les numéro FINESS des entités Juridiques', async () => {
    // GIVEN
    const typeOrmEntitéJuridiqueHeliosLoader = new TypeOrmEntitéJuridiqueHeliosLoader(orm)
    const entitéJuridique1 = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
      { numéroFinessEntitéJuridique: '123456789' }
    )
    const entitéJuridique2 = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
      { numéroFinessEntitéJuridique: '900000000' }
    )
    await entitéJuridiqueRepository.insert(entitéJuridique1)
    await entitéJuridiqueRepository.insert(entitéJuridique2)
    // WHEN
    const entitésJuridiquesHelios = typeOrmEntitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
    // THEN
    expect(entitésJuridiquesHelios).toStrictEqual(['123456789', '900000000'])
  })

})
