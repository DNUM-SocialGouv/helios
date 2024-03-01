import * as Sentry from "@sentry/nextjs";

import { ChangePasswordLoader } from "../métier/gateways/ChangePasswordLoader";
import { EntitéJuridiqueLoader } from "../métier/gateways/EntitéJuridiqueLoader";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { FavorisLoader } from "../métier/gateways/FavorisLoader";
import { Logger } from "../métier/gateways/Logger";
import { RechercheLoader } from "../métier/gateways/RechercheLoader";
import { ReclamationLoader } from "../métier/gateways/ReclamationLoader";
import { SearchHistoryLoader } from "../métier/gateways/SearchHistoryLoader";
import { UtilisateurLoader } from "../métier/gateways/UtilisateurLoader";
import { ÉtablissementTerritorialMédicoSocialLoader } from "../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader";
import { ÉtablissementTerritorialRattachéLoader } from "../métier/gateways/ÉtablissementTerritorialRattachéLoader";
import { ÉtablissementTerritorialSanitaireLoader } from "../métier/gateways/ÉtablissementTerritorialSanitaireLoader";
import { TypeOrmChangePasswordLoader } from "./gateways/change-password-loader/TypeOrmChangePasswordLoader";
import { dotEnvConfig } from "./gateways/dot-env/dotEnvConfig";
import { TypeOrmEntitéJuridiqueLoader } from "./gateways/entité-juridique-loader/TypeOrmEntitéJuridiqueLoader";
import { NodeEnvironmentVariables } from "./gateways/environnement-variables/NodeEnvironmentVariables";
import { TypeOrmFavorisLoader } from "./gateways/favoris-loader/TypeOrmFavorisLoader";
import { TypeOrmForgetPasswordLoader } from "./gateways/forget-password-loader/TypeOrmForgetPasswordLoader";
import { TypeOrmInstitutionLoader } from "./gateways/institution-loader/TypeOrmInstitutionLoader";
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { typeOrmOrm } from "./gateways/orm/typeOrmOrm";
import { TypeOrmProfileLoader } from "./gateways/profile-loader/TypeOrmProfileLoader";
import { TypeOrmRechercheLoader } from "./gateways/recherche-loader/TypeOrmRechercheLoader";
import { TypeOrmReclamationLoader } from "./gateways/reclamation-loader/TypeOrmReclamationLoader";
import { TypeOrmRoleLoader } from "./gateways/role-loader/TypeOrmRoleLoader";
import { TypeOrmSearchHistoryLoader } from "./gateways/search-history-loader/TypeOrmSearchHistoryLoader";
import { TypeOrmUtilisateurLoader } from "./gateways/utilisateur-loader/TypeOrmUtilisateurLoader";
import { TypeOrmÉtablissementTerritorialMédicoSocialLoader } from "./gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialMédicoSocialLoader";
import { TypeOrmÉtablissementTerritorialRattachéLoader } from "./gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialRattachéLoader";
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from "./gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialSanitaireLoader";

export type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables;
  entitéJuridiqueLoader: EntitéJuridiqueLoader;
  logger: Logger;
  utilisateurLoader: UtilisateurLoader;
  rechercheLoader: RechercheLoader;
  reclamationLoader: ReclamationLoader;
  établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader;
  établissementTerritorialRattachéLoader: ÉtablissementTerritorialRattachéLoader;
  établissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader;
  favorisLoader: FavorisLoader;
  changePasswordLoader: ChangePasswordLoader;
  forgetPasswordLoader: TypeOrmForgetPasswordLoader;
  searchHistoryLoader: SearchHistoryLoader;
  profileLoader: TypeOrmProfileLoader;
  roleLoader: TypeOrmRoleLoader;
  institutionLoader: TypeOrmInstitutionLoader;
}>;

const createDependencies = (): Dependencies => {
  dotEnvConfig(process.env.NODE_ENV);
  const logger = new ConsoleLogger();
  const environmentVariables = new NodeEnvironmentVariables(logger);
  const orm = typeOrmOrm(environmentVariables);

  Sentry.init({
    dsn: environmentVariables.SENTRY_DSN,
    environment: environmentVariables.SENTRY_ENVIRONMENT,
    tracesSampleRate: 1.0,
  });

  return {
    entitéJuridiqueLoader: new TypeOrmEntitéJuridiqueLoader(orm),
    environmentVariables,
    logger,
    utilisateurLoader: new TypeOrmUtilisateurLoader(orm),
    rechercheLoader: new TypeOrmRechercheLoader(orm),
    reclamationLoader: new TypeOrmReclamationLoader(orm),
    établissementTerritorialMédicoSocialLoader: new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm),
    établissementTerritorialRattachéLoader: new TypeOrmÉtablissementTerritorialRattachéLoader(orm),
    établissementTerritorialSanitaireLoader: new TypeOrmÉtablissementTerritorialSanitaireLoader(orm),
    favorisLoader: new TypeOrmFavorisLoader(orm),
    changePasswordLoader: new TypeOrmChangePasswordLoader(orm),
    forgetPasswordLoader: new TypeOrmForgetPasswordLoader(orm),
    searchHistoryLoader: new TypeOrmSearchHistoryLoader(orm),
    profileLoader: new TypeOrmProfileLoader(orm),
    roleLoader: new TypeOrmRoleLoader(orm),
    institutionLoader: new TypeOrmInstitutionLoader(orm),
  };
};

export const dependencies = createDependencies();
