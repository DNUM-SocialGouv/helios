import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../../../métier/entities/EntitéJuridiqueNonTrouvée'
import { getOrm } from '../../../testHelper'
import { TypeORMEntitéJuridiqueLoader } from './TypeORMEntitéJuridiqueLoader'

describe('Entité juridique loader', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  beforeEach(async () => {
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('charge par numéro FINESS lorsque l’entité juridique est en base', async () => {
    // GIVEN
    const entitéJuridique = new EntitéJuridiqueModel()
    entitéJuridique.adresseAcheminement = '75000 Paris'
    entitéJuridique.adresseNuméroVoie = '6'
    entitéJuridique.adresseTypeVoie = 'AV'
    entitéJuridique.adresseVoie = 'rue de la Paix'
    entitéJuridique.libelléStatutJuridique = 'statut'
    entitéJuridique.numéroFinessEntitéJuridique = '012345678'
    entitéJuridique.raisonSociale = 'Nom de l’entité juridique'
    entitéJuridique.téléphone = '0123456789'
    await entitéJuridiqueRepository.insert(entitéJuridique)
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const numéroFINESS = '012345678'
    const typeORMEntitéJuridiqueLoader = new TypeORMEntitéJuridiqueLoader(orm)
    const entitéJuridiqueAttendue: EntitéJuridique = {
      adresseAcheminement: '75000 Paris',
      adresseNuméroVoie: '6',
      adresseTypeVoie: 'AV',
      adresseVoie: 'rue de la Paix',
      dateMiseAJourSource: '2022-05-14',
      libelléStatutJuridique: 'statut',
      numéroFinessEntitéJuridique: numéroFINESS,
      raisonSociale: 'Nom de l’entité juridique',
      téléphone: '0123456789',
    }

    // WHEN
    const entitéJuridiqueChargée = await typeORMEntitéJuridiqueLoader.chargeParNuméroFINESS(numéroFINESS)

    // THEN
    expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueAttendue)
  })

  it('signale que l’entité juridique n’a pas été trouvée lorsque l’entité juridique n’existe pas', async () => {
    // GIVEN
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const numéroFINESS = '012345678'
    const typeORMEntitéJuridiqueLoader = new TypeORMEntitéJuridiqueLoader(orm)
    const exceptionAttendue = new EntitéJuridiqueNonTrouvée('012345678')

    // WHEN
    const exceptionReçue = await typeORMEntitéJuridiqueLoader.chargeParNuméroFINESS(numéroFINESS)

    // THEN
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })
})
