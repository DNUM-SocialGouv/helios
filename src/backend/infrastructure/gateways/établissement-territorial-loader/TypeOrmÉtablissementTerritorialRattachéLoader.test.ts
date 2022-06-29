import { Repository } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialRattaché } from '../../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { clearAllTables, getOrm, numéroFinessEntitéJuridique } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialRattachéLoader } from './TypeOrmÉtablissementTerritorialRattachéLoader'

describe('Établissement territorial rattaché loader', () => {
  const orm = getOrm()
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>

  beforeAll(async () => {
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
  })

  beforeEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('charge les établissements territoriaux rattachés à une entité juridique triés alphabétiquement par leur nom', async () => {
    // GIVEN
    const autreNuméroFinessEntitéJuridique = '987654321'
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
    const autreEntitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée(
      { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
    )
    await entitéJuridiqueRepository.insert([entitéJuridiqueModel, autreEntitéJuridiqueModel])

    const numéroFinessET1 = '111222333'
    const établissementTerritorial1RattachéModel =
    ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial(
      { domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: numéroFinessET1, raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ' }
    )
    const numéroFinessET2 = '111333222'
    const établissementTerritorial2RattachéModel =
      ÉtablissementTerritorialIdentitéModelTestFactory.créeSanitaire(
        { domaine: DomaineÉtablissementTerritorial.SANITAIRE, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: numéroFinessET2, raisonSociale: 'CH NANTUA' }
      )
    const établissementTerritorialNonRattachéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial(
      { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: '321654987' }
    )
    await établissementTerritorialRepository.insert(
      [établissementTerritorial1RattachéModel, établissementTerritorial2RattachéModel, établissementTerritorialNonRattachéModel]
    )

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialRattachéLoader(orm)

    // WHEN
    const établissementsTerritoriaux =
      await typeOrmÉtablissementTerritorialLoader.chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique)

    // THEN
    const établissementsTerritoriauxAttendus: ÉtablissementTerritorialRattaché[] = [
      {
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        numéroFiness: numéroFinessET2,
        raisonSociale: 'CH NANTUA',
      },
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: numéroFinessET1,
        raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      },
    ]
    expect(établissementsTerritoriaux).toStrictEqual(établissementsTerritoriauxAttendus)
  })

  it('renvoie une liste vide quand aucun établissement n’est rattaché à une entité juridique', async () => {
    // GIVEN
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialRattachéLoader(orm)

    // WHEN
    const établissementsTerritoriaux =
      await typeOrmÉtablissementTerritorialLoader.chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique)

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual([])
  })
})
