import { Repository } from "typeorm";

import { TypeOrmComparaisonLoader } from "./TypeOrmComparaisonLoader";
import { ActivitéMédicoSocialModel } from "../../../../../database/models/ActivitéMédicoSocialModel";
import { ActivitéSanitaireEntitéJuridiqueModel } from "../../../../../database/models/ActivitéSanitaireEntitéJuridiqueModel";
import { ActivitéSanitaireModel } from "../../../../../database/models/ActivitéSanitaireModel";
import { AllocationRessourceETModel } from "../../../../../database/models/AllocationRessourceETModel";
import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "../../../../../database/models/BudgetEtFinancesEntiteJuridiqueModel";
import { BudgetEtFinancesMédicoSocialModel } from "../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RessourcesHumainesEntiteJuridiqueModel } from "../../../../../database/models/RessourcesHumainesEntiteJuridiqueModel";
import { RessourcesHumainesMédicoSocialModel } from "../../../../../database/models/RessourcesHumainesMédicoSocialModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialActivitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder";
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder";
import { ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { ÉtablissementTerritorialRessourcesHumainesModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialRessourcesHumainesModelTestBuilder";
import { ParametresDeComparaison } from "../../../métier/entities/ParametresDeComparaison";
import { CadreBudgétaire } from "../../../métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { clearAllTables, getOrm } from "../../../testHelper";

describe("La comparaison des établissements", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let ressourcesHumainesModelRepository: Repository<RessourcesHumainesMédicoSocialModel>;
  let ressourcesHumainesEJModelRepository: Repository<RessourcesHumainesEntiteJuridiqueModel>;
  let budgetEtFinancesMedicoSocialModelRepository: Repository<BudgetEtFinancesMédicoSocialModel>;
  let activiteeMedicoSocialModelRepository: Repository<ActivitéMédicoSocialModel>;
  let autorisationMedicoSocialModelRepository: Repository<AutorisationMédicoSocialModel>;
  let activiteSanitaireRepository: Repository<ActivitéSanitaireModel>;
  let allocationRessourceETRepository: Repository<AllocationRessourceETModel>;
  let budgetEtFinancesEntiteJuridiqueRepository: Repository<BudgetEtFinancesEntiteJuridiqueModel>;
  let entiteJuridiqueActivitesRepository: Repository<ActivitéSanitaireEntitéJuridiqueModel>;

  const premièrePage = 1;

  const autorisation = new ProfilModel();
  autorisation.value = {
    institution: { profilEJ: {}, profilETSanitaire: {}, profilMédicoSocial: {} },
    autreRegion: {
      profilEJ: {}, profilETSanitaire: {}, profilMédicoSocial: {
        "activités": {
          "tauxRéalisationActivité": "ok",
          "tauxOccupationAccueilDeJour": "ok",
          "fileActivePersonnesAccompagnées": "ok",
          "tauxOccupationHébergementPermanent": "ok",
          "tauxOccupationHébergementTemporaire": "ok",
          "nombreMoyenJournéesAbsencePersonnesAccompagnées": "ok",
          "duréeMoyenneSéjourAccompagnementPersonnesSorties": "ok"
        },
        "budgetEtFinances": {
          "tauxDeCafNette": "ok",
          "compteRésultats": "ok",
          "fondsDeRoulement": "ok",
          "résultatNetComptable": "ok",
          "tauxDeVétustéConstruction": "ok",
          "contributionAuxFraisDeSiège": "ok"
        },
        "ressourcesHumaines": {
          "tauxDEtpVacants": "ok",
          "tauxDAbsentéisme": "ok",
          "nombreDEtpRéalisés": "ok",
          "nombreDeCddDeRemplacement": "ok",
          "tauxDePrestationsExternes": "ok",
          "tauxDeRotationDuPersonnel": "ok"
        },
        "autorisationsEtCapacités": {
          "capacités": "ok",
          "autorisations": "ok"
        }
      }
    }
  };

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    ressourcesHumainesModelRepository = (await orm).getRepository(RessourcesHumainesMédicoSocialModel);
    ressourcesHumainesEJModelRepository = (await orm).getRepository(RessourcesHumainesEntiteJuridiqueModel);
    budgetEtFinancesMedicoSocialModelRepository = (await orm).getRepository(BudgetEtFinancesMédicoSocialModel);
    activiteeMedicoSocialModelRepository = (await orm).getRepository(ActivitéMédicoSocialModel);
    autorisationMedicoSocialModelRepository = (await orm).getRepository(AutorisationMédicoSocialModel);
    activiteSanitaireRepository = (await orm).getRepository(ActivitéSanitaireModel);
    allocationRessourceETRepository = (await orm).getRepository(AllocationRessourceETModel);
    budgetEtFinancesEntiteJuridiqueRepository = (await orm).getRepository(BudgetEtFinancesEntiteJuridiqueModel);
    entiteJuridiqueActivitesRepository = (await orm).getRepository(ActivitéSanitaireEntitéJuridiqueModel);
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
        raisonSocialeCourte: `établissement territorial MS 1`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "100000001",
        raisonSociale: `établissement territorial MS 2`,
        raisonSocialeCourte: `établissement territorial MS 2`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "199999999",
        raisonSociale: `établissement territorial MS 3`,
        raisonSocialeCourte: `établissement territorial MS 3`,
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

    await ressourcesHumainesEJModelRepository.insert(EntitéJuridiqueModelTestBuilder.creeRessourceHumaineEntiteJuridique({
      numeroFinessEntiteJuridique: "000000000",
      annee: 2022,
      nombreEtpPm: 10,
      nombreEtpPnm: 20,
      joursAbsenteismePm: 30,
      joursAbsenteismePnm: 40,
      depensesInterimPm: 5000,
    }));

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


    await établissementTerritorialRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "200000000",
        raisonSociale: `établissement territorial SAN 1`,
        raisonSocialeCourte: `établissement territorial SAN 1`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "200000001",
        raisonSociale: `établissement territorial SAN 2`,
        raisonSocialeCourte: `établissement territorial SAN 2`,
      }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
        numéroFinessEntitéJuridique: "000000000",
        numéroFinessÉtablissementTerritorial: "299999999",
        raisonSociale: `établissement territorial SAN 3`,
        raisonSocialeCourte: `établissement territorial SAN 3`,
      }),
    ]);

    await activiteSanitaireRepository.insert([
      ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2021, numéroFinessÉtablissementTerritorial: "200000000" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2022, numéroFinessÉtablissementTerritorial: "200000000" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2023, numéroFinessÉtablissementTerritorial: "200000000" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2021, numéroFinessÉtablissementTerritorial: "200000001" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2022, numéroFinessÉtablissementTerritorial: "200000001" }),
      ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2023, numéroFinessÉtablissementTerritorial: "200000001" }),
    ]);

    await allocationRessourceETRepository.insert([
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeAllocationRessourceSanitaire({
        année: 2022,
        numeroFinessEtablissementTerritorial: "200000000",
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeAllocationRessourceSanitaire({
        année: 2022,
        numeroFinessEtablissementTerritorial: "200000000",
        enveloppe: "MIGAC",
        montant: 2000
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeAllocationRessourceSanitaire({
        année: 2022,
        numeroFinessEtablissementTerritorial: "200000000",
        enveloppe: "Forfaits"
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeAllocationRessourceSanitaire({
        année: 2022,
        numeroFinessEtablissementTerritorial: "200000001",
      }),
      ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeAllocationRessourceSanitaire({
        année: 2022,
        numeroFinessEtablissementTerritorial: "200000001",
        enveloppe: "MIGAC"
      }),
    ]);

    const budgetFinanceEntiteJuridique = new BudgetEtFinancesEntiteJuridiqueModel();
    budgetFinanceEntiteJuridique.numéroFinessEntitéJuridique = "000000000";
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

    await budgetEtFinancesEntiteJuridiqueRepository.insert(budgetFinanceEntiteJuridique);

    const activites = new ActivitéSanitaireEntitéJuridiqueModel();
    activites.numéroFinessEntitéJuridique = "000000000";
    activites.année = 2022;
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
    activites.nombreJourneesUsld = 12345;

    await entiteJuridiqueActivitesRepository.insert(activites);
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("la comparaison des établissements médico sociaux", async () => {
    const typeOrmComparaisonLoader = new TypeOrmComparaisonLoader(orm);

    // WHEN
    const params = { type: "Médico-social", numerosFiness: ["100000000", "100000001", "199999999"], annee: '2022', page: premièrePage, order: "", orderBy: "", forExport: false, codeRegion: '84' } as ParametresDeComparaison;
    const comparaison = await typeOrmComparaisonLoader.compare(params, [autorisation]);

    expect(comparaison.nombreDeResultats).toBe(3);

    expect(comparaison.resultat).toStrictEqual([
      {
        numéroFiness: "100000000",
        socialReason: "établissement territorial MS 1",
        categorie: '159-C.H.',
        type: "Médico-social",
        capacite: 40,
        commune: "NANTUA",
        departement: "AIN",
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        externat: 80,
        semiInternat: 80,
        internat: 80,
        autres: 80,
        seances: 80,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 80,
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
        numéroFiness: "100000001",
        socialReason: "établissement territorial MS 2",
        categorie: '159-C.H.',
        type: "Médico-social",
        capacite: null,
        commune: "NANTUA",
        departement: "AIN",
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        externat: 80,
        semiInternat: 80,
        internat: 80,
        autres: 80,
        seances: 80,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 80,
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
        numéroFiness: "199999999",
        socialReason: "établissement territorial MS 3",
        categorie: '159-C.H.',
        type: "Médico-social",
        capacite: null,
        commune: "NANTUA",
        departement: "AIN",
        realisationActivite: 8000,
        acceuilDeJour: 8000,
        externat: 80,
        semiInternat: 80,
        internat: 80,
        autres: 80,
        seances: 80,
        hebergementPermanent: 8000,
        hebergementTemporaire: 8000,
        fileActivePersonnesAccompagnes: 80,
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


  it("la comparaison des établissements sanitaires", async () => {
    const typeOrmComparaisonLoader = new TypeOrmComparaisonLoader(orm);

    const autorisation = new ProfilModel();
    autorisation.value = {
      institution: { profilEJ: {}, profilETSanitaire: {}, profilMédicoSocial: {} },
      autreRegion: {
        profilEJ: {}, profilETSanitaire: {}, profilMédicoSocial: {
          "activités": {
            "tauxRéalisationActivité": "ok",
            "tauxOccupationAccueilDeJour": "ok",
            "fileActivePersonnesAccompagnées": "ok",
            "tauxOccupationHébergementPermanent": "ok",
            "tauxOccupationHébergementTemporaire": "ok",
            "nombreMoyenJournéesAbsencePersonnesAccompagnées": "ok",
            "duréeMoyenneSéjourAccompagnementPersonnesSorties": "ok"
          },
          "budgetEtFinances": {
            "tauxDeCafNette": "ok",
            "compteRésultats": "ok",
            "fondsDeRoulement": "ok",
            "résultatNetComptable": "ok",
            "tauxDeVétustéConstruction": "ok",
            "contributionAuxFraisDeSiège": "ok"
          },
          "ressourcesHumaines": {
            "tauxDEtpVacants": "ok",
            "tauxDAbsentéisme": "ok",
            "nombreDEtpRéalisés": "ok",
            "nombreDeCddDeRemplacement": "ok",
            "tauxDePrestationsExternes": "ok",
            "tauxDeRotationDuPersonnel": "ok"
          },
          "autorisationsEtCapacités": {
            "capacités": "ok",
            "autorisations": "ok"
          }
        }
      }
    };

    // WHEN
    const params = {
      type: "Sanitaire",
      numerosFiness: ["000000000", "200000000", "200000001", "299999999"],
      annee: '2022',
      page: premièrePage,
      order: "",
      orderBy: "",
      forExport: false,
      codeRegion: '84',
      enveloppe1: 'FIR',
      enveloppe2: 'MIGAC',
      enveloppe3: 'Forfaits'
    } as ParametresDeComparaison;
    const comparaison = await typeOrmComparaisonLoader.compare(params, [autorisation]);

    expect(comparaison.nombreDeResultats).toBe(4);

    expect(comparaison.resultat).toStrictEqual([
      {
        numéroFiness: "200000000",
        socialReason: "établissement territorial SAN 1",
        categorie: '365-C.H.',
        type: "Sanitaire",
        commune: "VILLENEUVE D ASCQ",
        departement: "NORD",
        totalHosptMedecine: 120,
        totalHosptObstetrique: 120,
        totalHosptChirurgie: 120,
        totalHosptSsr: 120,
        totalHosptPsy: 120,
        passagesUrgences: 60000,
        journeesUsld: 21654,
        enveloppe1: 3300,
        enveloppe2: 2000,
        enveloppe3: 3300
      },
      {
        numéroFiness: "200000001",
        socialReason: "établissement territorial SAN 2",
        categorie: '365-C.H.',
        type: "Sanitaire",
        commune: "VILLENEUVE D ASCQ",
        departement: "NORD",
        totalHosptMedecine: 120,
        totalHosptObstetrique: 120,
        totalHosptChirurgie: 120,
        totalHosptSsr: 120,
        totalHosptPsy: 120,
        passagesUrgences: 60000,
        journeesUsld: 21654,
        enveloppe1: 3300,
        enveloppe2: 3300,
        enveloppe3: null
      },
      {
        numéroFiness: "299999999",
        socialReason: "établissement territorial SAN 3",
        categorie: '365-C.H.',
        type: "Sanitaire",
        commune: "VILLENEUVE D ASCQ",
        departement: "NORD",
        totalHosptMedecine: null,
        totalHosptObstetrique: null,
        totalHosptChirurgie: null,
        totalHosptSsr: null,
        totalHosptPsy: null,
        passagesUrgences: null,
        journeesUsld: null,
        enveloppe1: null,
        enveloppe2: null,
        enveloppe3: null
      },
      {
        numéroFiness: "000000000",
        socialReason: "entité juridique",
        categorie: '-',
        type: "Entité juridique",
        commune: "OYONNAX",
        departement: "AIN",
        totalHosptMedecine: '',
        totalHosptObstetrique: '',
        totalHosptChirurgie: '',
        totalHosptSsr: '',
        totalHosptPsy: '',
        passagesUrgences: '',
        journeesUsld: '',
        enveloppe1: '',
        enveloppe2: '',
        enveloppe3: ''
      },
    ]);
  });

  it("la comparaison des entité juridiques", async () => {
    const typeOrmComparaisonLoader = new TypeOrmComparaisonLoader(orm);

    // WHEN
    const params = {
      type: "Entité juridique",
      numerosFiness: ["000000000", "200000000", "200000001", "299999999"],
      annee: '2022',
      page: premièrePage,
      order: "",
      orderBy: "",
      forExport: false,
      codeRegion: '84',
      enveloppe1: 'FIR',
      enveloppe2: 'MIGAC',
      enveloppe3: 'Forfaits'
    } as ParametresDeComparaison;
    const comparaison = await typeOrmComparaisonLoader.compare(params, [autorisation]);

    expect(comparaison.nombreDeResultats).toBe(4);

    expect(comparaison.resultat).toStrictEqual([
      {
        numéroFiness: "000000000",
        socialReason: "entité juridique",
        categorie: '-',
        type: "Entité juridique",
        commune: "OYONNAX",
        departement: "AIN",
        statutJuridique: 'public',
        rattachements: 'Sanitaire (3), SMS (3)',
        chargesPrincipaux: -100,
        chargesAnnexes: -900,
        produitsPrincipaux: 60,
        produitsAnnexes: 940,
        resultatNetComptableEj: 0.1,
        tauxCafEj: 0.2,
        ratioDependanceFinanciere: 0.3,
        sejoursHad: 12,
        enveloppe1: null,
        enveloppe2: null,
        enveloppe3: null,
        depensesInterimPm: 5000,
        joursAbsenteismePm: 30,
        joursAbsenteismePnm: 40,
        nombreEtpPm: 10,
        nombreEtpPnm: 20,
      },
      {
        numéroFiness: "200000000",
        socialReason: "établissement territorial SAN 1",
        categorie: '365-C.H.',
        type: "Sanitaire",
        commune: "VILLENEUVE D ASCQ",
        departement: "NORD",
        statutJuridique: '',
        rattachements: '',
        chargesPrincipaux: '',
        chargesAnnexes: '',
        produitsPrincipaux: '',
        produitsAnnexes: '',
        resultatNetComptableEj: '',
        tauxCafEj: '',
        ratioDependanceFinanciere: '',
        sejoursHad: '',
        enveloppe1: '',
        enveloppe2: '',
        enveloppe3: '',
        depensesInterimPm: '',
        joursAbsenteismePm: '',
        joursAbsenteismePnm: '',
        nombreEtpPm: '',
        nombreEtpPnm: '',
      },
      {
        numéroFiness: "200000001",
        socialReason: "établissement territorial SAN 2",
        categorie: '365-C.H.',
        type: "Sanitaire",
        commune: "VILLENEUVE D ASCQ",
        departement: "NORD",
        statutJuridique: '',
        rattachements: '',
        chargesPrincipaux: '',
        chargesAnnexes: '',
        produitsPrincipaux: '',
        produitsAnnexes: '',
        resultatNetComptableEj: '',
        tauxCafEj: '',
        ratioDependanceFinanciere: '',
        sejoursHad: '',
        enveloppe1: '',
        enveloppe2: '',
        enveloppe3: '',
        depensesInterimPm: '',
        joursAbsenteismePm: '',
        joursAbsenteismePnm: '',
        nombreEtpPm: '',
        nombreEtpPnm: '',
      },
      {
        numéroFiness: "299999999",
        socialReason: "établissement territorial SAN 3",
        categorie: '365-C.H.',
        type: "Sanitaire",
        commune: "VILLENEUVE D ASCQ",
        departement: "NORD",
        statutJuridique: '',
        rattachements: '',
        chargesPrincipaux: '',
        chargesAnnexes: '',
        produitsPrincipaux: '',
        produitsAnnexes: '',
        resultatNetComptableEj: '',
        tauxCafEj: '',
        ratioDependanceFinanciere: '',
        sejoursHad: '',
        enveloppe1: '',
        enveloppe2: '',
        enveloppe3: '',
        depensesInterimPm: '',
        joursAbsenteismePm: '',
        joursAbsenteismePnm: '',
        nombreEtpPm: '',
        nombreEtpPnm: '',
      },
    ]);
  });
});


