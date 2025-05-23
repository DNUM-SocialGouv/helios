import { mock } from "jest-mock-extended";

import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from "./RécupèreLÉtablissementTerritorialSanitaireUseCase";
import { ÉtablissementTerritorialTestBuilder } from "../../test-builder/ÉtablissementTerritorialTestBuilder";
import { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from "../../testHelper";
import { EntiteJuridiqueDeRattachement } from "../entities/entité-juridique/EntiteJuridiqueDeRattachement";
import { CatégorisationEnum } from "../entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialSanitaire } from "../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";
import { ÉtablissementTerritorialSanitaireLoader } from "../gateways/ÉtablissementTerritorialSanitaireLoader";

describe("La récupération d’un établissement territorial sanitaire", () => {
  it("récupère la fiche identité de l’établissement territorial sanitaire", async () => {
    // GIVEN
    const fakeFicheIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessÉtablissementTerritorial,
      },
    });
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(fakeFicheIdentitéÉtablissementTerritorial);
    const entitéJuridiqueDeRattachement: EntiteJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseÀJourSource: "2022-05-14",
        value: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
      },
      statutJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: "Société Anonyme (S.A.)",
      },
      categorisationDeLEntitéDeRattachement: {
        dateMiseÀJourSource: "2022-05-14",
        value: CatégorisationEnum.PUBLIC,
      }
    };
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce(entitéJuridiqueDeRattachement);
    const mockedÉtablissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: jest.fn(),
      chargeActivitéMensuel: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeQualite: jest.fn(),
      chargeIdentité: mockedChargeParNuméroFiness,
      chargeBudgetFinance: jest.fn(),
      chargeAllocationRessource: jest.fn(),
    };
    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeRattachement: mockedChargeLEntitéJuridiqueDeRattachement,
    });
    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
      mockedÉtablissementTerritorialLoader,
      mockedEntitéJuridiqueLoader
    );

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    const ficheIdentitéÉtablissementTerritorialSanitaire: ÉtablissementTerritorialSanitaire["identité"] = {
      ...fakeFicheIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
    };

    expect(ficheIdentitéRécupérée.identité).toStrictEqual(ficheIdentitéÉtablissementTerritorialSanitaire);
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1);
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique);
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1);
  });

  it("signale une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé", async () => {
    // GIVEN
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial));
    const établissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: jest.fn(),
      chargeActivitéMensuel: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeQualite: jest.fn(),
      chargeIdentité: mockedChargeParNuméroFiness,
      chargeBudgetFinance: jest.fn(),
      chargeAllocationRessource: jest.fn()
    };
    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
      établissementTerritorialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessEntitéJuridique);
      throw new Error("Une alerte d’établissement territorial non trouvée aurait dû être levée");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] L’établissement territorial sanitaire ${numéroFinessÉtablissementTerritorial} n’a pas été trouvé`);
    }
  });

  it("récupère les activités de l’établissement territorial sanitaire", async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const fakeActivitésSanitaires: ÉtablissementTerritorialSanitaire["activités"] = [
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
        année: 2016,
        numéroFinessÉtablissementTerritorial,
      }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
        année: 2017,
        numéroFinessÉtablissementTerritorial,
      }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
        année: 2018,
        numéroFinessÉtablissementTerritorial,
      }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
        année: 2019,
        numéroFinessÉtablissementTerritorial,
      }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
        année: 2020,
        numéroFinessÉtablissementTerritorial,
      }),
    ];
    const mockedChargeActivité = jest.fn().mockResolvedValueOnce(fakeActivitésSanitaires);

    const mockedÉtablissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: mockedChargeActivité,
      chargeActivitéMensuel: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeQualite: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeBudgetFinance: jest.fn(),
      chargeAllocationRessource: jest.fn()
    };

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
      mockedÉtablissementTerritorialSanitaireLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialSanitaire = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeActivité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeActivité).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialSanitaire.activités).toStrictEqual(fakeActivitésSanitaires);
  });

  it("récupère les activités mensuel de l’établissement territorial sanitaire", async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const fakeActivitésMensuelsSanitaires = ÉtablissementTerritorialTestBuilder.créeUneActivitéMensuelSanitaire();

    const mockedChargeActivitéMensuel = jest.fn().mockResolvedValueOnce(fakeActivitésMensuelsSanitaires);

    const mockedÉtablissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: jest.fn(),
      chargeActivitéMensuel: mockedChargeActivitéMensuel,
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeQualite: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeBudgetFinance: jest.fn(),
      chargeAllocationRessource: jest.fn()
    };

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
      mockedÉtablissementTerritorialSanitaireLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialSanitaire = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(établissementTerritorialSanitaire.activitésMensuels.activitesSanitaireMensuelList).toHaveLength(12);

    expect(établissementTerritorialSanitaire.activitésMensuels.dateDeMiseAJour).toBe("2024-11-05");
  });

  it("récupère les autorisations de l’établissement territorial sanitaire", async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const autorisations: ÉtablissementTerritorialSanitaire["autorisationsEtCapacités"] = ÉtablissementTerritorialTestBuilder.créeUneAutorisationSanitaire({
      numéroFinessÉtablissementTerritorial,
    });
    const mockedChargeAutorisations = jest.fn().mockResolvedValueOnce(autorisations);
    const mockedÉtablissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: jest.fn(),
      chargeActivitéMensuel: jest.fn(),
      chargeAutorisationsEtCapacités: mockedChargeAutorisations,
      chargeQualite: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeBudgetFinance: jest.fn(),
      chargeAllocationRessource: jest.fn()
    };

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
      mockedÉtablissementTerritorialSanitaireLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialSanitaire = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeAutorisations).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeAutorisations).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialSanitaire.autorisationsEtCapacités).toStrictEqual(autorisations);
  });

  it("récupère les indicateurs qualité de l’établissement territorial sanitaire", async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2022-05-14",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const donneesQualiteDeLÉtablissement = [
      ÉtablissementTerritorialTestBuilder.créeUnBlocQualité(),
      ÉtablissementTerritorialTestBuilder.créeUnBlocQualité(),
      ÉtablissementTerritorialTestBuilder.créeUnBlocQualité(),
    ];
    const mockedDonnesQualite = jest.fn().mockResolvedValueOnce(donneesQualiteDeLÉtablissement);

    const mockedÉtablissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: jest.fn(),
      chargeActivitéMensuel: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeQualite: mockedDonnesQualite,
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeBudgetFinance: jest.fn(),
      chargeAllocationRessource: jest.fn()
    };

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
      mockedÉtablissementTerritorialSanitaireLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialSanitaire = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedDonnesQualite).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedDonnesQualite).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialSanitaire.qualite).toStrictEqual(donneesQualiteDeLÉtablissement);

  });
});
