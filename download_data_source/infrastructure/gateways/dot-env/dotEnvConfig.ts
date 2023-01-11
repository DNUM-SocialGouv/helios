import dotenv from "dotenv-defaults";

export const dotEnvConfig = () => {
  if (process.env.NODE_ENV === "test") {
    dotenv.config({
      defaults: "./.env",
      encoding: "utf8",
      path: "./.env.test",
    });
  }

  if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      defaults: "./.env",
      encoding: "utf8",
      path: "./.env.local",
    });
  }
};
