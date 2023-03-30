import { mock } from "jest-mock-extended";

import { EntitéJuridiqueTestBuilder } from "../../test-builder/EntitéJuridiqueTestBuilder";
import { numéroFinessEntitéJuridique } from "../../testHelper";
import { CapacitéSanitaireEntitéJuridique } from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";
import { RécupèreLEntitéJuridiqueUseCase } from "./RécupèreLEntitéJuridiqueUseCase";

describe("La récupération d’une entité juridique", () => {
  it("récupère la fiche identité de l’entité juridique", async () => {
    // GIVEN
    const entitéJuridiqueIdentité = EntitéJuridiqueTestBuilder.créeEntitéJuridiqueIdentité({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
    });
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(entitéJuridiqueIdentité);
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeIdentité: mockedChargeParNuméroFiness,
    });
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(ficheIdentitéRécupérée).toEqual(entitéJuridiqueIdentité);
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
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeActivités: jest.fn().mockResolvedValue(mockActivités),
    });
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.activités).toStrictEqual(mockActivités);
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

    const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeBudgetFinance: jest.fn().mockResolvedValue(mockBudgetFinance),
    });

    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.budgetFinance).toStrictEqual(mockBudgetFinance);
  });

  it("récupère toutes les autorisations et capacités", async () => {
    // GIVEN
    const mockCapacités: CapacitéSanitaireEntitéJuridique = {
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
    };

    const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeAutorisationsEtCapacités: jest.fn().mockResolvedValue(mockCapacités),
    });

    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.autorisationsEtCapacites).toStrictEqual(mockCapacités);
  });
});
