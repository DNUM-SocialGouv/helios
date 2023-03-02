import { Repository } from "typeorm";

import { ActivitéSanitaireEntitéJuridiqueModel } from "../../../../../database/models/ActivitéSanitaireEntitéJuridiqueModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "../../../../../database/models/BudgetEtFinancesEntiteJuridiqueModel";
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
  let entitéJuridiqueActivitésRepository: Repository<ActivitéSanitaireEntitéJuridiqueModel>;
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>;
  let budgetFinanceEntiteJuridiqueRepository: Repository<BudgetEtFinancesEntiteJuridiqueModel>;

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    entitéJuridiqueActivitésRepository = (await orm).getRepository(ActivitéSanitaireEntitéJuridiqueModel);
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel);
    budgetFinanceEntiteJuridiqueRepository = (await orm).getRepository(BudgetEtFinancesEntiteJuridiqueModel);
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
        EntitéJuridiqueTestBuilder.créeEntitéJuridiqueIdentité({
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

  describe("Charge les activités d’une entité juridique", () => {
    it("charge les activites par numéro FINESS", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      const activites = new ActivitéSanitaireEntitéJuridiqueModel();
      activites.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique;
      activites.année = 2021;
      activites.nombreJournéesCompletesSsr = 1;
      activites.nombreJournéesCompletesPsy = 2;
      activites.nombreJournéesPartiellesPsy = 3;
      activites.nombreJournéesPartiellesSsr = 4;
      activites.nombreSéjoursCompletsObstétrique = 5;
      activites.nombreSéjoursCompletsChirurgie = 6;
      activites.nombreSéjoursCompletsMédecine = 7;
      activites.nombreSéjoursPartielsMédecine = 8;
      activites.nombreSéjoursPartielsChirurgie = 9;
      activites.nombreSéjoursPartielsObstétrique = 10;
      activites.nombreDePassagesAuxUrgences = 11;

      await entitéJuridiqueActivitésRepository.insert(activites);
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: "2022-05-14",
          fichier: FichierSource.DIAMANT_ANN_RPU,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: "2023-01-01",
          fichier: FichierSource.DIAMANT_MEN_PMSI_ANNUEL,
        }),
      ]);

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

      // WHEN
      const entitéJuridiqueActivités = await typeOrmEntitéJuridiqueLoader.chargeActivités(numéroFinessEntitéJuridique);

      // THEN
      expect(entitéJuridiqueActivités).toStrictEqual([
        {
          année: 2021,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2022-05-14",
            value: 11,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: "2023-01-01",
            value: 1,
          },
          nombreJournéesCompletesPsy: {
            dateMiseÀJourSource: "2023-01-01",
            value: 2,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: "2023-01-01",
            value: 3,
          },
          nombreJournéesPartiellesSsr: {
            dateMiseÀJourSource: "2023-01-01",
            value: 4,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: "2023-01-01",
            value: 5,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: "2023-01-01",
            value: 6,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: "2023-01-01",
            value: 7,
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: "2023-01-01",
            value: 8,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: "2023-01-01",
            value: 9,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: "2023-01-01",
            value: 10,
          },
        },
      ]);
    });
  });

  describe("charge les budget et finance d'une entite juridique", () => {
    it("charge les budget et finance par numero Finess EJ", async () => {
      // GIVEN
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: "2022-05-14",
          fichier: FichierSource,
        })
      ]);

      const budgetFinanceEntiteJuridique = new BudgetEtFinancesEntiteJuridiqueModel();
      budgetFinanceEntiteJuridique.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique;
      budgetFinanceEntiteJuridique.année = 2022;
      budgetFinanceEntiteJuridique.depensesTitreIGlobal = -100;
      budgetFinanceEntiteJuridique.depensesTitreIIGlobal = -200;
      budgetFinanceEntiteJuridique.depensesTitreIIIGlobal = -300;
      budgetFinanceEntiteJuridique.depensesTitreIVGlobal = -400;
      budgetFinanceEntiteJuridique.recettesTitreIGlobal = 100;
      budgetFinanceEntiteJuridique.recettesTitreIIGlobal = 200;
      budgetFinanceEntiteJuridique.recettesTitreIIIGlobal = 300;
      budgetFinanceEntiteJuridique.recettesTitreIVGlobal = 400;
      budgetFinanceEntiteJuridique.depensesTitreIH = -10;
      budgetFinanceEntiteJuridique.depensesTitreIIH = -20;
      budgetFinanceEntiteJuridique.depensesTitreIIIH = -30;
      budgetFinanceEntiteJuridique.depensesTitreIVH = -40;
      budgetFinanceEntiteJuridique.recettesTitreIH = 10;
      budgetFinanceEntiteJuridique.recettesTitreIIH = 20;
      budgetFinanceEntiteJuridique.recettesTitreIIIH = 30;
      budgetFinanceEntiteJuridique.resultatNetComptableSan = 0.1;
      budgetFinanceEntiteJuridique.tauxDeCafNetteSan = 0.2;
      budgetFinanceEntiteJuridique.ratioDependeanceFinanciere = 0.3;

      await budgetFinanceEntiteJuridiqueRepository.insert(budgetFinanceEntiteJuridique)

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

      // WHEN
      const budgetFinance = await typeOrmEntitéJuridiqueLoader.chargeBudgetFinance(numéroFinessEntitéJuridique);

      // THEN
      expect(budgetFinance).toStrictEqual([
        {
          année: 2022,
          dateMiseÀJourSource:

        }
      ]);
    });
  });
});
