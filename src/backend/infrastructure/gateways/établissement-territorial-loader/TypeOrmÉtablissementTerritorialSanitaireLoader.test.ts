import { Repository } from "typeorm";

import { ActivitéSanitaireMensuelModel } from "../../../../../database/models/ActiviteSanitaireMensuelModel";
import { ActivitéSanitaireModel } from "../../../../../database/models/ActivitéSanitaireModel";
import { AllocationRessourceETModel } from "../../../../../database/models/AllocationRessourceETModel";
import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { BudgetEtFinancesSanitaireModel } from "../../../../../database/models/BudgetEtFinancesSanitaireModel";
import { CapacitéAutorisationSanitaireModel } from "../../../../../database/models/CapacitéAutorisationSanitaireModel";
import { DateMiseÀJourFichierSourceModel } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { EvenementIndesirableETModel } from "../../../../../database/models/EvenementIndesirableModel";
import { InspectionsControlesETModel } from "../../../../../database/models/InspectionsModel";
import { ReclamationETModel } from "../../../../../database/models/ReclamationETModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../../../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { DateMiseÀJourFichierSourceModelTestBuilder } from "../../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialQualitéModelTestBuilder } from "../../../../../database/test-builder/EtablissementTerritorialQualiteModelTestBuilder";
import { ÉtablissementTerritorialActivitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder";
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { EntitéJuridiqueBudgetFinance } from "../../../métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialQualite } from "../../../métier/entities/ÉtablissementTerritorialQualite";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { ÉtablissementTerritorialTestBuilder } from "../../../test-builder/ÉtablissementTerritorialTestBuilder";
import {
  clearAllTables,
  getOrm,
  numéroFinessEntitéJuridique,
  numéroFinessÉtablissementTerritorial,
  numéroFinessÉtablissementTerritorialSanitaire,
} from "../../../testHelper";
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from "./TypeOrmÉtablissementTerritorialSanitaireLoader";

describe("Établissement territorial sanitaire loader", () => {
  const orm = getOrm();
  let activitéSanitaireModelRepository: Repository<ActivitéSanitaireModel>;
  let activitéSanitaireMensuelModelRepository: Repository<ActivitéSanitaireMensuelModel>;
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>;
  let autorisationSanitaireRepository: Repository<AutorisationSanitaireModel>;
  let équipementMatérielLourdSanitaireRepository: Repository<ÉquipementMatérielLourdSanitaireModel>;
  let autreActivitéSanitaireRepository: Repository<AutreActivitéSanitaireModel>;
  let reconnaissanceContractuelleSanitaireRepository: Repository<ReconnaissanceContractuelleSanitaireModel>;
  let capacitéSanitaireRepository: Repository<CapacitéAutorisationSanitaireModel>;
  let reclamtionsModelRepository: Repository<ReclamationETModel>;
  let evenementsIndesirablesModelRepository: Repository<EvenementIndesirableETModel>;
  let inspectionsEtControlesModelRepository: Repository<InspectionsControlesETModel>;
  let budgetEtFinancesSanitaireRepository: Repository<BudgetEtFinancesSanitaireModel>;
  let allocationRessourceRepository: Repository<AllocationRessourceETModel>;

  beforeAll(async () => {
    activitéSanitaireModelRepository = (await orm).getRepository(ActivitéSanitaireModel);
    activitéSanitaireMensuelModelRepository = (await orm).getRepository(ActivitéSanitaireMensuelModel);
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel);
    autorisationSanitaireRepository = (await orm).getRepository(AutorisationSanitaireModel);
    équipementMatérielLourdSanitaireRepository = (await orm).getRepository(ÉquipementMatérielLourdSanitaireModel);
    autreActivitéSanitaireRepository = (await orm).getRepository(AutreActivitéSanitaireModel);
    reconnaissanceContractuelleSanitaireRepository = (await orm).getRepository(ReconnaissanceContractuelleSanitaireModel);
    capacitéSanitaireRepository = (await orm).getRepository(CapacitéAutorisationSanitaireModel);
    reclamtionsModelRepository = (await orm).getRepository(ReclamationETModel);
    evenementsIndesirablesModelRepository = (await orm).getRepository(EvenementIndesirableETModel);
    inspectionsEtControlesModelRepository = (await orm).getRepository(InspectionsControlesETModel);
    budgetEtFinancesSanitaireRepository = (await orm).getRepository(BudgetEtFinancesSanitaireModel);
    allocationRessourceRepository = (await orm).getRepository(AllocationRessourceETModel);
  });

  beforeEach(async () => {
    await clearAllTables(await orm);
    await dateMiseÀJourFichierSourceRepository.insert(DateMiseÀJourFichierSourceModelTestBuilder.créePourTousLesFichiers());
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  describe("Charge l’identité d’un établissement sanitaire", () => {
    it("charge par numéro FINESS et domaine sanitaire", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(établissementTerritorial).toStrictEqual(
        ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire({
          numéroFinessEntitéJuridique: {
            dateMiseÀJourSource: "2022-02-02",
            value: numéroFinessEntitéJuridique,
          },
          numéroFinessÉtablissementTerritorial: {
            dateMiseÀJourSource: "2022-02-02",
            value: numéroFinessÉtablissementTerritorial,
          },
        })
      );
    });

    it("signale que l’établissement territorial n’a pas été trouvé quand celui-ci n’existe pas", async () => {
      // GIVEN
      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeIdentité("numéro-finess-non-existant");

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialSanitaireNonTrouvée("numéro-finess-non-existant"));
    });

    it("signale que l’établissement territorial n’a pas été trouvé quand celui-ci est médico-social", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeIdentité(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial));
    });
  });

  describe("Charge l’activité d’un établissement sanitaire", () => {
    it("charge par numéro FINESS rangé par année ascendante", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await activitéSanitaireModelRepository.insert([
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({
          année: 2020,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({
          année: 2019,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({
          année: 2018,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({
          année: 2017,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({
          année: 2016,
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const activité = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(activité).toStrictEqual<ÉtablissementTerritorialSanitaireActivité[]>([
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2016,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2022-02-02",
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2017,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2022-02-02",
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2018,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2022-02-02",
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2019,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2022-02-02",
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2020,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2022-02-02",
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
    });
  });


  describe("Charge l’activité mensuel d’un établissement sanitaire", () => {
    it("charge par numéro FINESS", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await activitéSanitaireMensuelModelRepository.insert([
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaireMensuel({
          numeroFinessEtablissementTerritorial: numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaireMensuel({
          mois: 2,
          numeroFinessEtablissementTerritorial: numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaireMensuel({
          mois: 3,
          nombreSéjoursCompletsChirurgie: 130,
          numeroFinessEtablissementTerritorial: numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const activitéMensuelle = await typeOrmÉtablissementTerritorialLoader.chargeActivitéMensuel(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(activitéMensuelle.activitesSanitaireMensuelList).toHaveLength(3);
      expect(activitéMensuelle.activitesSanitaireMensuelList[1].nombreSéjoursCompletsChirurgie).toBe(0);
      expect(activitéMensuelle.activitesSanitaireMensuelList[2].nombreSéjoursCompletsChirurgie).toBe(70);
      expect(activitéMensuelle.dateDeMiseAJour).toBe("2022-02-02");
    });
  });

  describe("Charge les autorisations et capacités d’un établissement sanitaire", () => {
    it("charge les capacités", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await capacitéSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeCapacitéSanitaire({
          année: 2021,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeCapacitéSanitaire({
          année: 2022,
          nombreDeLitsEnChirurgie: 10,
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const { capacités } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(capacités[0]).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité["capacités"][0]>({
        année: 2021,
        dateMiseÀJourSource: "2022-02-02",
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

    it("charge les autorisations groupées par activité, modalité puis par forme. Chaque niveau de groupe est trié par ordre croissant de code.", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await autorisationSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: "16",
          codeForme: "14",
          codeModalité: "45",
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: "Non saisonnier",
          libelléModalité: "Hémodialyse à domicile",
          numéroAutorisationArhgos: "01-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: "16",
          codeForme: "15",
          codeModalité: "42",
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: "Pas de forme",
          libelléModalité: "Hémodialyse en unité médicalisée",
          numéroAutorisationArhgos: "02-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: "50",
          codeForme: "00",
          codeModalité: "46",
          libelléActivité: "Soins de suite et de réadaptation non spécialisés",
          libelléForme: "Pas de forme",
          libelléModalité: "Dialyse péritonéale à domicile",
          numéroAutorisationArhgos: "03-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: "16",
          codeForme: "15",
          codeModalité: "45",
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: "Non saisonnier",
          libelléModalité: "Hémodialyse à domicile",
          numéroAutorisationArhgos: "04-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const { autorisations } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(autorisations).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité["autorisations"]>({
        activités: [
          {
            code: "16",
            libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
            modalités: [
              {
                code: "42",
                formes: [
                  {
                    autorisationSanitaire: {
                      dateDAutorisation: "2005-10-11",
                      dateDeFin: "2026-05-03",
                      dateDeMiseEnOeuvre: "2008-12-04",
                      numéroArhgos: "02-00-0000",
                    },
                    code: "15",
                    libellé: "Pas de forme",
                  },
                ],
                libellé: "Hémodialyse en unité médicalisée",
              },
              {
                code: "45",
                formes: [
                  {
                    autorisationSanitaire: {
                      dateDAutorisation: "2005-10-11",
                      dateDeFin: "2026-05-03",
                      dateDeMiseEnOeuvre: "2008-12-04",
                      numéroArhgos: "01-00-0000",
                    },
                    code: "14",
                    libellé: "Non saisonnier",
                  },
                  {
                    autorisationSanitaire: {
                      dateDAutorisation: "2005-10-11",
                      dateDeFin: "2026-05-03",
                      dateDeMiseEnOeuvre: "2008-12-04",
                      numéroArhgos: "04-00-0000",
                    },
                    code: "15",
                    libellé: "Non saisonnier",
                  },
                ],
                libellé: "Hémodialyse à domicile",
              },
            ],
          },
          {
            code: "50",
            libellé: "Soins de suite et de réadaptation non spécialisés",
            modalités: [
              {
                code: "46",
                formes: [
                  {
                    autorisationSanitaire: {
                      dateDAutorisation: "2005-10-11",
                      dateDeFin: "2026-05-03",
                      dateDeMiseEnOeuvre: "2008-12-04",
                      numéroArhgos: "03-00-0000",
                    },
                    code: "00",
                    libellé: "Pas de forme",
                  },
                ],
                libellé: "Dialyse péritonéale à domicile",
              },
            ],
          },
        ],
        dateMiseÀJourSource: "2022-02-02",
      });
    });

    it("charge les autres activités groupées par activité, modalité puis par forme. Chaque niveau de groupe est trié par ordre croissant de code.", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await autreActivitéSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: "A1",
          codeForme: "15",
          codeModalité: "M1",
          libelléActivité: "Dépôt de sang",
          libelléForme: "Pas de forme",
          libelléModalité: "Dépôt d'urgence",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: "A1",
          codeForme: "14",
          codeModalité: "M2",
          libelléActivité: "Dépôt de sang",
          libelléForme: "Forme non précisée",
          libelléModalité: "Dépôt relais",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: "A1",
          codeForme: "15",
          codeModalité: "M2",
          libelléActivité: "Dépôt de sang",
          libelléForme: "Forme non précisée",
          libelléModalité: "Dépôt relais",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: "A0",
          codeForme: "00",
          codeModalité: "M0",
          libelléActivité: "Installation de chirurgie esthétique",
          libelléForme: "Pas de forme",
          libelléModalité: "Dépôt d'urgence",
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const { autresActivités } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(autresActivités).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité["autresActivités"]>({
        activités: [
          {
            code: "A0",
            libellé: "Installation de chirurgie esthétique",
            modalités: [
              {
                code: "M0",
                formes: [
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: "2019-06-03",
                      dateDeFin: "2024-08-31",
                      dateDeMiseEnOeuvre: "2019-06-03",
                    },
                    code: "00",
                    libellé: "Pas de forme",
                  },
                ],
                libellé: "Dépôt d'urgence",
              },
            ],
          },
          {
            code: "A1",
            libellé: "Dépôt de sang",
            modalités: [
              {
                code: "M1",
                formes: [
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: "2019-06-03",
                      dateDeFin: "2024-08-31",
                      dateDeMiseEnOeuvre: "2019-06-03",
                    },
                    code: "15",
                    libellé: "Pas de forme",
                  },
                ],
                libellé: "Dépôt d'urgence",
              },
              {
                code: "M2",
                formes: [
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: "2019-06-03",
                      dateDeFin: "2024-08-31",
                      dateDeMiseEnOeuvre: "2019-06-03",
                    },
                    code: "14",
                    libellé: "Forme non précisée",
                  },
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: "2019-06-03",
                      dateDeFin: "2024-08-31",
                      dateDeMiseEnOeuvre: "2019-06-03",
                    },
                    code: "15",
                    libellé: "Forme non précisée",
                  },
                ],
                libellé: "Dépôt relais",
              },
            ],
          },
        ],
        dateMiseÀJourSource: "2022-02-02",
      });
    });

    it("charge les reconnaissances contractuelles groupées par activité, modalité puis par forme. Chaque niveau de groupe est trié par ordre croissant de code.", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await reconnaissanceContractuelleSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: "R7",
          codeForme: "01",
          codeModalité: "N8",
          libelléActivité: "Surveillance continue",
          libelléForme: "Hospitalisation complète (24 heures consécutives ou plus)",
          libelléModalité: "USC polyvalente - adulte (non adossée à une unité de réanimation)",
          numéroAutorisationArhgos: "01-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: "R7",
          codeForme: "01",
          codeModalité: "N4",
          libelléActivité: "Surveillance continue",
          libelléForme: "Hospitalisation complète (24 heures consécutives ou plus)",
          libelléModalité: "Equipe mobile",
          numéroAutorisationArhgos: "02-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: "R7",
          codeForme: "00",
          codeModalité: "N8",
          libelléActivité: "Surveillance continue",
          libelléForme: "Pas de forme",
          libelléModalité: "USC polyvalente - adulte (non adossée à une unité de réanimation)",
          numéroAutorisationArhgos: "03-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: "S6",
          codeForme: "00",
          codeModalité: "B3",
          libelléActivité: "Structure spécifique d'hospitalisation",
          libelléForme: "Pas de forme",
          libelléModalité: "Clinique ouverte",
          numéroAutorisationArhgos: "04-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const { reconnaissancesContractuelles } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(
        numéroFinessÉtablissementTerritorial
      );

      // THEN
      expect(reconnaissancesContractuelles).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité["reconnaissancesContractuelles"]>({
        activités: [
          {
            code: "R7",
            libellé: "Surveillance continue",
            modalités: [
              {
                code: "N4",
                formes: [
                  {
                    code: "01",
                    libellé: "Hospitalisation complète (24 heures consécutives ou plus)",
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: "2013-11-30",
                      dateDEffetCpom: "2012-12-01",
                      dateDeFinCpom: "2018-11-30",
                      numéroArhgos: "02-00-0000",
                      numéroCpom: "01-00-C00000",
                    },
                  },
                ],
                libellé: "Equipe mobile",
              },
              {
                code: "N8",
                formes: [
                  {
                    code: "00",
                    libellé: "Pas de forme",
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: "2013-11-30",
                      dateDEffetCpom: "2012-12-01",
                      dateDeFinCpom: "2018-11-30",
                      numéroArhgos: "03-00-0000",
                      numéroCpom: "01-00-C00000",
                    },
                  },
                  {
                    code: "01",
                    libellé: "Hospitalisation complète (24 heures consécutives ou plus)",
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: "2013-11-30",
                      dateDEffetCpom: "2012-12-01",
                      dateDeFinCpom: "2018-11-30",
                      numéroArhgos: "01-00-0000",
                      numéroCpom: "01-00-C00000",
                    },
                  },
                ],
                libellé: "USC polyvalente - adulte (non adossée à une unité de réanimation)",
              },
            ],
          },
          {
            code: "S6",
            libellé: "Structure spécifique d'hospitalisation",
            modalités: [
              {
                code: "B3",
                formes: [
                  {
                    code: "00",
                    libellé: "Pas de forme",
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: "2013-11-30",
                      dateDEffetCpom: "2012-12-01",
                      dateDeFinCpom: "2018-11-30",
                      numéroArhgos: "04-00-0000",
                      numéroCpom: "01-00-C00000",
                    },
                  },
                ],
                libellé: "Clinique ouverte",
              },
            ],
          },
        ],
        dateMiseÀJourSource: "2022-02-02",
      });
    });

    it("charge les équipements matériels lourds groupés par équipement. Chaque autorisation d’équipement est trié par ordre croissant.", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );
      await équipementMatérielLourdSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeÉquipementMatérielLourdSanitaire({
          codeÉquipementMatérielLourd: "05602",
          libelléÉquipementMatérielLourd: "Scanographe à utilisation médicale",
          numéroAutorisationArhgos: "01-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeÉquipementMatérielLourdSanitaire({
          codeÉquipementMatérielLourd: "05602",
          libelléÉquipementMatérielLourd: "Scanographe à utilisation médicale",
          numéroAutorisationArhgos: "02-00-0000",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeÉquipementMatérielLourdSanitaire({
          codeÉquipementMatérielLourd: "06201",
          libelléÉquipementMatérielLourd: "Appareil d'IRM à utilisation clinique",
          numéroAutorisationArhgos: "11-11-1111",
          numéroFinessÉtablissementTerritorial,
        }),
      ]);
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const { équipementsMatérielsLourds } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(équipementsMatérielsLourds).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité["équipementsMatérielsLourds"]>({
        dateMiseÀJourSource: "2022-02-02",
        équipements: [
          {
            autorisations: [
              {
                dateDAutorisation: "2007-11-06",
                dateDeFin: "2029-01-01",
                dateDeMiseEnOeuvre: "2011-10-19",
                numéroArhgos: "01-00-0000",
              },
              {
                dateDAutorisation: "2007-11-06",
                dateDeFin: "2029-01-01",
                dateDeMiseEnOeuvre: "2011-10-19",
                numéroArhgos: "02-00-0000",
              },
            ],
            code: "05602",
            libellé: "Scanographe à utilisation médicale",
          },
          {
            autorisations: [
              {
                dateDAutorisation: "2007-11-06",
                dateDeFin: "2029-01-01",
                dateDeMiseEnOeuvre: "2011-10-19",
                numéroArhgos: "11-11-1111",
              },
            ],
            code: "06201",
            libellé: "Appareil d'IRM à utilisation clinique",
          },
        ],
      });
    });

    it("renvoit un tableau vide si l’établissement n’a pas de capacités", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        })
      );

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const { capacités } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial);

      // THEN
      expect(capacités).toStrictEqual([]);
    });
  });

  describe("Charge les données du bloc qualité d'un établissement sanitaire", () => {
    it("charge les indicateurs du bloc qualité sur la dernière années d’un établissement", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      );
      await reclamtionsModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeReclamations({ annee: 2023, numéroFinessÉtablissementTerritorial }),
      ]);

      await evenementsIndesirablesModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeEvenementsIndesirables({ annee: 2023, numéroFinessÉtablissementTerritorial }),
      ]);

      await inspectionsEtControlesModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeLesInspectionsEtControles({
          numéroFinessÉtablissementTerritorial,
          dateVisite: "2022-12-19",
          dateRapport: "2023-02-20",
          nombreEcart: 5,
          nombreRemarque: 6,
          injonction: 2,
          prescription: 8,
          saisineCng: 7,
        }),
      ]);

      await inspectionsEtControlesModelRepository.insert([
        ÉtablissementTerritorialQualitéModelTestBuilder.créeLesInspectionsEtControles({
          numéroFinessÉtablissementTerritorial,
          typeMission: "Inspection",
          themeRegional: "P23 Contrôle de la sécurité et de la qualité de la prise en charge médicamenteuse des résidents en EHPAD",
          dateVisite: "2022-12-19",
          dateRapport: "2023-02-20",
          nombreRemarque: 6,
          saisineCng: 7,
          saisineJuridiction: 3,
          saisineParquet: 3,
          saisineAutre: 3,
        }),
      ]);

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const qualite = await typeOrmÉtablissementTerritorialLoader.chargeQualite(numéroFinessÉtablissementTerritorial);
      expect(qualite).toStrictEqual<ÉtablissementTerritorialQualite>(ÉtablissementTerritorialTestBuilder.créeUnBlocQualité());
    });
  });

  describe("charge les budget et finance d'une ET Sanitaire", () => {
    it("charge les budget et finance par numero Finess ET Sanitaire", async () => {
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));

      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique: numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorialSanitaire,
        })
      );

      const budgetEtFinancesSanitaire = new BudgetEtFinancesSanitaireModel();
      budgetEtFinancesSanitaire.numéroFinessEtablissementTerritorial = numéroFinessÉtablissementTerritorialSanitaire;
      budgetEtFinancesSanitaire.année = 2022;
      budgetEtFinancesSanitaire.depensesTitreIGlobal = -100;
      budgetEtFinancesSanitaire.depensesTitreIIGlobal = -200;
      budgetEtFinancesSanitaire.depensesTitreIIIGlobal = -300;
      budgetEtFinancesSanitaire.depensesTitreIVGlobal = -400;
      budgetEtFinancesSanitaire.recettesTitreIGlobal = 100;
      budgetEtFinancesSanitaire.recettesTitreIIGlobal = 200;
      budgetEtFinancesSanitaire.recettesTitreIIIGlobal = 300;
      budgetEtFinancesSanitaire.recettesTitreIVGlobal = 400;
      budgetEtFinancesSanitaire.depensesTitreIH = -10;
      budgetEtFinancesSanitaire.depensesTitreIIH = -20;
      budgetEtFinancesSanitaire.depensesTitreIIIH = -30;
      budgetEtFinancesSanitaire.depensesTitreIVH = -40;
      budgetEtFinancesSanitaire.recettesTitreIH = 10;
      budgetEtFinancesSanitaire.recettesTitreIIH = 20;
      budgetEtFinancesSanitaire.recettesTitreIIIH = 30;
      budgetEtFinancesSanitaire.resultatNetComptableSan = 0.1;
      budgetEtFinancesSanitaire.tauxDeCafNetteSan = 0.2;
      budgetEtFinancesSanitaire.ratioDependanceFinanciere = 0.3;

      await budgetEtFinancesSanitaireRepository.insert(budgetEtFinancesSanitaire);

      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);

      // WHEN
      const budgetFinance = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeBudgetFinance(numéroFinessÉtablissementTerritorialSanitaire);

      // THEN
      expect(budgetFinance).toStrictEqual([
        {
          année: 2022,
          dateMiseÀJourSource: "2022-02-02",
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

          tauxDeCafNetSan: 0.2,
        } as EntitéJuridiqueBudgetFinance,
      ]);
    });
  });

  describe("Allocation de ressource", () => {

    it("recuperer la liste des allocations de ressource", async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }));

      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
          numéroFinessEntitéJuridique: numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorialSanitaire,
        })
      );

      const allocationRessource = new AllocationRessourceETModel();
      allocationRessource.numeroFinessEtablissementTerritorial = numéroFinessÉtablissementTerritorialSanitaire;
      allocationRessource.année = 2020;
      allocationRessource.enveloppe = "MIGAC";
      allocationRessource.sousEnveloppe = "MIG";
      allocationRessource.mois = "1/2022";
      allocationRessource.modeDelegation = "BASE";
      allocationRessource.montant = 53643;

      await allocationRessourceRepository.insert(allocationRessource);


      // WHEN
      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm);
      const allocationRessourceEt = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeAllocationRessource(numéroFinessÉtablissementTerritorialSanitaire);

      // THEN

      expect(allocationRessourceEt.dateMiseÀJourSource).toBe("2022-02-02");
      expect(allocationRessourceEt.data).toHaveLength(1);
      expect(allocationRessourceEt.data[0].année).toBe(2020);
      expect(allocationRessourceEt.data[0].allocationRessoure).toHaveLength(1);
      expect(allocationRessourceEt.data[0].allocationRessoure[0].enveloppe).toBe("MIGAC");

    });
  });
});
