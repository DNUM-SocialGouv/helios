import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { fakeDataCrawlerDependencies } from '../../../testHelper'
import { FinessEntitéJuridiqueRepository } from './FinessEntitéJuridiqueRepository'

describe('Sauvegarde de l’entité juridique', () => {
  beforeEach(async () => {
    await fakeDataCrawlerDependencies.database.raw('DELETE FROM EntitéJuridique')
    await fakeDataCrawlerDependencies.database.raw('DELETE FROM DateMiseÀJourSource')
  })

  afterAll(async () => {
    await fakeDataCrawlerDependencies.database.destroy()
  })

  it('sauvegarder une entité juridique et sa date de mise à jour FINESS même si elle existe déjà', async () => {
    // GIVEN
    await fakeDataCrawlerDependencies.database.raw('INSERT INTO EntitéJuridique (adresseAcheminement, adresseNuméroVoie, adresseTypeVoie, adresseVoie, numéroFinessEntitéJuridique, raisonSociale, libelléStatutJuridique, téléphone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'fake',
        'fake',
        'fake',
        'fake',
        '010018407',
        'fake',
        'fake',
        'fake',
      ])
    await fakeDataCrawlerDependencies.database.raw('INSERT INTO DateMiseÀJourSource (dernièreMiseÀJour, source) VALUES (?, ?)',
      [
        '20200102',
        'FINESS',
      ])
    const finessEntitéJuridiqueRepository = new FinessEntitéJuridiqueRepository(fakeDataCrawlerDependencies.database)
    const entitéJuridique1: EntitéJuridique = {
      adresseAcheminement: '01117 OYONNAX CEDEX',
      adresseNuméroVoie: '1',
      adresseTypeVoie: 'RTE',
      adresseVoie: 'DE VEYZIAT',
      dateMiseAJourSource: '20220203',
      libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
      numéroFinessEntitéJuridique: '010018407',
      raisonSociale: 'CH DU HAUT BUGEY',
      téléphone: '0102030406',
    }
    const entitéJuridique2: EntitéJuridique = {
      adresseAcheminement: '59650 VILLENEUVE D ASCQ',
      adresseNuméroVoie: '20',
      adresseTypeVoie: 'AV',
      adresseVoie: 'DE LA RECONNAISSANCE',
      dateMiseAJourSource: '20220203',
      libelléStatutJuridique: 'Société Anonyme (S.A.)',
      numéroFinessEntitéJuridique: '590001741',
      raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      téléphone: '0102030405',
    }
    const entitésJuridiques = [entitéJuridique1, entitéJuridique2]

    // WHEN
    await finessEntitéJuridiqueRepository.save(entitésJuridiques)

    // THEN
    const entitésJuridiquesQuery = await fakeDataCrawlerDependencies.database.raw('SELECT * FROM EntitéJuridique ORDER BY numéroFinessEntitéJuridique')
    expect(entitésJuridiquesQuery.rows).toStrictEqual([
      {
        adresseacheminement: '01117 OYONNAX CEDEX',
        adressenumérovoie: '1',
        adressetypevoie: 'RTE',
        adressevoie: 'DE VEYZIAT',
        libelléstatutjuridique: 'Etablissement Public Intercommunal dHospitalisation',
        numérofinessentitéjuridique: '010018407',
        raisonsociale: 'CH DU HAUT BUGEY',
        téléphone: '0102030406',
      },
      {
        adresseacheminement: '59650 VILLENEUVE D ASCQ',
        adressenumérovoie: '20',
        adressetypevoie: 'AV',
        adressevoie: 'DE LA RECONNAISSANCE',
        libelléstatutjuridique: 'Société Anonyme (S.A.)',
        numérofinessentitéjuridique: '590001741',
        raisonsociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        téléphone: '0102030405',
      },
    ])
  })
})
