import { Repository } from "typeorm";

import { TypeOrmRechercheLoader } from "./TypeOrmRechercheLoader";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { RésultatDeRecherche } from "../../../métier/entities/RésultatDeRecherche";
import { RésultatDeRechercheTestBuilder } from "../../../test-builder/RésultatDeRechercheTestBuilder";
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from "../../../testHelper";

describe("La recherche d’entités et d’établissements", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  const premièrePage = 1;

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
  });

  beforeEach(async () => {
    await clearAllTables(await orm);
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("résiste à des tentatives d’injection SQL", async () => {
    // GIVEN
    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const recherche = await typeOrmRechercheLoader.recherche("''));DROP ALL TABLE;--", premièrePage);

    // THEN
    expect(recherche).toStrictEqual<RésultatDeRecherche>({
      nombreDeRésultats: 0,
      résultats: [],
    });
  });

  it("retourne les résultats triés par pertinence, par type puis par numéro FINESS", async () => {
    // GIVEN
    const termeRecherché = "helios";
    const raisonSocialeEJ = `${termeRecherché} plus un autre truc`;
    await entitéJuridiqueRepository.insert([
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: "000000000",
        raisonSocialeCourte: `${raisonSocialeEJ} - entité juridique très pertinente`,
      }),
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: "000000001",
        raisonSocialeCourte: `${termeRecherché} - entité juridique pertinente`,
      }),
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: "000000002",
        raisonSocialeCourte: `${termeRecherché} - entité juridique pertinente`,
      }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "999999999", raisonSocialeCourte: "entité juridique non pertinente" }),
    ]);

    await établissementTerritorialRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "100000000",
        raisonSocialeCourte: `${termeRecherché} - établissement territorial sanitaire pertinent`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "000000001",
        numéroFinessÉtablissementTerritorial: "100000001",
        raisonSocialeCourte: `${termeRecherché} - établissement territorial sanitaire pertinent`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "999999999",
        numéroFinessÉtablissementTerritorial: "199999999",
        raisonSocialeCourte: "établissement territorial sanitaire non pertinent",
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "200000000",
        raisonSocialeCourte: `${termeRecherché} - établissement territorial médico-social pertinent`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000001",
        numéroFinessÉtablissementTerritorial: "200000001",
        raisonSocialeCourte: `${raisonSocialeEJ} ${termeRecherché} - entité juridique très pertinente`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "999999999",
        numéroFinessÉtablissementTerritorial: "299999999",
        raisonSocialeCourte: "établissement territorial médico-social non pertinent",
      }),
    ]);

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const recherche = await typeOrmRechercheLoader.recherche(termeRecherché, premièrePage);

    // THEN
    expect(recherche).toStrictEqual<RésultatDeRecherche>({
      nombreDeRésultats: 7,
      résultats: [
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          commune: "NANTUA",
          numéroFiness: "200000001",
          raisonSocialeCourte: `${raisonSocialeEJ} ${termeRecherché} - entité juridique très pertinente`,
          type: "Médico-social",
          rattachement: "000000001",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "000000000",
          raisonSocialeCourte: `${raisonSocialeEJ} - entité juridique très pertinente`,
          rattachement: "",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "000000001",
          raisonSocialeCourte: `${termeRecherché} - entité juridique pertinente`,
          rattachement: "",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "000000002",
          raisonSocialeCourte: `${termeRecherché} - entité juridique pertinente`,
          rattachement: "",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          commune: "NANTUA",
          numéroFiness: "200000000",
          raisonSocialeCourte: `${termeRecherché} - établissement territorial médico-social pertinent`,
          type: "Médico-social",
          rattachement: "000000000",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          commune: "VILLENEUVE D ASCQ",
          département: "NORD",
          numéroFiness: "100000000",
          raisonSocialeCourte: `${termeRecherché} - établissement territorial sanitaire pertinent`,
          type: "Sanitaire",
          rattachement: "000000000",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          commune: "VILLENEUVE D ASCQ",
          département: "NORD",
          numéroFiness: "100000001",
          raisonSocialeCourte: `${termeRecherché} - établissement territorial sanitaire pertinent`,
          type: "Sanitaire",
          rattachement: "000000001",
        }),
      ],
    });
  });

  it("pour un même score de pertinence, privilégie les entités juridiques aux établissements territoriaux", async () => {
    // GIVEN
    await entitéJuridiqueRepository.insert([
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000000", raisonSocialeCourte: "hopital entité juridique 000000000" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "111111111", raisonSocialeCourte: "hopital entité juridique 111111111" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "222222222", raisonSocialeCourte: "hopital entité juridique 222222222" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "333333333", raisonSocialeCourte: "hopital entité juridique 333333333" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "444444444", raisonSocialeCourte: "hopital entité juridique 444444444" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "555555555", raisonSocialeCourte: "hopital entité juridique 555555555" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "666666666", raisonSocialeCourte: "hopital entité juridique 666666666" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "777777777", raisonSocialeCourte: "hopital entité juridique 777777777" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "888888888", raisonSocialeCourte: "hopital entité juridique 888888888" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "999999999", raisonSocialeCourte: "hopital entité juridique 999999999" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "101010101", raisonSocialeCourte: "hopital entité juridique 101010101" }),
      EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "110110110", raisonSocialeCourte: "hopital entité juridique 110110110" }),
    ]);
    await établissementTerritorialRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial,
        raisonSociale: "hopital établissement territorial 000000000",
        raisonSocialeCourte: "établissement territorial 000000000",
      }),
    ]);

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const recherche = await typeOrmRechercheLoader.recherche("hopital", premièrePage);

    // THEN
    expect(recherche).toStrictEqual<RésultatDeRecherche>({
      nombreDeRésultats: 13,
      résultats: [
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "000000000",
          raisonSocialeCourte: "hopital entité juridique 000000000",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "101010101",
          raisonSocialeCourte: "hopital entité juridique 101010101",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "110110110",
          raisonSocialeCourte: "hopital entité juridique 110110110",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "111111111",
          raisonSocialeCourte: "hopital entité juridique 111111111",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "222222222",
          raisonSocialeCourte: "hopital entité juridique 222222222",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "333333333",
          raisonSocialeCourte: "hopital entité juridique 333333333",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "444444444",
          raisonSocialeCourte: "hopital entité juridique 444444444",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "555555555",
          raisonSocialeCourte: "hopital entité juridique 555555555",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "666666666",
          raisonSocialeCourte: "hopital entité juridique 666666666",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "777777777",
          raisonSocialeCourte: "hopital entité juridique 777777777",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "888888888",
          raisonSocialeCourte: "hopital entité juridique 888888888",
        }),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: "999999999",
          raisonSocialeCourte: "hopital entité juridique 999999999",
        }),
      ],
    });
  });

  it("retourne des résultats même s’il y a des espaces dans la recherche demandée", async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = "010 018 407";
    const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée();
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const recherche = await typeOrmRechercheLoader.recherche(numéroFinessEntitéJuridique, premièrePage);

    // THEN
    expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
      {
        commune: "OYONNAX",
        département: "AIN",
        numéroFiness: numéroFinessEntitéJuridique.replaceAll(" ", ""),
        raisonSocialeCourte: "CH DU HAUT BUGEY",
        type: "Entité juridique",
        rattachement: "",
      },
    ]);
  });

  it("retourne des résultats même s’il y a des tirets dans la recherche demandée", async () => {
    // GIVEN
    const raisonSocialeAvecDesTirets = "CENTRE-HOSPITALIER-DU-HAUT-BUGEY";
    const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée();
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const recherche = await typeOrmRechercheLoader.recherche(raisonSocialeAvecDesTirets, premièrePage);

    // THEN
    expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
      {
        commune: "OYONNAX",
        département: "AIN",
        numéroFiness: "010018407",
        raisonSocialeCourte: "CH DU HAUT BUGEY",
        type: "Entité juridique",
        rattachement: "",
      },
    ]);
  });

  describe("Par numéro FINESS", () => {
    it("retourne un résultat quand le numéro FINESS est une entité juridique connue", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche(numéroFinessEntitéJuridique, premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: numéroFinessEntitéJuridique }),
      ]);
    });

    it("retourne un résultat quand le numéro FINESS est un établissement territorial connu", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche(numéroFinessÉtablissementTerritorial, premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: numéroFinessÉtablissementTerritorial }),
      ]);
    });

    it("ne retourne aucun résultat quand le numéro FINESS est inconnu", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("999999999", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(0);
    });
  });

  describe("Par nom", () => {
    it("retourne un résultat quand le nom est un nom connu d’entité juridique", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSocialeCourte: "CENTRE HOSPITALIER DU HAUT BUGEY" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("CENTRE HOSPITALIER DU HAUT BUGEY", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        {
          commune: "OYONNAX",
          département: "AIN",
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "CENTRE HOSPITALIER DU HAUT BUGEY",
          type: "Entité juridique",
          rattachement: "",
        },
      ]);
    });

    it("retourne un résultat quand le nom est un nom connu d’établissement territorial", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
        raisonSocialeCourte: "HP VILLENEUVE DASCQ",
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("HOPITAL PRIVE DE VILLENEUVE DASCQ", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: numéroFinessÉtablissementTerritorial }),
      ]);
    });

    it("retourne un résultat quand le nom est un nom connu sans prendre en compte la casse", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSocialeCourte: "CH DU HAUT BUGEY" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("bugey", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: numéroFinessEntitéJuridique }),
      ]);
    });

    it("retourne un résultat quand le nom est un nom connu sans prendre en compte les accents", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSocialeCourte: "RÉSIDENCE LE PARC DU MANOIR" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("residence", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "RÉSIDENCE LE PARC DU MANOIR",
        }),
      ]);
    });

    it("retourne un résultat quand le nom est un nom connu sans prendre en compte les tirets", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSocialeCourte: "EHPAD SAINT-TRIVIER-DE-COURTES" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("saint trivier courtes", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "EHPAD SAINT-TRIVIER-DE-COURTES",
        }),
      ]);
    });

    it("retourne un résultat quand le nom est un nom connu sans prendre en compte les apostrophes", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ raisonSocialeCourte: "SAAD DOMITYS L'ARBRE D'OR" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("l'arbre d or", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "SAAD DOMITYS L'ARBRE D'OR",
        }),
      ]);
    });

    it("retourne un résultat quand le nom est un nom court connu", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({
        raisonSociale: "CENTRE HOSPITALIER SAINT JEAN",
        raisonSocialeCourte: "CH ST JEAN",
      });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("ch", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "CH ST JEAN",
        }),
      ]);
    });
  });

  describe("Par département", () => {
    it("retourne un résultat quand le département de l’entité juridique est connu, sans faire attention aux accents, tirets, apostrophes ni casse", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ département: "PUY-DE-DOME" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("Puy de Dôme", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        {
          commune: "OYONNAX",
          département: "PUY-DE-DOME",
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "CH DU HAUT BUGEY",
          type: "Entité juridique",
          rattachement: "",
        },
      ]);
    });

    it("retourne un résultat quand le département de l’établissement territorial est connu, sans faire attention aux accents, tirets, apostrophes ni casse", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        département: "PUY-DE-DOME",
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("Puy de Dôme", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({
          département: "PUY-DE-DOME",
          numéroFiness: numéroFinessÉtablissementTerritorial,
        }),
      ]);
    });
  });

  describe("Par commune", () => {
    it("retourne un résultat quand la commune de l’entité juridique est connue, sans faire attention aux accents, tirets, apostrophes ni casse", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ commune: "SAINT-ETIENNE-DU-GUE-DE-L'ISLE" });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("Saint Étienne du Gué de l Isle", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        {
          commune: "SAINT-ETIENNE-DU-GUE-DE-L'ISLE",
          département: "AIN",
          numéroFiness: numéroFinessEntitéJuridique,
          raisonSocialeCourte: "CH DU HAUT BUGEY",
          type: "Entité juridique",
          rattachement: "",
        },
      ]);
    });

    it("retourne un résultat quand la commune de l’établissement territorial est connue, sans faire attention aux accents, tirets, apostrophes ni casse", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        commune: "SAINT-JOUAN-DE-L'ISLE",
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("Saint Jouan de l Isle", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({
          commune: "SAINT-JOUAN-DE-L'ISLE",
          numéroFiness: numéroFinessÉtablissementTerritorial,
        }),
      ]);
    });
  });

  describe("Par catégorie d’établissement", () => {
    it("retourne un résultat quand le libellé de la catégorie de l’établissement territorial est connu", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        libelléCatégorieÉtablissement: "Etablissement de santé privé autorisé en SSR",
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("etablissement privé ssr", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: numéroFinessÉtablissementTerritorial }),
      ]);
    });

    it("retourne un résultat quand le libellé court de la catégorie de l’établissement territorial est connu", async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        libelléCourtCatégorieÉtablissement: "Soins suite réadap",
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      });
      await établissementTerritorialRepository.insert(établissementTerritorialModel);

      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("soin suite readap", premièrePage);

      // THEN
      expect(recherche.nombreDeRésultats).toBe(1);
      expect(recherche.résultats).toStrictEqual<RésultatDeRecherche["résultats"]>([
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: numéroFinessÉtablissementTerritorial }),
      ]);
    });
  });

  describe("pagine les résultats lorsque la recherche renvoie plus de 12 résultats", () => {
    beforeEach(async () => {
      await entitéJuridiqueRepository.insert([
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000000", raisonSocialeCourte: "hopital 000000000" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000001", raisonSocialeCourte: "hopital 000000001" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000002", raisonSocialeCourte: "hopital 000000002" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000003", raisonSocialeCourte: "hopital 000000003" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000004", raisonSocialeCourte: "hopital 000000004" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000005", raisonSocialeCourte: "hopital 000000005" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000006", raisonSocialeCourte: "hopital 000000006" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000007", raisonSocialeCourte: "hopital 000000007" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000008", raisonSocialeCourte: "hopital 000000008" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000009", raisonSocialeCourte: "hopital 000000009" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000010", raisonSocialeCourte: "hopital 000000010" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000011", raisonSocialeCourte: "hopital 000000011" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000012", raisonSocialeCourte: "hopital 000000012" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000013", raisonSocialeCourte: "hopital 000000013" }),
        EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "000000014", raisonSocialeCourte: "hopital 000000014" }),
      ]);
    });

    it("la première page retourne les 12 premiers éléments quand 15 sont renvoyés par la recherche", async () => {
      // GIVEN
      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("hopital", premièrePage);

      // THEN
      expect(recherche).toStrictEqual<RésultatDeRecherche>({
        nombreDeRésultats: 15,
        résultats: [
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000000",
            raisonSocialeCourte: "hopital 000000000",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000001",
            raisonSocialeCourte: "hopital 000000001",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000002",
            raisonSocialeCourte: "hopital 000000002",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000003",
            raisonSocialeCourte: "hopital 000000003",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000004",
            raisonSocialeCourte: "hopital 000000004",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000005",
            raisonSocialeCourte: "hopital 000000005",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000006",
            raisonSocialeCourte: "hopital 000000006",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000007",
            raisonSocialeCourte: "hopital 000000007",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000008",
            raisonSocialeCourte: "hopital 000000008",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000009",
            raisonSocialeCourte: "hopital 000000009",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000010",
            raisonSocialeCourte: "hopital 000000010",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000011",
            raisonSocialeCourte: "hopital 000000011",
          }),
        ],
      });
    });

    it("la deuxième page retourne les 3 éléments restants quand 15 sont renvoyés par la recherche", async () => {
      // GIVEN
      const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);
      const pageSuivante = premièrePage + 1;

      // WHEN
      const recherche = await typeOrmRechercheLoader.recherche("hopital", pageSuivante);

      // THEN
      expect(recherche).toStrictEqual<RésultatDeRecherche>({
        nombreDeRésultats: 15,
        résultats: [
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000012",
            raisonSocialeCourte: "hopital 000000012",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000013",
            raisonSocialeCourte: "hopital 000000013",
          }),
          RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
            numéroFiness: "000000014",
            raisonSocialeCourte: "hopital 000000014",
          }),
        ],
      });
    });
  });
});