import { mock } from "jest-mock-extended";

import { RécupèreLEntitéJuridiqueUseCase } from "./RécupèreLEntitéJuridiqueUseCase";
import { AutorisationSanitaireModel } from "../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../database/models/AutreActivitéSanitaireModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { EntitéJuridiqueTestBuilder } from "../../test-builder/EntitéJuridiqueTestBuilder";
import { numéroFinessEntitéJuridique } from "../../testHelper";
import {
  CapacitéSanitaireEntitéJuridique,
  EntitéJuridiqueAutorisationEtCapacitéLoader,
} from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

describe("La récupération d’une entité juridique", () => {
  let entiteJuridiqueLoaderMock: EntitéJuridiqueLoader;

  beforeEach(() => {
    entiteJuridiqueLoaderMock = mock<EntitéJuridiqueLoader>({
      chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
        numéroFinessEntitéJuridique: "",
        capacités: [],
        autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
      } as EntitéJuridiqueAutorisationEtCapacitéLoader),
    });
  });

  it("récupère la fiche identité de l’entité juridique", async () => {
    // GIVEN
    const entitéJuridiqueIdentité = EntitéJuridiqueTestBuilder.créeEntitéJuridiqueIdentité({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
    });
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(entitéJuridiqueIdentité);
    entiteJuridiqueLoaderMock.chargeIdentité = mockedChargeParNuméroFiness;
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(ficheIdentitéRécupérée.adresseAcheminement).toEqual(entitéJuridiqueIdentité.adresseAcheminement);
    expect(ficheIdentitéRécupérée.adresseNuméroVoie).toEqual(entitéJuridiqueIdentité.adresseNuméroVoie);
    expect(ficheIdentitéRécupérée.adresseVoie).toEqual(entitéJuridiqueIdentité.adresseVoie);
    expect(ficheIdentitéRécupérée.catégorisation).toEqual(entitéJuridiqueIdentité.catégorisation);
    expect(ficheIdentitéRécupérée.libelléStatutJuridique).toEqual(entitéJuridiqueIdentité.libelléStatutJuridique);
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessEntitéJuridique);
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1);
  });

  it("signale une alerte si l’entité juridique liée au numéro FINESS n’est pas trouvée", async () => {
    // GIVEN
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(new EntitéJuridiqueNonTrouvée(numéroFinessEntitéJuridique));
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeIdentité: mockedChargeParNuméroFiness,
    });
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

    // WHEN
    try {
      await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);
      throw new Error("Une alerte d’entité juridique non trouvée aurait dû être levée");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] L’entité juridique ${numéroFinessEntitéJuridique} n’a pas été trouvée`);
    }
  });

  it("récupère toutes les activités agrégées de Entité Juridique", async () => {
    // GIVEN
    const mockActivités = {
      année: 2022,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: "2020-10-01",
        value: 10,
      },
    };

    const mockChargeActivités = jest.fn().mockResolvedValue(mockActivités);
    entiteJuridiqueLoaderMock.chargeActivités = mockChargeActivités;
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.activités).toStrictEqual(mockActivités);
  });

  it("récupère toutes les activités mensuelles agrégées de Entité Juridique", async () => {
    // GIVEN
    const mockActivitésMensuelles = {
      dateDeMiseAJour: "2024-11-05",
      activitesSanitaireMensuelList: []
    }

    const mockChargeActivités = jest.fn().mockResolvedValue(mockActivitésMensuelles);
    entiteJuridiqueLoaderMock.chargeActivitésMensuel = mockChargeActivités;
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.activitésMensuels).toStrictEqual(mockActivitésMensuelles);
  });

  it("récupère toutes les budget et finance pour un Entité Juridique", async () => {
    // GIVEN
    const mockBudgetFinance = {
      année: 2022,
      dateMiseÀJourSource: "2022-12-12",

      depensesTitreIIIPrincipale: -270,
      depensesTitreIIPrincipale: -180,
      depensesTitreIPrincipale: -90,
      depensesTitreIVPrincipale: -360,
      totalDepensesPrincipale: -900,

      recettesTitreIIIPrincipale: 270,
      recettesTitreIIPrincipale: 180,
      recettesTitreIPrincipale: 90,
      recettesTitreIVPrincipale: 360,
      totalRecettesPrincipale: 900,

      recettesTitreIGlobal: 100,
      recettesTitreIIGlobal: 200,
      recettesTitreIIIGlobal: 300,
      recettesTitreIVGlobal: 400,
      totalRecettesGlobal: 1000,

      depensesTitreIGlobal: -100,
      depensesTitreIIGlobal: -200,
      depensesTitreIIIGlobal: -300,
      depensesTitreIVGlobal: -400,
      totalDepensesGlobal: -1000,

      recettesTitreIH: 10,
      recettesTitreIIH: 20,
      recettesTitreIIIH: 30,
      totalRecettesH: 60,

      depensesTitreIH: -10,
      depensesTitreIIH: -20,
      depensesTitreIIIH: -30,
      depensesTitreIVH: -40,
      totalDepensesH: -100,
    };

    const mockChargeBudgetFinance = jest.fn().mockResolvedValue(mockBudgetFinance);
    entiteJuridiqueLoaderMock.chargeBudgetFinance = mockChargeBudgetFinance;
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.budgetFinance).toStrictEqual(mockBudgetFinance);
  });

  it("récupère toutes les autorisations et capacités", async () => {
    // GIVEN
    const mockCapacités: CapacitéSanitaireEntitéJuridique[] = [
      {
        année: 2022,
        dateMiseÀJourSource: "2022-12-12",
        nombreDeLitsEnChirurgie: 1,
        nombreDeLitsEnMédecine: 1,
        nombreDeLitsEnObstétrique: 1,
        nombreDeLitsEnSsr: 1,
        nombreDeLitsEnUsld: 1,
        nombreDePlacesEnPsyHospitalisationPartielle: 1,
        nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 1,
        nombreDePlacesEnChirurgie: 1,
        nombreDePlacesEnMédecine: 1,
        nombreDePlacesEnSsr: 1,
        nombreDePlacesEnObstétrique: 1,
      },
    ];

    const mockChargeAutorisationsEtCapacités = jest.fn().mockResolvedValue({
      numéroFinessEntitéJuridique: "",
      capacités: mockCapacités,
      autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
      autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
      reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
      equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
    } as EntitéJuridiqueAutorisationEtCapacitéLoader);
    entiteJuridiqueLoaderMock.chargeAutorisationsEtCapacités = mockChargeAutorisationsEtCapacités;
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.autorisationsEtCapacites.capacités).toStrictEqual(mockCapacités);
  });

  describe("Autorisations Activites", () => {
    it("recuperer la date de mise à jour des activités", async () => {
      // GIVEN
      const mockChargeAutorisationsEtCapacités = jest.fn().mockResolvedValue({
        numéroFinessEntitéJuridique: "",
        capacités: [],
        autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
        autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-05-21" },
        reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-07-21" },
        equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-08-21" },
      } as EntitéJuridiqueAutorisationEtCapacitéLoader);
      entiteJuridiqueLoaderMock.chargeAutorisationsEtCapacités = mockChargeAutorisationsEtCapacités;

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      expect(entitéJuridique.autorisationsEtCapacites.autorisationsActivités.dateMiseÀJourSource).toBe("21/10/2023");
    });

    it("recuperer la liste des autorisations d'activités", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          libelléActivité: "Nom activité",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const autorisations = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations;
      expect(autorisations).toHaveLength(1);
      expect(autorisations[0].code).toBe("1");
      expect(autorisations[0].libelle).toBe("Nom activité");
    });

    it("recuperer la liste triée des autorisations d'activités pour une entité juridique avec deux activites differentes", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "3",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "2",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const autorisations = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations;
      expect(autorisations).toHaveLength(3);
      expect(autorisations[0].code).toBe("1");
      expect(autorisations[1].code).toBe("2");
      expect(autorisations[2].code).toBe("3");
    });

    it("recuperer la liste des autorisations d'activités groupées par Activité", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "2",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const autorisations = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations;
      expect(autorisations).toHaveLength(1);
      expect(autorisations[0].code).toBe("1");
    });

    it("recuperer la liste triée des autorisations d'activités groupées par modalité", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "3",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "2",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const autorisations = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations;
      expect(autorisations).toHaveLength(1);
      expect(autorisations[0].modalites[0].code).toBe("1");
      expect(autorisations[0].modalites[1].code).toBe("2");
      expect(autorisations[0].modalites[2].code).toBe("3");
    });

    it("recuperer la liste triée des autorisations d'activités groupées par formes", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-2",
          libelléForme: "forme-2-libelle",
          numéroFinessÉtablissementTerritorial: "1",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          libelléForme: "forme-1-libelle",
          numéroFinessÉtablissementTerritorial: "2",
        }),
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          libelléForme: "forme-1-libelle",
          numéroFinessÉtablissementTerritorial: "3",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const formes = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations[0].modalites[0].formes;
      expect(formes).toHaveLength(2);
      expect(formes[0].code).toBe("forme-1");
      expect(formes[0].libelle).toBe("forme-1-libelle");
      expect(formes[1].code).toBe("forme-2");
      expect(formes[1].libelle).toBe("forme-2-libelle");
    });

    it("recuperer la liste triée des regroupements de établissements territoriaux", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-2",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 2" },
        }),

        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 1" },
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const forme = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations[0].modalites[0].formes[0];
      expect(forme.autorisationEtablissements).toHaveLength(2);
      expect(forme.autorisationEtablissements[0].numeroFiness).toBe("etablissement-1");
      expect(forme.autorisationEtablissements[0].nomEtablissement).toBe("Nom ET 1");
      expect(forme.autorisationEtablissements[1].numeroFiness).toBe("etablissement-2");
      expect(forme.autorisationEtablissements[1].nomEtablissement).toBe("Nom ET 2");
    });

    it("recuperer la liste des autorisations d'activités groupées par établissements territoriaux", async () => {
      // GIVEN
      const autorisationsSanitaire: AutorisationSanitaireModel[] = [
        mock<AutorisationSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          numéroAutorisationArhgos: "argos-1",
          dateAutorisation: "01/20/2020",
          dateFin: "10/20/2021",
          dateMiseEnOeuvre: "01/15/2020",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const forme = entitéJuridique.autorisationsEtCapacites.autorisationsActivités.autorisations[0].modalites[0].formes[0];
      expect(forme.autorisationEtablissements).toHaveLength(1);
      expect(forme.autorisationEtablissements[0].autorisations[0].nom).toBe("Numéro ARHGOS");
      expect(forme.autorisationEtablissements[0].autorisations[0].valeur).toBe("argos-1");
      expect(forme.autorisationEtablissements[0].autorisations[1].nom).toBe("Date d'autorisation");
      expect(forme.autorisationEtablissements[0].autorisations[1].valeur).toBe("20/01/2020");
      expect(forme.autorisationEtablissements[0].autorisations[2].nom).toBe("Date de mise en oeuvre");
      expect(forme.autorisationEtablissements[0].autorisations[2].valeur).toBe("15/01/2020");
      expect(forme.autorisationEtablissements[0].autorisations[3].nom).toBe("Date de fin");
      expect(forme.autorisationEtablissements[0].autorisations[3].valeur).toBe("20/10/2021");
    });
  });

  describe("Autres Activites", () => {
    it("recuperer la date de mise à jour des activités", async () => {
      // GIVEN
      const mockChargeAutorisationsEtCapacités = jest.fn().mockResolvedValue({
        numéroFinessEntitéJuridique: "",
        capacités: [],
        autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
        autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-05-21" },
        reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-07-21" },
        equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-08-21" },
      } as EntitéJuridiqueAutorisationEtCapacitéLoader);
      entiteJuridiqueLoaderMock.chargeAutorisationsEtCapacités = mockChargeAutorisationsEtCapacités;

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);
      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      expect(entitéJuridique.autorisationsEtCapacites.autresActivités.dateMiseÀJourSource).toBe("21/05/2023");
    });

    it("recuperer la liste des autorisations d'autres activités", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          libelléActivité: "Nom activité",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations;
      expect(activites).toHaveLength(1);
      expect(activites[0].code).toBe("1");
      expect(activites[0].libelle).toBe("Nom activité");
    });

    it("recuperer la liste triée des autorisations d'autres activités pour une entité juridique avec deux activites differentes", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "2",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "3",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations;
      expect(activites).toHaveLength(3);
      expect(activites[0].code).toBe("1");
      expect(activites[1].code).toBe("2");
      expect(activites[2].code).toBe("3");
    });

    it("recuperer la liste des autorisations d'autres activités groupées par Activité", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "2",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations;
      expect(activites).toHaveLength(1);
      expect(activites[0].code).toBe("1");
    });

    it("recuperer la liste triée des autorisations d'autres activités groupées par modalité", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "3",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "2",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const modalites = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations[0].modalites;
      expect(modalites).toHaveLength(3);
      expect(modalites[0].code).toBe("1");
      expect(modalites[1].code).toBe("2");
      expect(modalites[2].code).toBe("3");
    });

    it("recuperer la liste triée des autorisations d'autres activités groupées par formes", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-2",
          libelléForme: "forme-2-libelle",
          numéroFinessÉtablissementTerritorial: "2",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          libelléForme: "forme-1-libelle",
          numéroFinessÉtablissementTerritorial: "1",
        }),
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          libelléForme: "forme-1-libelle",
          numéroFinessÉtablissementTerritorial: "3",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const formes = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations[0].modalites[0].formes;
      expect(formes).toHaveLength(2);
      expect(formes[0].code).toBe("forme-1");
      expect(formes[0].libelle).toBe("forme-1-libelle");
      expect(formes[1].code).toBe("forme-2");
      expect(formes[1].libelle).toBe("forme-2-libelle");
    });

    it("recuperer la liste triée des regroupements de établissements territoriaux", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-2",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 2" },
        }),

        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 1" },
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const forme = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations[0].modalites[0].formes[0];
      expect(forme.autorisationEtablissements).toHaveLength(2);
      expect(forme.autorisationEtablissements[0].numeroFiness).toBe("etablissement-1");
      expect(forme.autorisationEtablissements[0].nomEtablissement).toBe("Nom ET 1");
      expect(forme.autorisationEtablissements[1].numeroFiness).toBe("etablissement-2");
      expect(forme.autorisationEtablissements[1].nomEtablissement).toBe("Nom ET 2");
    });

    it("recuperer la liste des autorisations d'activités groupées par établissements territoriaux", async () => {
      // GIVEN
      const autresActivites: AutreActivitéSanitaireModel[] = [
        mock<AutreActivitéSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          dateAutorisation: "01/10/2020",
          dateFin: "10/20/2021",
          dateMiseEnOeuvre: "01/15/2020",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: autresActivites, dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const forme = entitéJuridique.autorisationsEtCapacites.autresActivités.autorisations[0].modalites[0].formes[0];
      expect(forme.autorisationEtablissements).toHaveLength(1);
      expect(forme.autorisationEtablissements[0].autorisations[0].nom).toBe("Date d'autorisation");
      expect(forme.autorisationEtablissements[0].autorisations[0].valeur).toBe("10/01/2020");
      expect(forme.autorisationEtablissements[0].autorisations[1].nom).toBe("Date de mise en oeuvre");
      expect(forme.autorisationEtablissements[0].autorisations[1].valeur).toBe("15/01/2020");
      expect(forme.autorisationEtablissements[0].autorisations[2].nom).toBe("Date de fin");
      expect(forme.autorisationEtablissements[0].autorisations[2].valeur).toBe("20/10/2021");
    });
  });

  describe("Reconnaissance Contractuelles", () => {
    it("recuperer la date de mise à jour des activités", async () => {
      // GIVEN
      const mockChargeAutorisationsEtCapacités = jest.fn().mockResolvedValue({
        numéroFinessEntitéJuridique: "",
        capacités: [],
        autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
        autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-05-21" },
        reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-07-21" },
        equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-08-21" },
      } as EntitéJuridiqueAutorisationEtCapacitéLoader);

      entiteJuridiqueLoaderMock.chargeAutorisationsEtCapacités = mockChargeAutorisationsEtCapacités;

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);
      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      expect(entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.dateMiseÀJourSource).toBe("21/07/2023");
    });

    it("recuperer la liste des reconnaissance contractuelles d'activités", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          libelléActivité: "Nom activité",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations;
      expect(activites).toHaveLength(1);
      expect(activites[0].code).toBe("1");
      expect(activites[0].libelle).toBe("Nom activité");
    });

    it("recuperer la liste triée des reconnaissance Contractuelle d'activités pour une entité juridique avec deux activites differentes", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "2",
        }),
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
        }),
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "3",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations;
      expect(activites).toHaveLength(3);
      expect(activites[0].code).toBe("1");
      expect(activites[1].code).toBe("2");
      expect(activites[2].code).toBe("3");
    });

    it("recuperer la liste des reconnaissance Contractuelle d'activités groupées par Activité", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
        }),
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "2",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations;
      expect(activites).toHaveLength(1);
      expect(activites[0].code).toBe("1");
    });

    it("recuperer la liste triée des reconnaissance Contractuelle d'activités groupées par modalité", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "2",
        }),
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const modalites = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations[0].modalites;
      expect(modalites).toHaveLength(2);
      expect(modalites[0].code).toBe("1");
      expect(modalites[1].code).toBe("2");
    });

    it("recuperer la liste triée des reconnaissance reconnaissance d'activités groupées par formes", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-2",
          libelléForme: "forme-2-libelle",
          numéroFinessÉtablissementTerritorial: "3",
        }),
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          libelléForme: "forme-1-libelle",
          numéroFinessÉtablissementTerritorial: "1",
        }),
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          libelléForme: "forme-1-libelle",
          numéroFinessÉtablissementTerritorial: "2",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const formes = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations[0].modalites[0].formes;
      expect(formes).toHaveLength(2);
      expect(formes[0].code).toBe("forme-1");
      expect(formes[0].libelle).toBe("forme-1-libelle");
      expect(formes[1].code).toBe("forme-2");
      expect(formes[1].libelle).toBe("forme-2-libelle");
    });

    it("recuperer la liste triée des regroupements de établissements territoriaux", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-2",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 2" },
        }),

        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 1" },
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const forme = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations[0].modalites[0].formes[0];
      expect(forme.autorisationEtablissements).toHaveLength(2);
      expect(forme.autorisationEtablissements[0].numeroFiness).toBe("etablissement-1");
      expect(forme.autorisationEtablissements[0].nomEtablissement).toBe("Nom ET 1");
      expect(forme.autorisationEtablissements[1].numeroFiness).toBe("etablissement-2");
      expect(forme.autorisationEtablissements[1].nomEtablissement).toBe("Nom ET 2");
    });

    it("recuperer la liste des reconnaissance contractuelle d'activités groupées par établissements territoriaux", async () => {
      // GIVEN
      const reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel[] = [
        mock<ReconnaissanceContractuelleSanitaireModel>({
          codeActivité: "1",
          codeModalité: "1",
          codeForme: "forme-1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          capacitéAutorisée: 1,
          dateEffetAsr: "10/20/2021",
          numéroAutorisationArhgos: "argos-1",
          dateEffetCpom: "01/15/2020",
          dateFinCpom: "02/15/2020",
          numéroCpom: "cpom-1",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
          reconnaissanceContractuellesSanitaire: { autorisations: reconnaissanceContractuelle, dateMiseÀJourSource: "" },
          equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const forme = entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités.autorisations[0].modalites[0].formes[0];
      expect(forme.autorisationEtablissements).toHaveLength(1);
      expect(forme.autorisationEtablissements[0].autorisations[0].nom).toBe("Capacité autorisée");
      expect(forme.autorisationEtablissements[0].autorisations[0].valeur).toBe("1");
      expect(forme.autorisationEtablissements[0].autorisations[1].nom).toBe("Date d'effet de l'ASR");
      expect(forme.autorisationEtablissements[0].autorisations[1].valeur).toBe("20/10/2021");
      expect(forme.autorisationEtablissements[0].autorisations[2].nom).toBe("Auto. ARGHOS");
      expect(forme.autorisationEtablissements[0].autorisations[2].valeur).toBe("argos-1");
      expect(forme.autorisationEtablissements[0].autorisations[3].nom).toBe("Date d'effet du CPOM");
      expect(forme.autorisationEtablissements[0].autorisations[3].valeur).toBe("15/01/2020");
      expect(forme.autorisationEtablissements[0].autorisations[4].nom).toBe("Date de fin du CPOM");
      expect(forme.autorisationEtablissements[0].autorisations[4].valeur).toBe("15/02/2020");
      expect(forme.autorisationEtablissements[0].autorisations[5].nom).toBe("Numéro de CPOM");
      expect(forme.autorisationEtablissements[0].autorisations[5].valeur).toBe("cpom-1");
    });
  });

  describe("Equipement Materiel Lourd", () => {
    it("recuperer la date de mise à jour des activités", async () => {
      // GIVEN
      const mockChargeAutorisationsEtCapacités = jest.fn().mockResolvedValue({
        numéroFinessEntitéJuridique: "",
        capacités: [],
        autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
        autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-05-21" },
        reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-07-21" },
        equipementMaterielLourdSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-07-21" },
      } as EntitéJuridiqueAutorisationEtCapacitéLoader);
      entiteJuridiqueLoaderMock.chargeAutorisationsEtCapacités = mockChargeAutorisationsEtCapacités;

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entiteJuridiqueLoaderMock);
      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      expect(entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités.dateMiseÀJourSource).toBe("21/07/2023");
    });

    it("recuperer la liste des equipement Materiel lourds d'activités", async () => {
      // GIVEN
      const equipementMaterielLourd: ÉquipementMatérielLourdSanitaireModel[] = [
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
          libelléÉquipementMatérielLourd: "Nom activité",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          equipementMaterielLourdSanitaire: { autorisations: equipementMaterielLourd, dateMiseÀJourSource: "2023-10-21" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités.autorisations;
      expect(activites).toHaveLength(1);
      expect(activites[0].code).toBe("1");
      expect(activites[0].libelle).toBe("Nom activité");
    });

    it("recuperer la liste triée des equipements materiaux lourds pour une entité juridique avec deux activites differentes", async () => {
      // GIVEN
      const equipementMaterielLourd: ÉquipementMatérielLourdSanitaireModel[] = [
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "2",
        }),
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
        }),
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "3",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          equipementMaterielLourdSanitaire: { autorisations: equipementMaterielLourd, dateMiseÀJourSource: "2023-10-21" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités.autorisations;
      expect(activites).toHaveLength(3);
      expect(activites[0].code).toBe("1");
      expect(activites[1].code).toBe("2");
      expect(activites[2].code).toBe("3");
    });

    it("recuperer la liste des reconnaissance Contractuelle d'activités groupées par Activité", async () => {
      // GIVEN
      const equipementMaterielLourd: ÉquipementMatérielLourdSanitaireModel[] = [
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
          numéroFinessÉtablissementTerritorial: "123",
        }),
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
          numéroFinessÉtablissementTerritorial: "111",
        }),
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "2",
          numéroFinessÉtablissementTerritorial: "123",
        }),
      ];

      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          equipementMaterielLourdSanitaire: { autorisations: equipementMaterielLourd, dateMiseÀJourSource: "2023-10-21" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const activites = entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités.autorisations;
      expect(activites).toHaveLength(2);
      expect(activites[0].code).toBe("1");
      expect(activites[1].code).toBe("2");
    });

    it("recuperer la liste triée des regroupements de établissements territoriaux des equipement lourds", async () => {
      // GIVEN
      const equipementMaterielLourd: ÉquipementMatérielLourdSanitaireModel[] = [
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
          numéroFinessÉtablissementTerritorial: "etablissement-2",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 2" },
        }),

        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          établissementTerritorial: { raisonSocialeCourte: "Nom ET 1" },
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          equipementMaterielLourdSanitaire: { autorisations: equipementMaterielLourd, dateMiseÀJourSource: "2023-10-21" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const equipementEtablissement = entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités.autorisations[0];
      expect(equipementEtablissement.equipementEtablissements).toHaveLength(2);
      expect(equipementEtablissement.equipementEtablissements[0].numeroFiness).toBe("etablissement-1");
      expect(equipementEtablissement.equipementEtablissements[0].nomEtablissement).toBe("Nom ET 1");
      expect(equipementEtablissement.equipementEtablissements[1].numeroFiness).toBe("etablissement-2");
      expect(equipementEtablissement.equipementEtablissements[1].nomEtablissement).toBe("Nom ET 2");
    });

    it("recuperer la liste des materiel lourds groupées par établissements territoriaux", async () => {
      // GIVEN
      const equipementMaterielLourd: ÉquipementMatérielLourdSanitaireModel[] = [
        mock<ÉquipementMatérielLourdSanitaireModel>({
          codeÉquipementMatérielLourd: "1",
          numéroFinessÉtablissementTerritorial: "etablissement-1",
          dateAutorisation: "10/20/2021",
          numéroAutorisationArhgos: "argos-1",
          dateFin: "01/15/2020",
          dateMiseEnOeuvre: "02/15/2020",
        }),
      ];
      const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
        chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue({
          numéroFinessEntitéJuridique: "",
          capacités: [],
          autorisationsSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          autresActivitesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          reconnaissanceContractuellesSanitaire: { autorisations: [], dateMiseÀJourSource: "2023-10-21" },
          equipementMaterielLourdSanitaire: { autorisations: equipementMaterielLourd, dateMiseÀJourSource: "2023-10-21" },
        } as EntitéJuridiqueAutorisationEtCapacitéLoader),
      });

      const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

      // WHEN
      const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

      // THEN
      const equipements = entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités.autorisations[0].equipementEtablissements[0].equipements;
      expect(equipements).toHaveLength(1);
      expect(equipements[0].autorisations[0].nom).toBe("Numéro ARHGOS");
      expect(equipements[0].autorisations[0].valeur).toBe("argos-1");
      expect(equipements[0].autorisations[1].nom).toBe("Date d'autorisation");
      expect(equipements[0].autorisations[1].valeur).toBe("20/10/2021");
      expect(equipements[0].autorisations[2].nom).toBe("Date de mis en oeuvre");
      expect(equipements[0].autorisations[2].valeur).toBe("15/02/2020");
      expect(equipements[0].autorisations[3].nom).toBe("Date de fin");
      expect(equipements[0].autorisations[3].valeur).toBe("15/01/2020");
    });
  });
});
