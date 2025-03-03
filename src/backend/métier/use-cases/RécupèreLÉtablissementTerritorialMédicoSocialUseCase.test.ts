import { mock } from "jest-mock-extended";

import { ÉtablissementTerritorialTestBuilder } from "../../test-builder/ÉtablissementTerritorialTestBuilder";
import { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from "../../testHelper";
import { EntitéJuridiqueDeRattachement } from "../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";
import { MonoÉtablissement } from "../entities/établissement-territorial-médico-social/MonoÉtablissement";
import { ÉtablissementTerritorialMédicoSocial } from "../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";
import { ÉtablissementTerritorialMédicoSocialLoader } from "../gateways/ÉtablissementTerritorialMédicoSocialLoader";
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from "./RécupèreLÉtablissementTerritorialMédicoSocialUseCase";

describe("La récupération d’un établissement territorial médico-social", () => {
  it("récupère la fiche identité de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseÀJourSource: "2021-07-07",
        value: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
      },
      statutJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: "Société Anonyme (S.A.)",
      },
    };
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedChargeIdentité = jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial);
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement);
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce(entitéJuridiqueDeRattachement);

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: mockedChargeIdentité,
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    };

    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader = mock<EntitéJuridiqueLoader>({
      chargeRattachement: mockedChargeLEntitéJuridiqueDeRattachement,
    });

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mockedEntitéJuridiqueLoader
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocial["identité"] = {
      ...fakeIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };

    expect(établissementTerritorialMédicoSocial.identité).toStrictEqual(ficheIdentitéÉtablissementTerritorialMédicoSocial);
    expect(mockedChargeIdentité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeIdentité).toHaveBeenCalledTimes(1);
    expect(mockedEstUnMonoÉtablissement).toHaveBeenCalledWith(fakeIdentitéÉtablissementTerritorial.numéroFinessEntitéJuridique.value);
    expect(mockedEstUnMonoÉtablissement).toHaveBeenCalledTimes(1);
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique);
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1);
  });

  it("signale une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé", async () => {
    // GIVEN
    const mockedChargeParNuméroFiness = jest
      .fn()
      .mockResolvedValueOnce(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial));
    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: mockedChargeParNuméroFiness,
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: jest.fn(),
    };

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessEntitéJuridique);
      throw new Error("Une alerte d’établissement territorial non trouvée aurait dû être levée");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] L’établissement territorial médico-social ${numéroFinessÉtablissementTerritorial} n’a pas été trouvé`);
    }
  });

  it("récupère les activités de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement);

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const activités: ÉtablissementTerritorialMédicoSocial["activités"] = [
      ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
        année: 2019,
        numéroFinessÉtablissementTerritorial,
      }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
        année: 2020,
        numéroFinessÉtablissementTerritorial,
      }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
        année: 2021,
        numéroFinessÉtablissementTerritorial,
      }),
    ];
    const mockedChargeActivité = jest.fn().mockResolvedValueOnce(activités);
    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: mockedChargeActivité,
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    };

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeActivité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeActivité).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialMédicoSocial.activités).toStrictEqual(activités);
  });

  it("récupère les autorisations de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement);

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const autorisations: ÉtablissementTerritorialMédicoSocial["autorisationsEtCapacités"] = ÉtablissementTerritorialTestBuilder.créeUneAutorisationMédicoSocial(
      { numéroFinessÉtablissementTerritorial }
    );

    const mockedChargeAutorisations = jest.fn().mockResolvedValueOnce(autorisations);
    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: mockedChargeAutorisations,
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    };

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeAutorisations).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeAutorisations).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialMédicoSocial.autorisationsEtCapacités).toStrictEqual(autorisations);
  });

  it("récupère les indicateurs de budget et finances de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement);

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const budgetEtFinancesDeLÉtablissement = [
      ÉtablissementTerritorialTestBuilder.créeUnBlocBudgetEtFinancesErrdMédicoSocial({ année: 2021 }),
      ÉtablissementTerritorialTestBuilder.créeUnBlocBudgetEtFinancesErrdMédicoSocial({ année: 2020 }),
      ÉtablissementTerritorialTestBuilder.créeUnBlocBudgetEtFinancesErrdMédicoSocial({ année: 2019 }),
    ];
    const mockedChargeBudgetEtFinances = jest.fn().mockResolvedValueOnce(budgetEtFinancesDeLÉtablissement);

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: mockedChargeBudgetEtFinances,
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    };

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeBudgetEtFinances).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeBudgetEtFinances).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialMédicoSocial.budgetEtFinances).toStrictEqual(budgetEtFinancesDeLÉtablissement);
  });

  it("récupère les indicateurs de ressources humaines de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement);

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const ressourcesHumainesDeLÉtablissement = [
      ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({ année: 2021 }),
      ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({ année: 2020 }),
      ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({ année: 2019 }),
    ];
    const mockedChargeRessourcesHumaines = jest.fn().mockResolvedValueOnce(ressourcesHumainesDeLÉtablissement);

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeRessourcesHumaines: mockedChargeRessourcesHumaines,
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    };

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeRessourcesHumaines).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeRessourcesHumaines).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialMédicoSocial.ressourcesHumaines).toStrictEqual(ressourcesHumainesDeLÉtablissement);
  });

  it("récupère les indicateurs vigie rh de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeEstUnMonoEtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedEstUnMonoEtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoEtablissement);

    const fakeIdentiteEtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const donneesVigieRhET = [
      ÉtablissementTerritorialTestBuilder.creeUnBlocVigieRhMedicoSocial({
        pyramideAges: [{
          "annee": 2022,
          "trancheLibelle": '15-20',
          "effectif": 204,
          "effectifHomme": 10,
          "effectifFemme": 10,
          "effectifHommeRef": 12,
          "effectifFemmeRef": 12,
        }]
      }),
      ÉtablissementTerritorialTestBuilder.creeUnBlocVigieRhMedicoSocial({
        pyramideAges: [{
          "annee": 2021,
          "trancheLibelle": '15-20',
          "effectif": 204,
          "effectifHomme": 10,
          "effectifFemme": 10,
          "effectifHommeRef": 12,
          "effectifFemmeRef": 12,
        }]
      }),
    ];
    const mockedChargeVigieRh = jest.fn().mockResolvedValueOnce(donneesVigieRhET);

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentiteEtablissementTerritorial),
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: jest.fn(),
      chargeLesDonneesVigieRH: mockedChargeVigieRh,
      estUnMonoÉtablissement: mockedEstUnMonoEtablissement,
    };

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedChargeVigieRh).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedChargeVigieRh).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialMédicoSocial.vigieRh).toStrictEqual(donneesVigieRhET);
  });

  it("récupère les indicateurs qualité de l’établissement territorial médico-social", async () => {
    // GIVEN
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    };
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement);

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: "2021-07-07",
        value: numéroFinessÉtablissementTerritorial,
      },
    });

    const donneesQualiteDeLÉtablissement = [
      ÉtablissementTerritorialTestBuilder.créeUnBlocQualité(),
      ÉtablissementTerritorialTestBuilder.créeUnBlocQualité(),
      ÉtablissementTerritorialTestBuilder.créeUnBlocQualité(),
    ];
    const mockedDonnesQualite = jest.fn().mockResolvedValueOnce(donneesQualiteDeLÉtablissement);

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeAutorisationsEtCapacités: jest.fn(),
      chargeBudgetEtFinances: jest.fn(),
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      chargeRessourcesHumaines: jest.fn(),
      chargeQualite: mockedDonnesQualite,
      chargeLesDonneesVigieRH: jest.fn(),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    };

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      mockedÉtablissementTerritorialMédicoSocialLoader,
      mock<EntitéJuridiqueLoader>()
    );

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial);

    // THEN
    expect(mockedDonnesQualite).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial);
    expect(mockedDonnesQualite).toHaveBeenCalledTimes(1);
    expect(établissementTerritorialMédicoSocial.qualite).toStrictEqual(donneesQualiteDeLÉtablissement);
  });
});
