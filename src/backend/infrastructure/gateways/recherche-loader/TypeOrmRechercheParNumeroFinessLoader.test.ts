import { Repository } from "typeorm";

import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { clearAllTables, getOrm } from "../../../testHelper";
import { TypeOrmRechercheLoader } from "./TypeOrmRechercheLoader";

describe("La recherche d’entités et d’établissements par numéro finess", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;

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

  it("retourne les résultat avec pour des entités juridiques et térritoriales", async () => {
    // GIVEN
    const raisonSociale = `Raison sociale`;
    const finessJuridique = "finessJur";
    const finessTerritorial = "finessTer"
    await entitéJuridiqueRepository.save(
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: finessJuridique,
        raisonSocialeCourte: `${raisonSociale} - Juridique`,
      }));

    await établissementTerritorialRepository.save(
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: finessJuridique,
        numéroFinessÉtablissementTerritorial: finessTerritorial,
        raisonSocialeCourte: `${raisonSociale} - territorial`,
      }));

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const resultat = await typeOrmRechercheLoader.rechercheParNumeroFiness([finessJuridique, finessTerritorial]);

    // THEN
    expect(resultat).toHaveLength(2);
    const resultatFiness = resultat.map((etablissement) => etablissement.numéroFiness);
    expect(resultatFiness).toEqual(expect.arrayContaining([finessJuridique, finessTerritorial]));
  });

  it("ne retourne que les résultats demandés", async () => {
    // GIVEN
    const raisonSociale = `Raison sociale`;
    const finessJuridique = "finessJur";
    const finessTerritorial = "finessTer"
    await entitéJuridiqueRepository.insert([
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: finessJuridique,
        raisonSocialeCourte: `${raisonSociale} - Juridique`,
      }),
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: "notAsked",
        raisonSocialeCourte: `${raisonSociale} - Juridique`,
      })
    ]);

    await établissementTerritorialRepository.save(
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: finessJuridique,
        numéroFinessÉtablissementTerritorial: finessTerritorial,
        raisonSocialeCourte: `${raisonSociale} - territorial`,
      }));

    const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

    // WHEN
    const resultat = await typeOrmRechercheLoader.rechercheParNumeroFiness([finessJuridique, finessTerritorial]);

    // THEN
    expect(resultat).toHaveLength(2);
    const resultatFiness = resultat.map((etablissement) => etablissement.numéroFiness);
    expect(resultatFiness).toEqual(expect.arrayContaining([finessJuridique, finessTerritorial]));
  });

});