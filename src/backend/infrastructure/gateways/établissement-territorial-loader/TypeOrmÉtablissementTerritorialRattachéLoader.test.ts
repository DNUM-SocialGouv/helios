import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../database/test/ÉtablissementTerritorialIdentitéModelTestFactory'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialRattaché } from '../../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialRattachéLoader } from './TypeOrmÉtablissementTerritorialRattachéLoader'

describe('Établissement territorial rattaché loader', () => {
  const orm = getOrm()
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  beforeEach(async () => {
    await établissementTerritorialRepository.query('DELETE FROM ÉtablissementTerritorialIdentité;')
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('charge les établissements territoriaux rattachés à une entité juridique triés alphabétiquement par leur nom', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '123456789'
    const autreNuméroFinessEntitéJuridique = '987654321'
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
    const autreEntitéJuridiqueModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
      { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
    )
    await entitéJuridiqueRepository.insert([entitéJuridiqueModel, autreEntitéJuridiqueModel])

    const numéroFinessET1 = '111222333'
    const établissementTerritorial1RattachéModel =
    ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel(
      { domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: numéroFinessET1, raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ' }
    )
    const numéroFinessET2 = '111333222'
    const établissementTerritorial2RattachéModel =
      ÉtablissementTerritorialIdentitéModelTestFactory.créeAutreÉtablissementTerritorialIdentitéModel(
        { domaine: DomaineÉtablissementTerritorial.SANITAIRE, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: numéroFinessET2, raisonSociale: 'CH NANTUA' }
      )
    const établissementTerritorialNonRattachéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel(
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
    const numéroFinessEntitéJuridique = '123456789'
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialRattachéLoader(orm)

    // WHEN
    const établissementsTerritoriaux =
      await typeOrmÉtablissementTerritorialLoader.chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique)

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual([])
  })
})
