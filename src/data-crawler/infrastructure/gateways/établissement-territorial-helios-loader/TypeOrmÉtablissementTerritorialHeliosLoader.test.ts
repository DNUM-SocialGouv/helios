import { Repository } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialHeliosLoader } from './TypeOrmÉtablissementTerritorialHeliosLoader'

describe('La récupération des établissements territoriaux en interne', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
  })

  beforeEach(async () => {
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await établissementTerritorialRepository.query('DELETE FROM ÉtablissementTerritorialIdentité;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('récupère tous les numéros FINESS des établissements territoriaux', async () => {
    // GIVEN
    const entitéJuridique1 = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
      { numéroFinessEntitéJuridique: '123456789' }
    )
    const entitéJuridique2 = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
      { numéroFinessEntitéJuridique: '987654321' }
    )
    await entitéJuridiqueRepository.insert([entitéJuridique1, entitéJuridique2])

    const numéroFinessÉtablissement1 = '111111111'
    const numéroFinessÉtablissement2 = '222222222'
    const numéroFinessÉtablissement3 = '333333333'
    await établissementTerritorialRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique: '123456789', numéroFinessÉtablissementTerritorial: numéroFinessÉtablissement1 }),
      ÉtablissementTerritorialIdentitéModelTestFactory.créeAutreÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique: '123456789', numéroFinessÉtablissementTerritorial: numéroFinessÉtablissement2 }),
      ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique: '987654321', numéroFinessÉtablissementTerritorial: numéroFinessÉtablissement3 }),
    ])
    const typeOrmÉtablissementTerritorialHeliosLoader = new TypeOrmÉtablissementTerritorialHeliosLoader(orm)

    // WHEN
    const numérosFinessDesÉtablissements = await typeOrmÉtablissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux()

    // THEN
    expect(numérosFinessDesÉtablissements).toStrictEqual([numéroFinessÉtablissement1, numéroFinessÉtablissement2, numéroFinessÉtablissement3])
  })
})
