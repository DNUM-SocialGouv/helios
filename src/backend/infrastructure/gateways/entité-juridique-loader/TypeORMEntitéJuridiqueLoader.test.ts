import { Repository } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { DateMiseÀJourFichierSourceModelTestBuilder } from "../../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { EntitéJuridiqueNonTrouvée } from "../../../métier/entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";
import { EntitéJuridiqueTestBuilder } from "../../../test-builder/EntitéJuridiqueTestBuilder";
import { clearAllTables, getOrm, numéroFinessEntitéJuridique } from "../../../testHelper";
import { TypeOrmEntitéJuridiqueLoader } from "./TypeOrmEntitéJuridiqueLoader";

describe("Entité juridique loader", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>;

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel);
  });

  beforeEach(async () => {
    await clearAllTables(await orm);
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  describe("Charge l’identité d’une entité juridique", () => {
    it("charge par numéro FINESS", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: "2022-05-14",
          fichier: FichierSource.FINESS_CS1400101,
        }),
      ]);
      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

      // WHEN
      const entitéJuridique = await typeOrmEntitéJuridiqueLoader.chargeIdentité(numéroFinessEntitéJuridique);

      // THEN
      expect(entitéJuridique).toStrictEqual(
        EntitéJuridiqueTestBuilder.créeEntitéJuridique({
          numéroFinessEntitéJuridique: {
            dateMiseÀJourSource: "2022-05-14",
            value: numéroFinessEntitéJuridique,
          },
        })
      );
    });

    it("signale que l’entité juridique n’a pas été trouvée quand celle-ci n’existe pas", async () => {
      // GIVEN
      const fakeNuméroFiness = "123456789";
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: fakeNuméroFiness }));
      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

      // WHEN
      const exception = await typeOrmEntitéJuridiqueLoader.chargeIdentité(numéroFinessEntitéJuridique);

      // THEN
      expect(exception).toStrictEqual(new EntitéJuridiqueNonTrouvée(numéroFinessEntitéJuridique));
    });
  });

  it("charge l’entité juridique de rattachement par numéro FINESS", async () => {
    // GIVEN
    await entitéJuridiqueRepository.insert(
      EntitéJuridiqueModelTestBuilder.crée({
        libelléStatutJuridique: "fake libellé statut juridique",
        raisonSocialeCourte: "fake raison sociale courte",
      })
    );
    await dateMiseÀJourFichierSourceRepository.insert([
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: "2022-05-14",
        fichier: FichierSource.FINESS_CS1400101,
      }),
    ]);
    const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

    // WHEN
    const entitéJuridique = await typeOrmEntitéJuridiqueLoader.chargeRattachement(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique).toStrictEqual<EntitéJuridiqueDeRattachement>({
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseÀJourSource: "2022-05-14",
        value: "fake raison sociale courte",
      },
      statutJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: "fake libellé statut juridique",
      },
    });
  });
});
