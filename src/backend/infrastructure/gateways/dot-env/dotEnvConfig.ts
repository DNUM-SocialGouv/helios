import dotenv from "dotenv-defaults";

export const dotEnvConfig = (nodeEnv: string) => {
  if (nodeEnv === "test") {
    dotenv.config({
      defaults: "./.env",
      encoding: "utf8",
      path: "./.env.test",
    });
  }

  if (nodeEnv === "development") {
    dotenv.config({
      defaults: "./.env",
      encoding: "utf8",
      path: "./.env.local",
    });
  }
};
