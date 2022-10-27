import { Repository } from 'typeorm'

import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../database/models/DateMiseÀJourFichierSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourFichierSourceModelTestBuilder } from '../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder'
import { EntitéJuridiqueModelTestBuilder } from '../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { fakeLogger, getOrm, unÉtablissementMédicoSocial, unÉtablissementSanitaire } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialRepository } from './TypeOrmÉtablissementTerritorialRepository'

describe('Sauvegarde de l’établissement territorial', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel)
  })

  beforeEach(async () => {
    await établissementTerritorialIdentitéRepository.query('DELETE FROM etablissement_territorial;')
    await entitéJuridiqueRepository.query('DELETE FROM entite_juridique;')
    await dateMiseÀJourFichierSourceRepository.query('DELETE FROM date_mise_a_jour_fichier_source;')
  })

  afterAll(async () => {
    await(await orm).destroy()
  })

  it('sauvegarde un établissement territorial et sa date de mise à jour FINESS même s’il existe déjà', async () => {
    // GIVEN
    const entitéJuridique1 = new EntitéJuridiqueModel()
    entitéJuridique1.adresseAcheminement = 'fake'
    entitéJuridique1.adresseNuméroVoie = 'fake'
    entitéJuridique1.adresseTypeVoie = 'fake'
    entitéJuridique1.adresseVoie = 'fake'
    entitéJuridique1.commune = 'fake'
    entitéJuridique1.département = 'fake'
    entitéJuridique1.libelléStatutJuridique = 'fake'
    entitéJuridique1.numéroFinessEntitéJuridique = '010018407'
    entitéJuridique1.raisonSociale = 'fake'
    entitéJuridique1.siren = 'fake'
    entitéJuridique1.téléphone = 'fake'

    const entitéJuridique2 = new EntitéJuridiqueModel()
    entitéJuridique2.adresseAcheminement = 'fake'
    entitéJuridique2.adresseNuméroVoie = 'fake'
    entitéJuridique2.adresseTypeVoie = 'fake'
    entitéJuridique2.adresseVoie = 'fake'
    entitéJuridique2.commune = 'fake'
    entitéJuridique2.département = 'fake'
    entitéJuridique2.libelléStatutJuridique = 'fake'
    entitéJuridique2.numéroFinessEntitéJuridique = '590000741'
    entitéJuridique2.raisonSociale = 'fake'
    entitéJuridique2.siren = 'fake'
    entitéJuridique2.téléphone = 'fake'
    await entitéJuridiqueRepository.insert([entitéJuridique1, entitéJuridique2])

    const établissementTerritorialIdentité1 = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorialIdentité1.adresseAcheminement = 'fake',
    établissementTerritorialIdentité1.adresseNuméroVoie = 'fake',
    établissementTerritorialIdentité1.adresseTypeVoie = 'fake',
    établissementTerritorialIdentité1.adresseVoie = 'fake',
    établissementTerritorialIdentité1.catégorieÉtablissement = 'fak',
    établissementTerritorialIdentité1.codeModeTarification = '00',
    établissementTerritorialIdentité1.commune = 'fake',
    établissementTerritorialIdentité1.courriel = 'fake',
    établissementTerritorialIdentité1.département = 'fake',
    établissementTerritorialIdentité1.libelléCatégorieÉtablissement = 'fake',
    établissementTerritorialIdentité1.libelléCourtCatégorieÉtablissement = 'fake',
    établissementTerritorialIdentité1.libelléModeTarification = 'fake',
    établissementTerritorialIdentité1.numéroFinessEntitéJuridique = entitéJuridique1.numéroFinessEntitéJuridique,
    établissementTerritorialIdentité1.numéroFinessÉtablissementPrincipal = 'fake',
    établissementTerritorialIdentité1.numéroFinessÉtablissementTerritorial = '010000040',
    établissementTerritorialIdentité1.raisonSociale = 'fake',
    établissementTerritorialIdentité1.raisonSocialeCourte = 'fake',
    établissementTerritorialIdentité1.siret = 'fake',
    établissementTerritorialIdentité1.typeÉtablissement = 'F',
    établissementTerritorialIdentité1.téléphone = 'fake',
    await établissementTerritorialIdentitéRepository.insert([établissementTerritorialIdentité1])
    await dateMiseÀJourFichierSourceRepository.insert([
      {
        dernièreMiseÀJour: '2020-01-02',
        fichier: FichierSource.FINESS_CS1400102,
      },
    ])
    const typeOrmÉtablissementTerritorialRepository = new TypeOrmÉtablissementTerritorialRepository(orm, fakeLogger)
    const établissementsTerritoriaux = [unÉtablissementMédicoSocial, unÉtablissementSanitaire]
    const nouvelleDateDeMiseÀJour = '20220728'

    // WHEN
    await typeOrmÉtablissementTerritorialRepository.sauvegarde(établissementsTerritoriaux, nouvelleDateDeMiseÀJour)

    // THEN
    const établissementsTerritoriauxSauvés = await établissementTerritorialIdentitéRepository
      .find({ order: { numéroFinessÉtablissementTerritorial: 'ASC' } })

    const établissementTerritorial1MisAJourAttendu = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorial1MisAJourAttendu.adresseAcheminement = '01130 NANTUA'
    établissementTerritorial1MisAJourAttendu.adresseNuméroVoie = '50'
    établissementTerritorial1MisAJourAttendu.adresseTypeVoie = 'R'
    établissementTerritorial1MisAJourAttendu.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorial1MisAJourAttendu.catégorieÉtablissement = '355'
    établissementTerritorial1MisAJourAttendu.codeModeTarification = '99'
    établissementTerritorial1MisAJourAttendu.commune = 'NANTUA'
    établissementTerritorial1MisAJourAttendu.courriel = 'a@example.com'
    établissementTerritorial1MisAJourAttendu.domaine = DomaineÉtablissementTerritorial.MÉDICO_SOCIAL
    établissementTerritorial1MisAJourAttendu.département = 'AIN'
    établissementTerritorial1MisAJourAttendu.libelléCatégorieÉtablissement = 'Centre Hospitalier (C.H.)'
    établissementTerritorial1MisAJourAttendu.libelléCourtCatégorieÉtablissement = 'C.H.'
    établissementTerritorial1MisAJourAttendu.libelléModeTarification = 'Indéterminé'
    établissementTerritorial1MisAJourAttendu.numéroFinessEntitéJuridique = '010018407'
    établissementTerritorial1MisAJourAttendu.numéroFinessÉtablissementPrincipal = '010000057'
    établissementTerritorial1MisAJourAttendu.numéroFinessÉtablissementTerritorial = '010000040'
    établissementTerritorial1MisAJourAttendu.raisonSociale = 'CENTRE HOSPITALIER NANTUA'
    établissementTerritorial1MisAJourAttendu.raisonSocialeCourte = 'CH NANTUA'
    établissementTerritorial1MisAJourAttendu.siret = '20003004700017'
    établissementTerritorial1MisAJourAttendu.typeÉtablissement = 'S'
    établissementTerritorial1MisAJourAttendu.téléphone = '0102030405'
    const établissementTerritorial2MisAJourAttendu = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorial2MisAJourAttendu.adresseAcheminement = '59650 VILLENEUVE D ASCQ'
    établissementTerritorial2MisAJourAttendu.adresseNuméroVoie = '20'
    établissementTerritorial2MisAJourAttendu.adresseTypeVoie = 'AV'
    établissementTerritorial2MisAJourAttendu.adresseVoie = 'DE LA RECONNAISSANCE'
    établissementTerritorial2MisAJourAttendu.catégorieÉtablissement = '365'
    établissementTerritorial2MisAJourAttendu.codeModeTarification = '54'
    établissementTerritorial2MisAJourAttendu.commune = 'VILLENEUVE D ASCQ'
    établissementTerritorial2MisAJourAttendu.courriel = 'b@example.com'
    établissementTerritorial2MisAJourAttendu.domaine = DomaineÉtablissementTerritorial.SANITAIRE
    établissementTerritorial2MisAJourAttendu.département = 'NORD'
    établissementTerritorial2MisAJourAttendu.libelléCatégorieÉtablissement = 'Centre Hospitalier (C.H.)'
    établissementTerritorial2MisAJourAttendu.libelléCourtCatégorieÉtablissement = 'C.H.'
    établissementTerritorial2MisAJourAttendu.libelléModeTarification = 'Tarif AM - Services de Soins Infirmiers A Domicile'
    établissementTerritorial2MisAJourAttendu.numéroFinessEntitéJuridique = '590000741'
    établissementTerritorial2MisAJourAttendu.numéroFinessÉtablissementPrincipal = ''
    établissementTerritorial2MisAJourAttendu.numéroFinessÉtablissementTerritorial = '590782553'
    établissementTerritorial2MisAJourAttendu.raisonSociale = 'HOPITAL PRIVE DE VILLENEUVE DASCQ'
    établissementTerritorial2MisAJourAttendu.raisonSocialeCourte = 'HOPITAL PRIVE DE VILLENEUVE DASCQ'
    établissementTerritorial2MisAJourAttendu.siret = '20003004700018'
    établissementTerritorial2MisAJourAttendu.typeÉtablissement = 'P'
    établissementTerritorial2MisAJourAttendu.téléphone = '0102030406'

    expect(établissementsTerritoriauxSauvés).toStrictEqual(
      [établissementTerritorial1MisAJourAttendu, établissementTerritorial2MisAJourAttendu]
    )
    const dateMiseÀJourFichierSourceSauvée = await dateMiseÀJourFichierSourceRepository
      .find({ where: { fichier: FichierSource.FINESS_CS1400102 } })
    const dateMiseÀJourFichierSourceAttendue = new DateMiseÀJourFichierSourceModel()
    dateMiseÀJourFichierSourceAttendue.fichier = FichierSource.FINESS_CS1400102
    dateMiseÀJourFichierSourceAttendue.dernièreMiseÀJour = '2022-07-28'
    expect(dateMiseÀJourFichierSourceSauvée).toStrictEqual([dateMiseÀJourFichierSourceAttendue])
  })

  it('revient à la situation initiale si la sauvegarde des établissements échoue', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '010018407'
    const entitéJuridique = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert([entitéJuridique])
    const numéroFinessÉtablissementTerritorial = '999777444'
    await établissementTerritorialIdentitéRepository.insert(
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
    )
    await dateMiseÀJourFichierSourceRepository.insert(
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2020-01-01',
        fichier: FichierSource.FINESS_CS1400102,
      })
    )

    const établissementTerritorialMalFormé = {
      ...unÉtablissementMédicoSocial,
      numéroFinessÉtablissementTerritorial: 'il y a plus de 9 caractères dans ce numéro FINESS',
    }
    const nouvelleDateDeMiseÀJourDuFichierSource = '20220728'

    const typeOrmÉtablissementTerritorialRepository = new TypeOrmÉtablissementTerritorialRepository(orm, fakeLogger)

    // WHEN
    await typeOrmÉtablissementTerritorialRepository.sauvegarde([établissementTerritorialMalFormé], nouvelleDateDeMiseÀJourDuFichierSource)

    // THEN
    const établissementsTerritoriauxSauvés = await établissementTerritorialIdentitéRepository.find()

    const établissementTerritorialAttendu = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorialAttendu.adresseAcheminement = '01130 NANTUA'
    établissementTerritorialAttendu.adresseNuméroVoie = '50'
    établissementTerritorialAttendu.adresseTypeVoie = 'R'
    établissementTerritorialAttendu.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorialAttendu.catégorieÉtablissement = '159'
    établissementTerritorialAttendu.codeModeTarification = '99'
    établissementTerritorialAttendu.commune = 'NANTUA'
    établissementTerritorialAttendu.courriel = 'a@example.com'
    établissementTerritorialAttendu.domaine = DomaineÉtablissementTerritorial.MÉDICO_SOCIAL
    établissementTerritorialAttendu.département = 'AIN'
    établissementTerritorialAttendu.libelléCatégorieÉtablissement = 'Centre Hospitalier (C.H.)'
    établissementTerritorialAttendu.libelléCourtCatégorieÉtablissement = 'C.H.'
    établissementTerritorialAttendu.libelléModeTarification = 'Indéterminé'
    établissementTerritorialAttendu.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique
    établissementTerritorialAttendu.numéroFinessÉtablissementPrincipal = '010018407'
    établissementTerritorialAttendu.numéroFinessÉtablissementTerritorial = numéroFinessÉtablissementTerritorial
    établissementTerritorialAttendu.raisonSociale = 'CENTRE HOSPITALIER NANTUA'
    établissementTerritorialAttendu.raisonSocialeCourte = 'CH NANTUA'
    établissementTerritorialAttendu.siret = '20003004700017'
    établissementTerritorialAttendu.typeÉtablissement = 'S'
    établissementTerritorialAttendu.téléphone = '0102030405'

    expect(établissementsTerritoriauxSauvés).toStrictEqual([établissementTerritorialAttendu])

    const dateMiseÀJourFichierSourceSauvée = await dateMiseÀJourFichierSourceRepository
      .find({ where: { fichier: FichierSource.FINESS_CS1400102 } })
    const dateMiseÀJourFichierSourceAttendue = new DateMiseÀJourFichierSourceModel()
    dateMiseÀJourFichierSourceAttendue.fichier = FichierSource.FINESS_CS1400102
    dateMiseÀJourFichierSourceAttendue.dernièreMiseÀJour = '2020-01-01'
    expect(dateMiseÀJourFichierSourceSauvée).toStrictEqual([dateMiseÀJourFichierSourceAttendue])
  })

  it('supprime un établissement territorial quand il est en base', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '010018407'
    const entitéJuridique = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert([entitéJuridique])
    const numéroFinessÉtablissementTerritorial = '999777444'

    await établissementTerritorialIdentitéRepository.insert(
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
    )
    const typeOrmÉtablissementTerritorialRepository = new TypeOrmÉtablissementTerritorialRepository(orm, fakeLogger)

    // WHEN
    await typeOrmÉtablissementTerritorialRepository.supprime([numéroFinessÉtablissementTerritorial])

    // THEN
    await expect(établissementTerritorialIdentitéRepository.count()).resolves.toBe(0)
  })

  it('ne signale pas d’alerte si établissement territorial à supprimer n’est pas en base', async () => {
    // GIVEN
    const numéroFinessÉtablissementTerritorialPasEnBase = '123456789'
    const typeOrmÉtablissementTerritorialRepository = new TypeOrmÉtablissementTerritorialRepository(orm, fakeLogger)

    // WHEN
    await typeOrmÉtablissementTerritorialRepository.supprime([numéroFinessÉtablissementTerritorialPasEnBase])

    // THEN
    await expect(établissementTerritorialIdentitéRepository.count()).resolves.toBe(0)
  })
})
