import { Repository } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestBuilder } from '../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialHeliosLoader } from './TypeOrmÉtablissementTerritorialHeliosLoader'

describe('La récupération des établissements territoriaux d’Helios', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
  })

  beforeEach(async () => {
    await entitéJuridiqueRepository.query('DELETE FROM entite_juridique;')
    await établissementTerritorialRepository.query('DELETE FROM etablissement_territorial;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('récupère tous les numéros FINESS des établissements territoriaux dans l’ordre croissant', async () => {
    // GIVEN
    const entitéJuridique1 = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '123456789' })
    const entitéJuridique2 = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '987654321' })
    await entitéJuridiqueRepository.insert([entitéJuridique1, entitéJuridique2])

    const numéroFinessÉtablissement1 = '111111111'
    const numéroFinessÉtablissement2 = '222222222'
    const numéroFinessÉtablissement3 = '333333333'
    await établissementTerritorialRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: '123456789',
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissement2,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: '123456789',
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissement1,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: '987654321',
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissement3,
      }),
    ])
    const typeOrmÉtablissementTerritorialHeliosLoader = new TypeOrmÉtablissementTerritorialHeliosLoader(orm)

    // WHEN
    const numérosFinessDesÉtablissements = await typeOrmÉtablissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux()

    // THEN
    expect(numérosFinessDesÉtablissements).toStrictEqual([numéroFinessÉtablissement1, numéroFinessÉtablissement2, numéroFinessÉtablissement3])
  })
})
