import * as Sentry from "@sentry/nextjs";

import { EntitéJuridiqueLoader } from "../métier/gateways/EntitéJuridiqueLoader";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { Logger } from "../métier/gateways/Logger";
import { RechercheLoader } from "../métier/gateways/RechercheLoader";
import { ÉtablissementTerritorialMédicoSocialLoader } from "../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader";
import { ÉtablissementTerritorialRattachéLoader } from "../métier/gateways/ÉtablissementTerritorialRattachéLoader";
import { ÉtablissementTerritorialSanitaireLoader } from "../métier/gateways/ÉtablissementTerritorialSanitaireLoader";
import { dotEnvConfig } from "./gateways/dot-env/dotEnvConfig";
import { TypeOrmEntitéJuridiqueLoader } from "./gateways/entité-juridique-loader/TypeOrmEntitéJuridiqueLoader";
import { NodeEnvironmentVariables } from "./gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { typeOrmOrm } from "./gateways/orm/typeOrmOrm";
import { TypeOrmRechercheLoader } from "./gateways/recherche-loader/TypeOrmRechercheLoader";
import { TypeOrmÉtablissementTerritorialMédicoSocialLoader } from "./gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialMédicoSocialLoader";
import { TypeOrmÉtablissementTerritorialRattachéLoader } from "./gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialRattachéLoader";
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from "./gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialSanitaireLoader";
import { UtilisateurLoader } from "../métier/gateways/UtilisateurLoader";
import { TypeOrmUtilisateurLoader } from "./gateways/utilisateur-loader/TypeOrmUtilisateurLoader";

export type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables;
  entitéJuridiqueLoader: EntitéJuridiqueLoader;
  logger: Logger;
  utilisateurLoader: UtilisateurLoader;
  rechercheLoader: RechercheLoader;
  établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader;
  établissementTerritorialRattachéLoader: ÉtablissementTerritorialRattachéLoader;
  établissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader;
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
  };
};

export const dependencies = createDependencies();
