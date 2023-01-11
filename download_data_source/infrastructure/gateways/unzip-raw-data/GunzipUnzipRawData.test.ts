import child from "child_process";

import { fakeLogger, getFakeDataCrawlerDependencies } from "../../../testHelper";
import { GunzipUnzipRawData } from "./GunzipUnzipRawData";

describe("Décompression d’une source de données", () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();

  it("décompresse une source de données avec la commande gunzip", async () => {
    // GIVEN
    const dataSource = "fake-data-source";
    const localPath = "fake_local_path";
    jest.spyOn(child, "execSync").mockImplementation();
    const gunzipUnzipDataSource = new GunzipUnzipRawData(fakeDataCrawlerDependencies.environmentVariables, fakeLogger);

    // WHEN
    gunzipUnzipDataSource.exécute(dataSource, localPath);

    // THEN
    expect(child.execSync).toHaveBeenCalledWith(`gunzip -rf ${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`);
    expect(fakeLogger.info).toHaveBeenCalledWith(`[${dataSource}] Sources de données décompressées.`);
  });

  it("signale une erreur lors de la décompression d’une source de données", () => {
    // GIVEN
    const dataSource = "fake-data-source";
    const localPath = "fake_local_path";
    const errorMessage = "unzip failed";
    jest.spyOn(child, "execSync").mockImplementation(
      jest.fn(() => {
        throw new Error(errorMessage);
      })
    );
    const gunzipUnzipDataSource = new GunzipUnzipRawData(fakeDataCrawlerDependencies.environmentVariables, fakeLogger);

    try {
      // WHEN
      gunzipUnzipDataSource.exécute(dataSource, localPath);
      throw new Error("ne devrait pas passer ici");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] [${dataSource}] Une erreur est survenue lors de la décompression du répertoire ${localPath} : ${errorMessage}`);
    }
  });
});
