import * as fs from 'fs';
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "download_data_source/**/*.ts",
    "!**/node_modules/**",
    "!database/**",
    "!src/pages/**",
    "!src/**/test-factories/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["cobertura"],
  fakeTimers: { now: 1664703388050 }, // 2022-01-01T23:00:00.135Z
  moduleFileExtensions: ["ts", "tsx", "js"],
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["<rootDir>/src/**/*(*.)@(test).ts?(x)", "<rootDir>/download_data_source/**/*(*.)@(test).ts"],
};

async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  // /node_modules/ is the first pattern
  nextJestConfig.transformIgnorePatterns[0] = "/node_modules/(?!uuid)/";
  // Stryker ne fonctionne pas à cause de l'async https://github.com/stryker-mutator/stryker-js/issues/3480
  // Pour que les mutants naissent, il faut générer ce fichier donc lancer au moins un test
  fs.writeFileSync("jest-for-mutation-testing.json", JSON.stringify(nextJestConfig, null, 2));

  return nextJestConfig;
}

module.exports = jestConfig;