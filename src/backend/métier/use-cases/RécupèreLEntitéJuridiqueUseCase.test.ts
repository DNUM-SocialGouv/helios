import { mock } from "jest-mock-extended";

import { EntitéJuridiqueTestBuilder } from "../../test-builder/EntitéJuridiqueTestBuilder";
import { numéroFinessEntitéJuridique } from "../../testHelper";
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
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeActivités: jest.fn().mockResolvedValue({
        année: 2022,
        nombreDePassagesAuxUrgences: {
          dateMiseÀJourSour ce: "2020-10-01",
          value: 10,
        },
      }),
    });
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader);

    // WHEN
    const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(entitéJuridique.activités).toStrictEqual({
      année: 2022,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: "2020-10-01",
        value: 10,
      },
    });
  });
});
