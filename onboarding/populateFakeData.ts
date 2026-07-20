import { Client } from "pg";

import { createTestUser } from "./createTestUser";
import { NodeEnvironmentVariables } from "../src/backend/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "../src/backend/infrastructure/gateways/logger/ConsoleLogger";

const logger = new ConsoleLogger();
const environmentVariables = new NodeEnvironmentVariables(logger);
const dbUrl = environmentVariables.DATABASE_URL;

const client = new Client({ connectionString: dbUrl });

logger.info("Start of the test database creation");
(async () => {
  try {
    await client.connect();
    await client.query("BEGIN");
    await createTestUser(logger, client);
    await client.query("COMMIT");
  } catch (err) {
    logger.error(`An error occured. We roll back the transaction: ${err}`);
    await client.query("ROLLBACK");
  }
  await client.end();
  logger.info("Closing the database connection");
})()
logger.info("End of the test database creation");
