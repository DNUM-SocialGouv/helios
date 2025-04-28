import { Repository } from "typeorm";

import { TypeOrmÉtablissementTerritorialMédicoSocialLoader } from "./TypeOrmÉtablissementTerritorialMédicoSocialLoader";
import { ActivitéMédicoSocialModel } from "../../../../../database/models/ActivitéMédicoSocialModel";
import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { BudgetEtFinancesMédicoSocialModel } from "../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { CpomModel } from "../../../../../database/models/CpomModel";
import { DateMiseÀJourFichierSourceModel } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { EvenementIndesirableETModel } from "../../../../../database/models/EvenementIndesirableModel";
import { InspectionsControlesETModel } from "../../../../../database/models/InspectionsModel";
import { ReclamationETModel } from "../../../../../database/models/ReclamationETModel";
import { RessourcesHumainesMédicoSocialModel } from "../../../../../database/models/RessourcesHumainesMédicoSocialModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { DateMiseÀJourFichierSourceModelTestBuilder } from "../../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialQualitéModelTestBuilder } from "../../../../../database/test-builder/EtablissementTerritorialQualiteModelTestBuilder";
import { ÉtablissementTerritorialActivitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder";
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder";
import { ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { ÉtablissementTerritorialRessourcesHumainesModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialRessourcesHumainesModelTestBuilder";
import { CadreBudgétaire } from "../../../métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { MonoÉtablissement } from "../../../métier/entities/établissement-territorial-médico-social/MonoÉtablissement";
import { ÉtablissementTerritorialMédicoSocial } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { ÉtablissementTerritorialQualite } from "../../../métier/entities/ÉtablissementTerritorialQualite";
import { ÉtablissementTerritorialTestBuilder } from "../../../test-builder/ÉtablissementTerritorialTestBuilder";
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from "../../../testHelper";

describe("Établissement territorial médico-social loader", () => {
  const orm = getOrm();
  let activitéMédicoSocialModelRepository: Repository<ActivitéMédicoSocialModel>;
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>;
  let autorisationMédicoSocialModelRepository: Repository<AutorisationMédicoSocialModel>;
  let cpomModelRepository: Repository<CpomModel>;
  let budgetEtFinancesModelRepository: Repository<BudgetEtFinancesMédicoSocialModel>;
  let ressourcesHumainesModelRepository: Repository<RessourcesHumainesMédicoSocialModel>;
  let reclamtionsModelRepository: Repository<ReclamationETModel>;
  let evenementsIndesirablesModelRepository: Repository<EvenementIndesirableETModel>;
  let inspectionsEtControlesModelRepository: Repository<InspectionsControlesETModel>;

  beforeAll(async () => {
    activitéMédicoSocialModelRepository = (await orm).getRepository(ActivitéMédicoSocialModel);
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel);
    autorisationMédicoSocialModelRepository = (await orm).getRepository(AutorisationMédicoSocialModel);
    cpomModelRepository = (await orm).getRepository(CpomModel);
    budgetEtFinancesModelRepository = (await orm).getRepository(BudgetEtFinancesMédicoSocialModel);
    ressourcesHumainesModelRepository = (await orm).getRepository(RessourcesHumainesMédicoSocialModel);
    reclamtionsModelRepository = (await orm).getRepository(ReclamationETModel);
    evenementsIndesirablesModelRepository = (await orm).getRepository(EvenementIndesirableETModel);
    inspectionsEtControlesModelRepository = (await orm).getRepository(InspectionsControlesETModel);;
  });

  beforeEach(async () => {
    await clearAllTables(await orm);
    await dateMiseÀJourFichierSourceRepository.insert(DateMiseÀJourFichierSourceModelTestBuilder.créePourTousLesFichiers());
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  describe("Charge l’identité d’un établissement médico-social", () => {
    it("charge par numéro FINESS et domaine médico-social", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await cpomModelRepository.insert({
        dateDEntréeEnVigueur: "2020-04-10",
        numéroFinessÉtablissementTerritorial,
      });
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(établissementTerritorial).toStrictEqual(
        ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial({
          dateDEntréeEnVigueurDuCpom: {
            dateMiseÀJourSource: "2022-02-02",
            value: "2020-04-10",
          },
          numéroFinessEntitéJuridique: {
            dateMiseÀJourSource: "2022-02-02",
            value: numéroFinessEntitéJuridique,
          },
          numéroFinessÉtablissementTerritorial: {
            dateMiseÀJourSource: "2022-02-02",
            value: numéroFinessÉtablissementTerritorial,
          },
          domaineÉtablissementPrincipal: ""
        })
      );
    });

    it("signale que l’établissement territorial n’a pas été trouvé quand celui-ci n’existe pas", async () => {
      // GIVEN
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialLoader.chargeIdentité("numéro-finess-non-existant");

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialMédicoSocialNonTrouvée("numéro-finess-non-existant"));
    });

    it("signale que l’établissement territorial n’a pas été trouvé quand celui-ci est sanitaire", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial));
    });
  });

  describe("Charge l’activité d’un établissement médico-social", () => {
    it("charge par numéro FINESS rangé par année ascendante", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await activitéMédicoSocialModelRepository.insert([
        ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const activité = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(activité).toStrictEqual<ÉtablissementTerritorialMédicoSocial["activités"]>([
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
          année: 2019,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: {
            dateMiseÀJourSource: "2022-02-02",
            value: 80,
          },
          numéroFinessÉtablissementTerritorial,
          tauxOccupationAccueilDeJour: {
            dateMiseÀJourSource: "2022-02-02",
            value: 80,
          },
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
          année: 2020,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
          année: 2021,
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
    });
  });

  describe("permet de savoir si un établissement est le seul affilié à son entité juridique", () => {
    it("quand plusieurs établissements sont rattachés à la même entité juridique", async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = "333222111";
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel]);

      const établissementTerritorial1AffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique });
      const établissementTerritorial2AffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique });
      const établissementTerritorialNonAffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
        numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial: "321654987",
      });
      await établissementTerritorialIdentitéRepository.insert([
        établissementTerritorial1AffiliéModel,
        établissementTerritorial2AffiliéModel,
        établissementTerritorialNonAffiliéModel,
      ]);

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique);

      // THEN
      expect(établissementTerritorial.estMonoÉtablissement).toStrictEqual<MonoÉtablissement["estMonoÉtablissement"]>({
        dateMiseÀJourSource: "2022-02-02",
        value: false,
      });
    });

    it("quand un seul établissement est rattaché à la même entité juridique", async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = "333222111";
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique });
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel]);

      const établissementTerritorial1AffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique });
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorial1AffiliéModel);

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique);

      // THEN
      expect(établissementTerritorial.estMonoÉtablissement).toStrictEqual<MonoÉtablissement["estMonoÉtablissement"]>({
        dateMiseÀJourSource: "2022-02-02",
        value: true,
      });
    });
  });

  describe("Charge les autorisations d’un établissement médico-social", () => {
    it("charge les autorisations par numéro FINESS en les triant autorisations par discipline d’équipement, puis par activité et enfin par clientèle", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await autorisationMédicoSocialModelRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "11",
          clientèle: "702",
          disciplineDÉquipement: "657",
          libelléActivité: "Hébergement Complet Internat",
          libelléClientèle: "PH vieillissantes",
          libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "11",
          clientèle: "711",
          disciplineDÉquipement: "657",
          estInstallée: false,
          libelléActivité: "Hébergement Complet Internat",
          libelléClientèle: "P.A. dépendantes",
          libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "16",
          clientèle: "010",
          disciplineDÉquipement: "657",
          libelléActivité: "Prestation en milieu ordinaire",
          libelléClientèle: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
          libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "21",
          clientèle: "010",
          disciplineDÉquipement: "658",
          estInstallée: false,
          libelléActivité: "Accueil de Jour",
          libelléClientèle: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
          libelléDisciplineDÉquipement: "Accueil temporaire pour adultes handicapés",
          numéroFinessÉtablissementTerritorial,
        }),
      ]);

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const { autorisations } = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(autorisations).toStrictEqual<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité["autorisations"]>({
        dateMiseÀJourSource: "2022-02-02",
        disciplines: [
          {
            activités: [
              {
                clientèles: [
                  {
                    code: "702",
                    datesEtCapacités: {
                      capacitéAutoriséeTotale: 10,
                      capacitéInstalléeTotale: 10,
                      dateDAutorisation: "2020-01-01",
                      dateDeDernièreInstallation: "2020-01-01",
                      dateDeMiseÀJourDAutorisation: "2020-01-01",
                      estInstallée: true,
                    },
                    libellé: "PH vieillissantes",
                  },
                  {
                    code: "711",
                    datesEtCapacités: {
                      capacitéAutoriséeTotale: 10,
                      capacitéInstalléeTotale: 10,
                      dateDAutorisation: "2020-01-01",
                      dateDeDernièreInstallation: "2020-01-01",
                      dateDeMiseÀJourDAutorisation: "2020-01-01",
                      estInstallée: false,
                    },
                    libellé: "P.A. dépendantes",
                  },
                ],
                code: "11",
                libellé: "Hébergement Complet Internat",
              },
              {
                clientèles: [
                  {
                    code: "010",
                    datesEtCapacités: {
                      capacitéAutoriséeTotale: 10,
                      capacitéInstalléeTotale: 10,
                      dateDAutorisation: "2020-01-01",
                      dateDeDernièreInstallation: "2020-01-01",
                      dateDeMiseÀJourDAutorisation: "2020-01-01",
                      estInstallée: true,
                    },
                    libellé: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
                  },
                ],
                code: "16",
                libellé: "Prestation en milieu ordinaire",
              },
            ],
            code: "657",
            libellé: "Accueil temporaire pour Personnes Âgées",
          },
          {
            activités: [
              {
                clientèles: [
                  {
                    code: "010",
                    datesEtCapacités: {
                      capacitéAutoriséeTotale: 10,
                      capacitéInstalléeTotale: 10,
                      dateDAutorisation: "2020-01-01",
                      dateDeDernièreInstallation: "2020-01-01",
                      dateDeMiseÀJourDAutorisation: "2020-01-01",
                      estInstallée: false,
                    },
                    libellé: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
                  },
                ],
                code: "21",
                libellé: "Accueil de Jour",
              },
            ],
            code: "658",
            libellé: "Accueil temporaire pour adultes handicapés",
          },
        ],
      });
    });

    it("charge les capacités des autorisations installées par numéro FINESS en les triant par activités", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      const autorisationSansCapacitéInstalléeRenseignée = ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
        activité: "23",
        libelléActivité: "Anesthésie Chirurgie Ambulatoire",
        numéroFinessÉtablissementTerritorial,
      });
      autorisationSansCapacitéInstalléeRenseignée.capacitéInstalléeTotale = null;
      await autorisationMédicoSocialModelRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "11",
          capacitéAutoriséeTotale: 10,
          capacitéInstalléeTotale: 10,
          clientèle: "702",
          disciplineDÉquipement: "657",
          libelléActivité: "Hébergement Complet Internat",
          libelléClientèle: "PH vieillissantes",
          libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "11",
          capacitéAutoriséeTotale: 10,
          capacitéInstalléeTotale: 10,
          clientèle: "711",
          disciplineDÉquipement: "657",
          libelléActivité: "Hébergement Complet Internat",
          libelléClientèle: "P.A. dépendantes",
          libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "16",
          capacitéAutoriséeTotale: 100,
          capacitéInstalléeTotale: 10,
          clientèle: "010",
          disciplineDÉquipement: "657",
          libelléActivité: "Prestation en milieu ordinaire",
          libelléClientèle: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
          libelléDisciplineDÉquipement: "Accueil temporaire pour Personnes Âgées",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
          activité: "21",
          capacitéAutoriséeTotale: 10,
          capacitéInstalléeTotale: 10,
          clientèle: "010",
          disciplineDÉquipement: "658",
          estInstallée: false,
          libelléActivité: "Accueil de Jour",
          libelléClientèle: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
          libelléDisciplineDÉquipement: "Accueil temporaire pour adultes handicapés",
          numéroFinessÉtablissementTerritorial,
        }),
        autorisationSansCapacitéInstalléeRenseignée,
      ]);

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const { capacités } = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(capacités).toStrictEqual<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité["capacités"]>({
        capacitéParActivité: [
          {
            capacité: 20,
            libellé: "Hébergement Complet Internat",
          },
          {
            capacité: 10,
            libellé: "Prestation en milieu ordinaire",
          },
        ],
        dateMiseÀJourSource: "2022-02-02",
      });
    });
  });

  describe("Charge le bloc budget et finances d’un établissement médico-social", () => {
    it("charge les indicateurs d’un établissement sous des cadres budgétaires différents chaque année sur les 3 dernières années", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await budgetEtFinancesModelRepository.insert([
        ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.ERRD, { année: 2021, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.CA_PH, { année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.CA_PA, { année: 2019, numéroFinessÉtablissementTerritorial }),
      ]);

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const budgetEtFinances = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeBudgetEtFinances(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(budgetEtFinances).toStrictEqual<ÉtablissementTerritorialMédicoSocialBudgetEtFinances[]>([
        ÉtablissementTerritorialTestBuilder.créeUnBlocBudgetEtFinancesCaPaMédicoSocial({ année: 2019 }),
        ÉtablissementTerritorialTestBuilder.créeUnBlocBudgetEtFinancesCaPhMédicoSocial({ année: 2020 }),
        ÉtablissementTerritorialTestBuilder.créeUnBlocBudgetEtFinancesErrdMédicoSocial({ année: 2021 }),
      ]);
    });
  });

  describe("Charge les données du bloc ressources humaines d’un établissement médico-social", () => {
    it("charge les indicateurs du bloc ressources humaines sur les 3 dernières années d’un établissement ERRD", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await budgetEtFinancesModelRepository.insert(
        ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.ERRD, { année: 2021, numéroFinessÉtablissementTerritorial })
      );
      await ressourcesHumainesModelRepository.insert([
        ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
      ]);

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const ressourceHumaines = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeRessourcesHumaines(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(ressourceHumaines).toStrictEqual<ÉtablissementTerritorialMédicoSocialRessourcesHumaines[]>([
        ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({ année: 2019 }),
        ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({ année: 2020 }),
        ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({ année: 2021 }),
      ]);
    });

    it("charge les indicateurs du bloc ressources humaines sur les 3 dernières années d’un établissement CA", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await budgetEtFinancesModelRepository.insert(
        ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder.créeMédicoSocial(CadreBudgétaire.CA_PH, { année: 2021, numéroFinessÉtablissementTerritorial })
      );
      await ressourcesHumainesModelRepository.insert([
        ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialRessourcesHumainesModelTestBuilder.créeMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
      ]);

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const ressourceHumaines = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeRessourcesHumaines(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(ressourceHumaines).toStrictEqual<ÉtablissementTerritorialMédicoSocialRessourcesHumaines[]>([
        ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({
          année: 2019,
          nombreDEtpRéalisés: { dateMiseÀJourSource: "2022-02-02", valeur: 47.42 },
        }),
        ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({
          année: 2020,
          nombreDEtpRéalisés: { dateMiseÀJourSource: "2022-02-02", valeur: 47.42 },
        }),
        ÉtablissementTerritorialTestBuilder.créeUnBlocRessourcesHumainesMédicoSocial({
          année: 2021,
          nombreDEtpRéalisés: { dateMiseÀJourSource: "2022-02-02", valeur: 47.42 },
        }),
      ]);
    });
  });

  describe("Charge les données du bloc qualité d'un établissement médico-social", () => {
    it("charge les indicateurs du bloc qualité sur la dernière années d’un établissement", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await reclamtionsModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeReclamations({ annee: 2023, numéroFinessÉtablissementTerritorial })
      ]);

      await evenementsIndesirablesModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeEvenementsIndesirables({ annee: 2023, numéroFinessÉtablissementTerritorial })
      ]);

      await inspectionsEtControlesModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeLesInspectionsEtControles({
          numéroFinessÉtablissementTerritorial,
          dateVisite: '2022-12-19',
          dateRapport: '2023-02-20',
          nombreEcart: 5,
          nombreRemarque: 6,
          injonction: 2,
          prescription: 8,
          saisineCng: 7,
        })
      ]);

      await inspectionsEtControlesModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeLesInspectionsEtControles({
          numéroFinessÉtablissementTerritorial,
          typeMission: 'Inspection',
          themeRegional: 'P23 Contrôle de la sécurité et de la qualité de la prise en charge médicamenteuse des résidents en EHPAD',
          dateVisite: '2022-12-19',
          dateRapport: '2023-02-20',
          nombreRemarque: 6,
          saisineCng: 7,
          saisineJuridiction: 3,
          saisineParquet: 3,
          saisineAutre: 3,
        })
      ]);

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm);

      // WHEN
      const qualite = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeQualite(numéroFinessÉtablissementTerritorial)
      expect(qualite).toStrictEqual<ÉtablissementTerritorialQualite>(ÉtablissementTerritorialTestBuilder.créeUnBlocQualité());
    });
  })

});