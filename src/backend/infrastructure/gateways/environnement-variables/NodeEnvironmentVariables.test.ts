import { NodeEnvironmentVariables } from "./NodeEnvironmentVariables";
import { fakeLogger } from "../../../testHelper";

describe("Gestion des variables d’environnement", () => {
  it("retourne la valeur de DATABASE_URL du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.DATABASE_URL).toBe("postgres://helios:h3li0s@localhost:5433/helios");
  });

  it("retourne la valeur de NEXTAUTH_URL du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.NEXTAUTH_URL).toBe("http://fake-url-helios.com");
  });

  it("retourne la valeur de NEXTAUTH_SECRET du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.NEXTAUTH_SECRET).toBe("random-text");
  });

  it("retourne la valeur de ORM_DEBUG du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.ORM_DEBUG).toBe("test_orm_debug");
  });

  it("retourne la valeur de SCALINGO_TOKEN du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.SCALINGO_TOKEN).toBe("test_scalingo_token");
  });

  it("retourne la valeur de SENTRY_AUTH_TOKEN du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.SENTRY_AUTH_TOKEN).toBe("test_sentry_auth_token");
  });

  it("retourne la valeur de SENTRY_DSN du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.SENTRY_DSN).toBe("https://test@sentry.test.fr/10");
  });

  it("retourne la valeur de SENTRY_ENVIRONMENT du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.SENTRY_ENVIRONMENT).toBe("test_sentry_environment");
  });

  it("retourne la valeur de TIME_OF_CACHE_PAGE du .env", () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(nodeEnvironmentVariables.TIME_OF_CACHE_PAGE).toBe("test_time_of_cache_page");
  });

  it("retourne une phrase explicite quand la valeur n’est pas dans le fichier .env", () => {
    // GIVEN
    process.env["ORM_DEBUG"] = "toBeSet";

    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger);

    // THEN
    expect(fakeLogger.error).toHaveBeenCalledWith('----- WARNING ----- La variable d’environnement "ORM_DEBUG" est manquante.');
    expect(nodeEnvironmentVariables.ORM_DEBUG).toBe("");
  });
});
