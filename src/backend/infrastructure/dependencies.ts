import * as Sentry from "@sentry/nextjs";

import { ChangePasswordLoader } from "../métier/gateways/ChangePasswordLoader";
import { EntitéJuridiqueLoader } from "../métier/gateways/EntitéJuridiqueLoader";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { FavorisLoader } from "../métier/gateways/FavorisLoader";
import { Logger } from "../métier/gateways/Logger";
import { RechercheLoader } from "../métier/gateways/RechercheLoader";
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
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { typeOrmOrm } from "./gateways/orm/typeOrmOrm";
import { TypeOrmRechercheLoader } from "./gateways/recherche-loader/TypeOrmRechercheLoader";
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
  établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader;
  établissementTerritorialRattachéLoader: ÉtablissementTerritorialRattachéLoader;
  établissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader;
  favorisLoader: FavorisLoader;
  changePasswordLoader: ChangePasswordLoader;
  forgetPasswordLoader: TypeOrmForgetPasswordLoader;
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
    établissementTerritorialMédicoSocialLoader: new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm),
    établissementTerritorialRattachéLoader: new TypeOrmÉtablissementTerritorialRattachéLoader(orm),
    établissementTerritorialSanitaireLoader: new TypeOrmÉtablissementTerritorialSanitaireLoader(orm),
    favorisLoader: new TypeOrmFavorisLoader(orm),
    changePasswordLoader: new TypeOrmChangePasswordLoader(orm),
    forgetPasswordLoader: new TypeOrmForgetPasswordLoader(orm)
  };
};

export const dependencies = createDependencies();
