import { Repository } from "typeorm";

import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { DomaineÉtablissementTerritorial } from "../../../métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { clearAllTables, getOrm, numéroFinessEntitéJuridique } from "../../../testHelper";
import { TypeOrmÉtablissementTerritorialRattachéLoader } from "./TypeOrmÉtablissementTerritorialRattachéLoader";

describe("Établissement territorial rattaché loader", () => {
  const orm = getOrm();
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;

  beforeAll(async () => {
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
  });

  beforeEach(async () => {
    await clearAllTables(await orm);
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("charge les établissements territoriaux rattachés à une entité juridique triés par domaine puis par numéro FINESS", async () => {
    // GIVEN
    const autreNuméroFinessEntitéJuridique = "987654322";
    const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
    const autreEntitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique });
    await entitéJuridiqueRepository.insert([entitéJuridiqueModel, autreEntitéJuridiqueModel]);

    const numéroFinessET1 = "222222222";
    const établissementTerritorial1RattachéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
      domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
      numéroFinessEntitéJuridique,
      numéroFinessÉtablissementTerritorial: numéroFinessET1,
      raisonSocialeCourte: "HP VILLENEUVE DASCQ",
    });
    const numéroFinessET2 = "111111111";
    const établissementTerritorial2RattachéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
      domaine: DomaineÉtablissementTerritorial.SANITAIRE,
      numéroFinessEntitéJuridique,
      numéroFinessÉtablissementTerritorial: numéroFinessET2,
      raisonSocialeCourte: "CH NANTUA",
    });
    const numéroFinessET3 = "999999999";
    const établissementTerritorial3RattachéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
      domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
      numéroFinessEntitéJuridique,
      numéroFinessÉtablissementTerritorial: numéroFinessET3,
      raisonSocialeCourte: "CH NANTUA v2",
    });
    const établissementTerritorialNonRattachéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
      numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique,
      numéroFinessÉtablissementTerritorial: "321654987",
    });
    await établissementTerritorialRepository.insert([
      établissementTerritorial1RattachéModel,
      établissementTerritorial2RattachéModel,
      établissementTerritorialNonRattachéModel,
      établissementTerritorial3RattachéModel,
    ]);

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialRattachéLoader(orm);

    // WHEN
    const établissementsTerritoriaux = await typeOrmÉtablissementTerritorialLoader.chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(
      numéroFinessEntitéJuridique
    );

    // THEN
    const établissementsTerritoriauxAttendus: ÉtablissementTerritorialRattaché[] = [
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: numéroFinessET1,
        raisonSocialeCourte: "HP VILLENEUVE DASCQ",
      },
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: numéroFinessET3,
        raisonSocialeCourte: "CH NANTUA v2",
      },
      {
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        numéroFiness: numéroFinessET2,
        raisonSocialeCourte: "CH NANTUA",
      },
    ];
    expect(établissementsTerritoriaux).toStrictEqual(établissementsTerritoriauxAttendus);
  });

  it("renvoie une liste vide quand aucun établissement n’est rattaché à une entité juridique", async () => {
    // GIVEN
    const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel);

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialRattachéLoader(orm);

    // WHEN
    const établissementsTerritoriaux = await typeOrmÉtablissementTerritorialLoader.chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(
      numéroFinessEntitéJuridique
    );

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual([]);
  });
});
