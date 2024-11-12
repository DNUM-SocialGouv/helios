import { Repository } from "typeorm";

import { ActivitéMédicoSocialModel } from "../../../../../database/models/ActivitéMédicoSocialModel";
import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { BudgetEtFinancesMédicoSocialModel } from "../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { RessourcesHumainesMédicoSocialModel } from "../../../../../database/models/RessourcesHumainesMédicoSocialModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialActivitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder";
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder";
import { ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { ÉtablissementTerritorialRessourcesHumainesModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialRessourcesHumainesModelTestBuilder";
import { CadreBudgétaire } from "../../../métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { clearAllTables, getOrm } from "../../../testHelper";
import { TypeOrmComparaisonLoader } from "./TypeOrmComparaisonLoader";

describe("La comparaison des établissements médico sociaux", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let ressourcesHumainesModelRepository: Repository<RessourcesHumainesMédicoSocialModel>;
  let budgetEtFinancesMedicoSocialModelRepository: Repository<BudgetEtFinancesMédicoSocialModel>;
  let activiteeMedicoSocialModelRepository: Repository<ActivitéMédicoSocialModel>;
  let autorisationMedicoSocialModelRepository: Repository<AutorisationMédicoSocialModel>;

  const premièrePage = 1;

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    ressourcesHumainesModelRepository = (await orm).getRepository(RessourcesHumainesMédicoSocialModel);
    budgetEtFinancesMedicoSocialModelRepository = (await orm).getRepository(BudgetEtFinancesMédicoSocialModel);
    activiteeMedicoSocialModelRepository = (await orm).getRepository(ActivitéMédicoSocialModel);
    autorisationMedicoSocialModelRepository = (await orm).getRepository(AutorisationMédicoSocialModel);
  });

  beforeEach(async () => {
    await clearAllTables(await orm);
    await entitéJuridiqueRepository.insert([
      EntitéJuridiqueModelTestBuilder.crée({
        numéroFinessEntitéJuridique: "000000000",
        raisonSocialeCourte: `entité juridique`,
      }),
    ]);

    await établissementTerritorialRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "100000000",
        raisonSociale: `établissement territorial MS 1`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "100000001",
        raisonSociale: `établissement territorial MS 2`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "199999999",
        raisonSociale: `établissement territorial MS 3`,
      }),
    ]);

    await ressourcesHumainesModelRepository.insert([
      ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial: "100000000" }),
      ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2022, numéroFinessÉtablissementTerritorial: "100000000" }),
      ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2023, numéroFinessÉtablissementTerritorial: "100000000" }),
      ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial: "100000001" }),
      ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2022, numéroFinessÉtablissementTerritorial: "100000001" }),
      ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2023, numéroFinessÉtablissementTerritorial: "100000001" }),
    ]);

    await budgetEtFinancesMedicoSocialModelRepository.insert([
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.ERRD, {
        année: 2021,
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.CA_PH, {
        année: 2022,
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.CA_PA, {
        année: 2023,
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.ERRD, {
        année: 2021,
        numéroFinessÉtablissementTerritorial: "100000001",
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.CA_PH, {
        année: 2022,
        numéroFinessÉtablissementTerritorial: "100000001",
      }),
    ]);

    await autorisationMedicoSocialModelRepository.insert([
      ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
        activité: "11",
        clientèle: "702",
        disciplineDÉquipement: "657",
        libelléActivité: "Hébergement Complet Internat",
        libelléClientèle: "PH vieillissantes",
        libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
      ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
        activité: "11",
        clientèle: "711",
        disciplineDÉquipement: "657",
        estInstallée: false,
        libelléActivité: "Hébergement Complet Internat",
        libelléClientèle: "P.A. dépendantes",
        libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
      ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
        activité: "16",
        clientèle: "010",
        disciplineDÉquipement: "657",
        libelléActivité: "Prestation en milieu ordinaire",
        libelléClientèle: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
        libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
      ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
        activité: "21",
        clientèle: "010",
        disciplineDÉquipement: "658",
        estInstallée: false,
        libelléActivité: "Accueil de Jour",
        libelléClientèle: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
        libelléDisciplineDÉquipement: "Accueil temporaire pour adultes handicapés",
        numéroFinessÉtablissementTerritorial: "100000000",
      }),
    ]);

    await activiteeMedicoSocialModelRepository.insert([
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2023, numéroFinessÉtablissementTerritorial: "100000000" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2022, numéroFinessÉtablissementTerritorial: "100000000" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial: "100000000" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2023, numéroFinessÉtablissementTerritorial: "100000001" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2022, numéroFinessÉtablissementTerritorial: "100000001" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial: "100000001" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2022, numéroFinessÉtablissementTerritorial: "199999999" }),
    ]);
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("retourne le nombre des résultats, les moyennes et les résultats triés par numéro FINESS", async () => {
    const typeOrmComparaisonLoader = new TypeOrmComparaisonLoader(orm);

    // WHEN
    const comparaison = await typeOrmComparaisonLoader.compare("Médico-social", ["100000000", "100000001", "199999999"], premièrePage, "", "");

    expect(comparaison.nombreDeResultats).toStrictEqual([
      { annee: 2021, total: "2" },
      { annee: 2022, total: "3" },
      { annee: 2023, total: "2" },
    ]);
    expect(comparaison.moyennes).toHaveLength(3);
    expect(comparaison.moyennes[0]).toStrictEqual({
      annee: 2021,
      capaciteMoyenne: 40,
      realisationAcitiviteMoyenne: 80,
      acceuilDeJourMoyenne: 80,
      hebergementPermanentMoyenne: 80,
      hebergementTemporaireMoyenne: 80,
      fileActivePersonnesAccompagnesMoyenne: 80,
      rotationPersonnelMoyenne: 0.667,
      absenteismeMoyenne: 0.0767,
      prestationExterneMoyenne: 0.659,
      etpVacantMoyenne: 0.652,
      tauxCafMoyenne: 0.13548734436644624,
      vetusteConstructionMoyenne: 0.38845089702004892,
      roulementNetGlobalMoyenne: 2206969.2599999998,
      resultatNetComptableMoyenne: -38330.669999999503,
    });
    expect(comparaison.resultat).toStrictEqual([
      {
        annee: 2021,
        numéroFiness: "100000000",
        socialReason: "établissement territorial MS 1",
        type: "Médico-social",
        capacite: "40",
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: 66.7,
        absenteisme: 7.7,
        prestationExterne: 65.9,
        etpVacant: 65.2,
        tauxCaf: 13.5,
        vetusteConstruction: 38.8,
        roulementNetGlobal: 2206969,
        resultatNetComptable: -38331,
      },
      {
        annee: 2022,
        numéroFiness: "100000000",
        socialReason: "établissement territorial MS 1",
        type: "Médico-social",
        capacite: "40",
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: 66.7,
        absenteisme: 7.7,
        prestationExterne: 65.9,
        etpVacant: 65.2,
        tauxCaf: 16.5,
        vetusteConstruction: 53.2,
        roulementNetGlobal: null,
        resultatNetComptable: 95999,
      },
      {
        annee: 2023,
        numéroFiness: "100000000",
        socialReason: "établissement territorial MS 1",
        type: "Médico-social",
        capacite: "40",
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: 66.7,
        absenteisme: 7.7,
        prestationExterne: 65.9,
        etpVacant: 65.2,
        tauxCaf: null,
        vetusteConstruction: 31.2,
        roulementNetGlobal: null,
        resultatNetComptable: 18887,
      },
      {
        annee: 2021,
        numéroFiness: "100000001",
        socialReason: "établissement territorial MS 2",
        type: "Médico-social",
        capacite: null,
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: 66.7,
        absenteisme: 7.7,
        prestationExterne: 65.9,
        etpVacant: 65.2,
        tauxCaf: 13.5,
        vetusteConstruction: 38.8,
        roulementNetGlobal: 2206969,
        resultatNetComptable: -38331,
      },
      {
        annee: 2022,
        numéroFiness: "100000001",
        socialReason: "établissement territorial MS 2",
        type: "Médico-social",
        capacite: null,
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: 66.7,
        absenteisme: 7.7,
        prestationExterne: 65.9,
        etpVacant: 65.2,
        tauxCaf: 16.5,
        vetusteConstruction: 53.2,
        roulementNetGlobal: null,
        resultatNetComptable: 95999,
      },
      {
        annee: 2023,
        numéroFiness: "100000001",
        socialReason: "établissement territorial MS 2",
        type: "Médico-social",
        capacite: null,
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: 66.7,
        absenteisme: 7.7,
        prestationExterne: 65.9,
        etpVacant: 65.2,
        tauxCaf: null,
        vetusteConstruction: null,
        roulementNetGlobal: null,
        resultatNetComptable: null,
      },
      {
        annee: 2022,
        numéroFiness: "199999999",
        socialReason: "établissement territorial MS 3",
        type: "Médico-social",
        capacite: null,
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 8000,
        rotationPersonnel: null,
        absenteisme: null,
        prestationExterne: null,
        etpVacant: null,
        tauxCaf: null,
        vetusteConstruction: null,
        roulementNetGlobal: null,
        resultatNetComptable: null,
      },
    ]);
  });
});
