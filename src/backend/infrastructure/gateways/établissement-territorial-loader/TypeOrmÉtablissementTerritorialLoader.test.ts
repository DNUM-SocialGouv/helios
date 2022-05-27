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

  it('compte le nombre d’établissement(s) affiliés à une même entité juridique', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '111222333'
    const autreNuméroFinessEntitéJuridique = '333222111'

    const entitéJuridiqueAyantDesÉtablissementsModel = new EntitéJuridiqueModel()
    entitéJuridiqueAyantDesÉtablissementsModel.adresseAcheminement = 'fake'
    entitéJuridiqueAyantDesÉtablissementsModel.adresseNuméroVoie = 'fake'
    entitéJuridiqueAyantDesÉtablissementsModel.adresseTypeVoie = 'fake'
    entitéJuridiqueAyantDesÉtablissementsModel.adresseVoie = 'fake'
    entitéJuridiqueAyantDesÉtablissementsModel.libelléStatutJuridique = 'fake'
    entitéJuridiqueAyantDesÉtablissementsModel.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique
    entitéJuridiqueAyantDesÉtablissementsModel.raisonSociale = 'fake'
    entitéJuridiqueAyantDesÉtablissementsModel.téléphone = 'fake'
    const entitéJuridiqueSansÉtablissementsModel = new EntitéJuridiqueModel()
    entitéJuridiqueSansÉtablissementsModel.adresseAcheminement = 'fake'
    entitéJuridiqueSansÉtablissementsModel.adresseNuméroVoie = 'fake'
    entitéJuridiqueSansÉtablissementsModel.adresseTypeVoie = 'fake'
    entitéJuridiqueSansÉtablissementsModel.adresseVoie = 'fake'
    entitéJuridiqueSansÉtablissementsModel.libelléStatutJuridique = 'fake'
    entitéJuridiqueSansÉtablissementsModel.numéroFinessEntitéJuridique = autreNuméroFinessEntitéJuridique
    entitéJuridiqueSansÉtablissementsModel.raisonSociale = 'fake'
    entitéJuridiqueSansÉtablissementsModel.téléphone = 'fake'
    await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

    const établissementTerritorial1AffiliéModel = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorial1AffiliéModel.adresseAcheminement = '01130 NANTUA'
    établissementTerritorial1AffiliéModel.adresseNuméroVoie = '50'
    établissementTerritorial1AffiliéModel.adresseTypeVoie = 'R'
    établissementTerritorial1AffiliéModel.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorial1AffiliéModel.catégorieÉtablissement = '355'
    établissementTerritorial1AffiliéModel.courriel = 'a@example.com'
    établissementTerritorial1AffiliéModel.libelléCatégorieÉtablissement = 'Centre hospitalier (C.H.)'
    établissementTerritorial1AffiliéModel.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique
    établissementTerritorial1AffiliéModel.numéroFinessÉtablissementPrincipal = '010018407'
    établissementTerritorial1AffiliéModel.numéroFinessÉtablissementTerritorial = '012345678'
    établissementTerritorial1AffiliéModel.raisonSociale = 'CH NANTUA'
    établissementTerritorial1AffiliéModel.téléphone = '0102030405'
    établissementTerritorial1AffiliéModel.typeÉtablissement = 'S'
    const établissementTerritorial2AffiliéModel = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorial2AffiliéModel.adresseAcheminement = '01130 NANTUA'
    établissementTerritorial2AffiliéModel.adresseNuméroVoie = '50'
    établissementTerritorial2AffiliéModel.adresseTypeVoie = 'R'
    établissementTerritorial2AffiliéModel.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorial2AffiliéModel.catégorieÉtablissement = '355'
    établissementTerritorial2AffiliéModel.courriel = 'a@example.com'
    établissementTerritorial2AffiliéModel.libelléCatégorieÉtablissement = 'Centre hospitalier (C.H.)'
    établissementTerritorial2AffiliéModel.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique
    établissementTerritorial2AffiliéModel.numéroFinessÉtablissementPrincipal = '010018407'
    établissementTerritorial2AffiliéModel.numéroFinessÉtablissementTerritorial = '123456789'
    établissementTerritorial2AffiliéModel.raisonSociale = 'CH NANTUA'
    établissementTerritorial2AffiliéModel.téléphone = '0102030405'
    établissementTerritorial2AffiliéModel.typeÉtablissement = 'S'
    const établissementTerritorialNonAffiliéModel = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorialNonAffiliéModel.adresseAcheminement = '01130 NANTUA'
    établissementTerritorialNonAffiliéModel.adresseNuméroVoie = '50'
    établissementTerritorialNonAffiliéModel.adresseTypeVoie = 'R'
    établissementTerritorialNonAffiliéModel.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorialNonAffiliéModel.catégorieÉtablissement = '355'
    établissementTerritorialNonAffiliéModel.courriel = 'a@example.com'
    établissementTerritorialNonAffiliéModel.libelléCatégorieÉtablissement = 'Centre hospitalier (C.H.)'
    établissementTerritorialNonAffiliéModel.numéroFinessEntitéJuridique = autreNuméroFinessEntitéJuridique
    établissementTerritorialNonAffiliéModel.numéroFinessÉtablissementPrincipal = '010018407'
    établissementTerritorialNonAffiliéModel.numéroFinessÉtablissementTerritorial = '987654321'
    établissementTerritorialNonAffiliéModel.raisonSociale = 'CH NANTUA'
    établissementTerritorialNonAffiliéModel.téléphone = '0102030405'
    établissementTerritorialNonAffiliéModel.typeÉtablissement = 'S'
    await établissementTerritorialRepository.insert(
      [établissementTerritorial1AffiliéModel, établissementTerritorial2AffiliéModel, établissementTerritorialNonAffiliéModel]
    )

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)

    // WHEN
    const nombreDÉtablissementsAffiliés = await typeOrmÉtablissementTerritorialLoader.compteLesÉtablissementsDUneMêmeEntité(numéroFinessEntitéJuridique)

    // THEN
    const nombreDÉtablissementsAffiliésAttendu = 2
    expect(nombreDÉtablissementsAffiliés).toStrictEqual(nombreDÉtablissementsAffiliésAttendu)
  })
})
