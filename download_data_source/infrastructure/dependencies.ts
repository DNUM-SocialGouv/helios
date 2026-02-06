import * as Sentry from "@sentry/nextjs";

import { ControleDonneesSirecLoader } from "../métier/gateways/ControleDonnesSirecLoader";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { Logger } from "../métier/gateways/Logger";
import { dotEnvConfig } from "./gateways/dot-env/dotEnvConfig";
import { NodeEnvironmentVariables } from "./gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { SirecSourceExterneLoader } from "./gateways/sirec-soure-externe-loader/sirecSourceExterneLoader";

export type Dependencies = Readonly<{
  DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: number;
  environmentVariables: EnvironmentVariables;
  controleDonneesSirecLoader: ControleDonneesSirecLoader;
  logger: Logger;
}>;

const createDependencies = (): Dependencies => {
  dotEnvConfig();

  const logger = new ConsoleLogger();
  const environmentVariables = new NodeEnvironmentVariables(logger);

  Sentry.init({
    dsn: environmentVariables.SENTRY_DSN,
    environment: environmentVariables.SENTRY_ENVIRONMENT,
    tracesSampleRate: 1.0,
  });

  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 10000,
    environmentVariables,
    controleDonneesSirecLoader: new SirecSourceExterneLoader(environmentVariables.SIREC_DATA_PATH, environmentVariables.CHECKED_SIREC_DATA_PATH, logger),
    logger,
  };
};

export const dependencies = createDependencies();
