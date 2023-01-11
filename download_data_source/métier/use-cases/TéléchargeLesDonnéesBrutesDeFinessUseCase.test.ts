import { getFakeDataCrawlerDependencies } from "../../testHelper";
import { TéléchargeLesDonnéesBrutesDeFinessUseCase } from "./TéléchargeLesDonnéesBrutesDeFinessUseCase";

describe("Récupération des sources de données FINESS en local", () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();

  it("récupère les sources de données FINESS en local", async () => {
    // GIVEN
    const téléchargerLesDonnéesBrutesDeFiness = new TéléchargeLesDonnéesBrutesDeFinessUseCase(
      fakeDataCrawlerDependencies.finessDownloadRawData,
      fakeDataCrawlerDependencies.unzipRawData
    );

    // WHEN
    await téléchargerLesDonnéesBrutesDeFiness.exécute();

    // THEN
    expect(fakeDataCrawlerDependencies.finessDownloadRawData.exécute).toHaveBeenCalledWith();
    expect(fakeDataCrawlerDependencies.unzipRawData.exécute).toHaveBeenCalledWith("FINESS", "finess");
  });

  it("signale quand une erreur est survenue lors du téléchargement des données", async () => {
    // GIVEN
    const messageDerreur = "téléchargement interrompu";
    jest.spyOn(fakeDataCrawlerDependencies.finessDownloadRawData, "exécute").mockImplementation(
      jest.fn(async () => {
        await Promise.reject(new Error(messageDerreur));
      })
    );
    const téléchargerLesDonnéesBrutesDeFiness = new TéléchargeLesDonnéesBrutesDeFinessUseCase(
      fakeDataCrawlerDependencies.finessDownloadRawData,
      fakeDataCrawlerDependencies.unzipRawData
    );

    try {
      // WHEN
      await téléchargerLesDonnéesBrutesDeFiness.exécute();
      throw new Error("ne devrait pas passer ici");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`);
    }
  });

  it("signale quand une erreur est survenue lors du la décompression des fichiers", async () => {
    // GIVEN
    const messageDerreur = "décompression interrompue";
    jest.spyOn(fakeDataCrawlerDependencies.unzipRawData, "exécute").mockImplementation(
      jest.fn(async () => {
        await Promise.reject(new Error(messageDerreur));
      })
    );
    const téléchargerLesDonnéesBrutesDeFiness = new TéléchargeLesDonnéesBrutesDeFinessUseCase(
      fakeDataCrawlerDependencies.finessDownloadRawData,
      fakeDataCrawlerDependencies.unzipRawData
    );

    try {
      // WHEN
      await téléchargerLesDonnéesBrutesDeFiness.exécute();
      throw new Error("ne devrait pas passer ici");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`);
    }
  });
});
