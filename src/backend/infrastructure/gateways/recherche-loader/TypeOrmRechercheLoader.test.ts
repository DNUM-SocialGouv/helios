import { Repository } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestBuilder } from '../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { RésultatDeRecherche } from '../../../métier/entities/RésultatDeRecherche'
import { getOrm, clearAllTables, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../../testHelper'
import { TypeOrmRechercheLoader } from './TypeOrmRechercheLoader'

describe('La recherche d’entités et d’établissements', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
  })

  afterEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('Par numéro FINESS', () => {
    it('retourne un résultat quand le numéro FINESS est une entité juridique connue', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche(numéroFinessEntitéJuridique)

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSociale: 'CH DU HAUT BUGEY',
          type: 'Entité juridique',
        },
      ])
    })

    it('retourne un résultat quand le numéro FINESS est un établissement territorial connu', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
        {
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessÉtablissementTerritorial,
          raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
          type: 'Sanitaire',
        },
      ])
    })

    it('ne retourne aucun résultat quand le numéro FINESS est inconnu', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
        {
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('999999999')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(0)
    })
  })

  describe('Par nom', () => {
    it('retourne un résultat quand le nom est un nom connu d’entité juridique', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSociale: 'CH DU HAUT BUGEY' })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('CH DU HAUT BUGEY')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSociale: 'CH DU HAUT BUGEY',
          type: 'Entité juridique',
        },
      ])
    })

    it('retourne un résultat quand le nom est un nom connu d’établissement territorial', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
        {
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
          raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('HOPITAL PRIVE DE VILLENEUVE DASCQ')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessÉtablissementTerritorial,
          raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
          type: 'Sanitaire',
        },
      ])

    })

    it('retourne un résultat quand le nom est un nom connu sans prendre en compte la casse', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSociale: 'CH DU HAUT BUGEY' })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('bugey')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSociale: 'CH DU HAUT BUGEY',
          type: 'Entité juridique',
        },
      ])
    })

    it('retourne un résultat quand le nom est un nom connu sans prendre en compte les accents', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSociale: 'RÉSIDENCE LE PARC DU MANOIR' })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('residence')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSociale: 'RÉSIDENCE LE PARC DU MANOIR',
          type: 'Entité juridique',
        },
      ])
    })

    it('retourne un résultat quand le nom est un nom connu sans prendre en compte les tirets', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSociale: 'EHPAD SAINT-TRIVIER-DE-COURTES' })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('saint trivier courtes')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSociale: 'EHPAD SAINT-TRIVIER-DE-COURTES',
          type: 'Entité juridique',
        },
      ])
    })

    it('retourne un résultat quand le nom est un nom connu sans prendre en compte les apostrophes', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSociale: "SAAD DOMITYS L'ARBRE D'OR" })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche('l arbre d or')

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1)
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
        {
          commune: 'LE PLESSIS ROBINSON',
          département: 'HAUTS DE SEINE',
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSociale: "SAAD DOMITYS L'ARBRE D'OR",
          type: 'Entité juridique',
        },
      ])
    })
  })

  it('retourne un maximum de 12 résultats', async () => {
    // GIVEN
    await entitéJuridiqueRepository.insert([
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '000000000', raisonSociale: 'hopital de 000000000' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '111111111', raisonSociale: 'hopital de 111111111' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '222222222', raisonSociale: 'hopital de 222222222' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '333333333', raisonSociale: 'hopital de 333333333' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '444444444', raisonSociale: 'hopital de 444444444' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '555555555', raisonSociale: 'hopital de 555555555' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '666666666', raisonSociale: 'hopital de 666666666' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '777777777', raisonSociale: 'hopital de 777777777' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '888888888', raisonSociale: 'hopital de 888888888' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '999999999', raisonSociale: 'hopital de 999999999' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '101010101', raisonSociale: 'hopital de 101010101' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '110110110', raisonSociale: 'hopital de 110110110' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '121212121', raisonSociale: 'hopital de 121212121' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '131313131', raisonSociale: 'hopital de 131313131' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '141414141', raisonSociale: 'hopital de 141414141' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '151515151', raisonSociale: 'hopital de 151515151' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '161616161', raisonSociale: 'hopital de 161616161' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '171717171', raisonSociale: 'hopital de 171717171' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '181818181', raisonSociale: 'hopital de 181818181' }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: '191919191', raisonSociale: 'hopital de 191919191' }),
    ])

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm)

    // WHEN
    const recherche = await typeOrmRechercheLoader.recherche('hopital')

    // THEN
    expect(recherche.nombreDeRésultats).toBe(12)
    expect(recherche.résultats).toStrictEqual<RésultatDeRecherche['résultats']>([
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '000000000',
        raisonSociale: 'hopital de 000000000',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '111111111',
        raisonSociale: 'hopital de 111111111',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '222222222',
        raisonSociale: 'hopital de 222222222',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '333333333',
        raisonSociale: 'hopital de 333333333',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '444444444',
        raisonSociale: 'hopital de 444444444',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '555555555',
        raisonSociale: 'hopital de 555555555',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '666666666',
        raisonSociale: 'hopital de 666666666',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '777777777',
        raisonSociale: 'hopital de 777777777',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '888888888',
        raisonSociale: 'hopital de 888888888',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '999999999',
        raisonSociale: 'hopital de 999999999',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '101010101',
        raisonSociale: 'hopital de 101010101',
        type: 'Entité juridique',
      },
      {
        commune: 'LE PLESSIS ROBINSON',
        département: 'HAUTS DE SEINE',
        numéroFiness: '110110110',
        raisonSociale: 'hopital de 110110110',
        type: 'Entité juridique',
      },
    ])
  })
})
