import { DataSource } from "typeorm";

import { ActivitéMédicoSocialModel } from "../../database/models/ActivitéMédicoSocialModel";
import { ActivitéSanitaireEntitéJuridiqueModel } from "../../database/models/ActivitéSanitaireEntitéJuridiqueModel";
import { ActivitéSanitaireModel } from "../../database/models/ActivitéSanitaireModel";
import { AutorisationMédicoSocialModel } from "../../database/models/AutorisationMédicoSocialModel";
import { AutorisationSanitaireModel } from "../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../database/models/AutreActivitéSanitaireModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "../../database/models/BudgetEtFinancesEntiteJuridiqueModel";
import { BudgetEtFinancesMédicoSocialModel } from "../../database/models/BudgetEtFinancesMédicoSocialModel";
import { BudgetEtFinancesSanitaireModel } from "../../database/models/BudgetEtFinancesSanitaireModel";
import { CapacitesSanitaireEntiteJuridiqueModel } from "../../database/models/CapacitesSanitaireEntiteJuridiqueModel";
import { CapacitéAutorisationSanitaireModel } from "../../database/models/CapacitéAutorisationSanitaireModel";
import { CpomModel } from "../../database/models/CpomModel";
import { DateMiseÀJourFichierSourceModel } from "../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../database/models/EntitéJuridiqueModel";
import { InstitutionModel } from "../../database/models/InstitutionModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { RessourcesHumainesMédicoSocialModel } from "../../database/models/RessourcesHumainesMédicoSocialModel";
import { RoleModel } from "../../database/models/RoleModel";
import { UserListEtablissementModel } from "../../database/models/UserListEtablissementModel";
import { UserListModel } from "../../database/models/UserListModel";
import { UtilisateurModel } from "../../database/models/UtilisateurModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../database/models/ÉtablissementTerritorialIdentitéModel";
import { typeOrmOrm } from "./infrastructure/gateways/orm/typeOrmOrm";
import { EnvironmentVariables } from "./métier/gateways/EnvironmentVariables";
import { Logger } from "./métier/gateways/Logger";

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: "postgres://helios:h3li0s@localhost:5433/helios",
  NEXTAUTH_SECRET: "random-text",
  NEXTAUTH_URL: "http://fake-url-helios.com",
  ORM_DEBUG: "true",
  SCALINGO_TOKEN: "fake_token",
  SENTRY_AUTH_TOKEN: "1234567890",
  SENTRY_DSN: "https://fake-sentry.io/11",
  SENTRY_ENVIRONMENT: "test",
  TIME_OF_CACHE_PAGE: "72000",
  APP_BASE_URL: "http://localhost:3000",
  JWT_SECRET_KEY: "SECRET_KEY",
  TIPIMAIL_SENDER_NAME: "name-test",
  TIPIMAIL_SENDER_ADDRESS: "email.test@test.fr",
  TIPIMAIL_APIUSER: "test-api-user",
  TIPIMAIL_APIKEY: "test-api-key"
};

export function getOrm(): Promise<DataSource> {
  return typeOrmOrm(environmentVariables);
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

export const clearAllTables = async (orm: DataSource) => {
  await orm.createQueryBuilder().delete().from(ActivitéSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(ActivitéSanitaireEntitéJuridiqueModel).execute();
  await orm.createQueryBuilder().delete().from(ActivitéMédicoSocialModel).execute();
  await orm.createQueryBuilder().delete().from(ÉtablissementTerritorialIdentitéModel).execute();
  await orm.createQueryBuilder().delete().from(EntitéJuridiqueModel).execute();
  await orm.createQueryBuilder().delete().from(DateMiseÀJourFichierSourceModel).execute();
  await orm.createQueryBuilder().delete().from(AutorisationMédicoSocialModel).execute();
  await orm.createQueryBuilder().delete().from(AutorisationSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(ÉquipementMatérielLourdSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(AutreActivitéSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(ReconnaissanceContractuelleSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(CapacitéAutorisationSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(CpomModel).execute();
  await orm.createQueryBuilder().delete().from(BudgetEtFinancesMédicoSocialModel).execute();
  await orm.createQueryBuilder().delete().from(BudgetEtFinancesEntiteJuridiqueModel).execute();
  await orm.createQueryBuilder().delete().from(BudgetEtFinancesSanitaireModel).execute();
  await orm.createQueryBuilder().delete().from(RessourcesHumainesMédicoSocialModel).execute();
  await orm.createQueryBuilder().delete().from(CapacitesSanitaireEntiteJuridiqueModel).execute();
  await orm.createQueryBuilder().delete().from(UserListModel).execute();
  await orm.createQueryBuilder().delete().from(UserListEtablissementModel).execute();
  await orm.createQueryBuilder().delete().from(UtilisateurModel).execute();
  await orm.createQueryBuilder().delete().from(InstitutionModel).execute();
  await orm.createQueryBuilder().delete().from(RoleModel).execute();
};

export const numéroFinessEntitéJuridique = "010018407";

export const numéroFinessÉtablissementTerritorial = "010000040";

export const numéroFinessÉtablissementTerritorialSanitaire = "010000000";
