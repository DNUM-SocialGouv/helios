import { Repository } from "typeorm";

import { ActivitéSanitaireEntitéJuridiqueModel } from "../../../../../database/models/ActivitéSanitaireEntitéJuridiqueModel";
import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "../../../../../database/models/BudgetEtFinancesEntiteJuridiqueModel";
import { CapacitesSanitaireEntiteJuridiqueModel } from "../../../../../database/models/CapacitesSanitaireEntiteJuridiqueModel";
import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { DateMiseÀJourFichierSourceModelTestBuilder } from "../../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { EntitéJuridiqueAutorisationEtCapacité } from "../../../métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "../../../métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EntitéJuridiqueNonTrouvée } from "../../../métier/entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";
import { EntitéJuridiqueTestBuilder } from "../../../test-builder/EntitéJuridiqueTestBuilder";
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from "../../../testHelper";
import { TypeOrmEntitéJuridiqueLoader } from "./TypeOrmEntitéJuridiqueLoader";

describe("Entité juridique loader", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let entitéJuridiqueActivitésRepository: Repository<ActivitéSanitaireEntitéJuridiqueModel>;
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>;
  let budgetFinanceEntiteJuridiqueRepository: Repository<BudgetEtFinancesEntiteJuridiqueModel>;
  let capacitéSanitaireRepository: Repository<CapacitesSanitaireEntiteJuridiqueModel>;
  let etablissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let autorisationsActivitesRepository: Repository<AutorisationSanitaireModel>;

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    entitéJuridiqueActivitésRepository = (await orm).getRepository(ActivitéSanitaireEntitéJuridiqueModel);
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel);
    budgetFinanceEntiteJuridiqueRepository = (await orm).getRepository(BudgetEtFinancesEntiteJuridiqueModel);
    capacitéSanitaireRepository = (await orm).getRepository(CapacitesSanitaireEntiteJuridiqueModel);
    etablissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    autorisationsActivitesRepository = (await orm).getRepository(AutorisationSanitaireModel);
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
      activites.nombreSéjoursHad = 12;

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
          nombreSéjoursHad: {
            dateMiseÀJourSource: "2023-01-01",
            value: 12,
          },
        },
      ]);
    });
  });

  describe("charge les budget et finance d'une entite juridique", () => {
    it("charge les budget et finance par numero Finess EJ", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));

      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: "2023-01-14",
          fichier: FichierSource.DIAMANT_QUO_SAN_FINANCE,
        }),
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
      budgetFinanceEntiteJuridique.ratioDependanceFinanciere = 0.3;

      await budgetFinanceEntiteJuridiqueRepository.insert(budgetFinanceEntiteJuridique);

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

      // WHEN
      const budgetFinance = await typeOrmEntitéJuridiqueLoader.chargeBudgetFinance(numéroFinessEntitéJuridique);

      // THEN
      expect(budgetFinance).toStrictEqual([
        {
          année: 2022,
          dateMiseÀJourSource: "2023-01-14",
          depensesTitreIGlobal: -100,
          depensesTitreIIGlobal: -200,
          depensesTitreIIIGlobal: -300,
          depensesTitreIVGlobal: -400,
          totalDepensesGlobal: -1000,

          recettesTitreIGlobal: 100,
          recettesTitreIIGlobal: 200,
          recettesTitreIIIGlobal: 300,
          recettesTitreIVGlobal: 400,
          totalRecettesGlobal: 1000,

          depensesTitreIPrincipales: -10,
          depensesTitreIIPrincipales: -20,
          depensesTitreIIIPrincipales: -30,
          depensesTitreIVPrincipales: -40,
          totalDepensesPrincipales: -100,

          recettesTitreIPrincipales: 10,
          recettesTitreIIPrincipales: 20,
          recettesTitreIIIPrincipales: 30,
          totalRecettesPrincipales: 60,

          depensesTitreIAnnexe: -90,
          depensesTitreIIAnnexe: -180,
          depensesTitreIIIAnnexe: -270,
          depensesTitreIVAnnexe: -360,
          totalDepensesAnnexe: -900,

          recettesTitreIAnnexe: 90,
          recettesTitreIIAnnexe: 180,
          recettesTitreIIIAnnexe: 270,
          recettesTitreIVAnnexe: 400,
          totalRecettesAnnexe: 940,

          resultatNetComptable: 0.1,

          ratioDependanceFinanciere: 0.3,
        } as EntitéJuridiqueBudgetFinance,
      ]);
    });
  });

  describe("charge les capacités et autorisations d'une entité juridique", () => {
    it("charge les capacités d'une entité juridique", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: "2022-05-14",
          fichier: FichierSource.DIAMANT_ANN_SAE,
        }),
      ]);
      await capacitéSanitaireRepository.insert([
        EntitéJuridiqueModelTestBuilder.créeCapacitéSanitaireEntiteJuridique({
          année: 2021,
          numéroFinessEntitéJuridique,
        }),
        EntitéJuridiqueModelTestBuilder.créeCapacitéSanitaireEntiteJuridique({
          année: 2022,
          nombreDeLitsEnChirurgie: 10,
          numéroFinessEntitéJuridique,
        }),
      ]);
      const entiteJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);

      // WHEN
      const { capacités } = await entiteJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFinessEntitéJuridique);

      // THEN
      expect(capacités[0]).toStrictEqual<EntitéJuridiqueAutorisationEtCapacité["capacités"][0]>({
        année: 2021,
        dateMiseÀJourSource: "2022-05-14",
        nombreDeLitsEnChirurgie: 20,
        nombreDeLitsEnMédecine: 35,
        nombreDeLitsEnObstétrique: 12,
        nombreDeLitsEnSsr: 3,
        nombreDeLitsEnUsld: 15,
        nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 5,
        nombreDePlacesEnChirurgie: 25,
        nombreDePlacesEnMédecine: 40,
        nombreDePlacesEnObstétrique: 12,
        nombreDePlacesEnPsyHospitalisationPartielle: 13,
        nombreDePlacesEnSsr: 3,
      });
      expect(capacités[1]?.nombreDeLitsEnChirurgie).toBe(10);
    });

    describe("Autorisations Activites", () => {
      async function insertAutorisationActivités(numeroFinessEJ: string, numeroFinessET: string, autorisation: Partial<AutorisationSanitaireModel>) {
        await entitéJuridiqueRepository.upsert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: numeroFinessEJ }), [
          "numéroFinessEntitéJuridique",
        ]);
        await etablissementTerritorialRepository.insert(
          ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
            numéroFinessEntitéJuridique: numeroFinessEJ,
            numéroFinessÉtablissementTerritorial: numeroFinessET,
          })
        );
        await autorisationsActivitesRepository.insert(
          ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
            numéroFinessÉtablissementTerritorial: numeroFinessET,
            ...autorisation,
          })
        );
      }

      it("recuperer la liste des autorisations d'activités", async () => {
        // GIVEN
        await insertAutorisationActivités(numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial, { codeActivité: "1" });

        // WHEN
        const entiteJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);
        const { autorisationsActivités } = await entiteJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFinessEntitéJuridique);

        // THEN
        expect(autorisationsActivités).toHaveLength(1);
        expect(autorisationsActivités[0].codeActivité).toBe("1");
      });

      it("recuperer la liste des autorisations d'activités pour une entité juridique", async () => {
        // GIVEN
        await insertAutorisationActivités(numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial, {
          numéroAutorisationArhgos: "1",
          codeActivité: "1",
        });
        await insertAutorisationActivités("autre", "autre_et", { numéroAutorisationArhgos: "2", codeActivité: "2" });

        // WHEN
        const entiteJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);
        const { autorisationsActivités } = await entiteJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFinessEntitéJuridique);

        // THEN
        expect(autorisationsActivités).toHaveLength(1);
        expect(autorisationsActivités[0].codeActivité).toBe("1");
      });

      it("recuperer la liste des autorisations d'activités pour une entité juridique avec deux activites different", async () => {
        // GIVEN
        await insertAutorisationActivités(numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial, {
          numéroAutorisationArhgos: "1",
          codeActivité: "1",
        });
        await insertAutorisationActivités(numéroFinessEntitéJuridique, "autre_et", { numéroAutorisationArhgos: "2", codeActivité: "2" });

        // WHEN
        const entiteJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);
        const { autorisationsActivités } = await entiteJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFinessEntitéJuridique);

        // THEN
        expect(autorisationsActivités).toHaveLength(2);
        expect(autorisationsActivités[0].codeActivité).toBe("1");
        expect(autorisationsActivités[1].codeActivité).toBe("2");
      });

      it("recuperer la liste des autorisations d'activités grouper par Activité", async () => {
        // GIVEN
        await insertAutorisationActivités(numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial, {
          numéroAutorisationArhgos: "1",
          codeActivité: "1",
        });
        await insertAutorisationActivités(numéroFinessEntitéJuridique, "et_num_2", {
          numéroAutorisationArhgos: "3",
          codeActivité: "1",
        });

        // WHEN
        const entiteJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm);
        const { autorisationsActivités } = await entiteJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFinessEntitéJuridique);

        // THEN
        expect(autorisationsActivités).toHaveLength(1);
        expect(autorisationsActivités[0].codeActivité).toBe("1");
      });
    });
  });
});
