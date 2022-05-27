import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialNonTrouvée'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialLoader } from './TypeOrmÉtablissementTerritorialLoader'

describe('Établissement territorial loader', () => {
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

  it('charge par numéro FINESS quand l’établissement territorial est en base', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '111222333'
    const entitéJuridiqueModel = new EntitéJuridiqueModel()
    entitéJuridiqueModel.adresseAcheminement = 'fake'
    entitéJuridiqueModel.adresseNuméroVoie = 'fake'
    entitéJuridiqueModel.adresseTypeVoie = 'fake'
    entitéJuridiqueModel.adresseVoie = 'fake'
    entitéJuridiqueModel.libelléStatutJuridique = 'fake'
    entitéJuridiqueModel.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique
    entitéJuridiqueModel.raisonSociale = 'fake'
    entitéJuridiqueModel.téléphone = 'fake'
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const numéroFinessET = '123456789'
    const établissementTerritorialModel = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorialModel.adresseAcheminement = '01130 NANTUA'
    établissementTerritorialModel.adresseNuméroVoie = '50'
    établissementTerritorialModel.adresseTypeVoie = 'R'
    établissementTerritorialModel.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorialModel.catégorieÉtablissement = '355'
    établissementTerritorialModel.courriel = 'a@example.com'
    établissementTerritorialModel.libelléCatégorieÉtablissement = 'Centre hospitalier (C.H.)'
    établissementTerritorialModel.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique
    établissementTerritorialModel.numéroFinessÉtablissementPrincipal = '010018407'
    établissementTerritorialModel.numéroFinessÉtablissementTerritorial = numéroFinessET
    établissementTerritorialModel.raisonSociale = 'CH NANTUA'
    établissementTerritorialModel.téléphone = '0102030405'
    établissementTerritorialModel.typeÉtablissement = 'S'
    await établissementTerritorialRepository.insert(établissementTerritorialModel)

    const établissementTerritorialAttendue: ÉtablissementTerritorialIdentité = {
      adresseAcheminement: '01130 NANTUA',
      adresseNuméroVoie: '50',
      adresseTypeVoie: 'R',
      adresseVoie: 'PAUL PAINLEVE',
      catégorieÉtablissement: '355',
      courriel: 'a@example.com',
      dateMiseAJourSource: '2022-05-14',
      libelléCatégorieÉtablissement: 'Centre hospitalier (C.H.)',
      numéroFinessEntitéJuridique: numéroFinessEntitéJuridique,
      numéroFinessÉtablissementPrincipal: '010018407',
      numéroFinessÉtablissementTerritorial: numéroFinessET,
      raisonSociale: 'CH NANTUA',
      typeÉtablissement: 'S',
      téléphone: '0102030405',
    }

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)

    // WHEN
    const établissementTerritorialChargée = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFinessET)

    // THEN
    expect(établissementTerritorialChargée).toStrictEqual(établissementTerritorialAttendue)
  })

  it('signale que l’établissement territorial n’a pas été trouvée lorsque l’établissement territorial n’existe pas', async () => {
    // GIVEN
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const numéroFiness = '012345678'
    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)
    const exceptionAttendue = new ÉtablissementTerritorialNonTrouvée('012345678')

    // WHEN
    const exceptionReçue = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFiness)

    // THEN
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })
})
