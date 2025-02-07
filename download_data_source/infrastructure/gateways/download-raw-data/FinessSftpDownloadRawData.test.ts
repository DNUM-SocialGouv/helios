import fs from "fs";
import { FileInfo } from "ssh2-sftp-client";

import { getFakeDataCrawlerDependencies, fakeLogger } from "../../../testHelper";
import { ClientSftp } from "./ClientSftp";
import { FinessSftpDownloadRawData } from "./FinessSftpDownloadRawData";

describe("Téléchargement de FINESS via un SFTP", () => {
  const sftpPath = "fake_path";
  const simpleSftpPath = `${sftpPath}/simple`;
  const nomenclatureSftpPath = `${sftpPath}/nomenclature`;
  const enrichiSftpPath = `${sftpPath}/enrichi`;
  const localPath = "source-fake";
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();
  const fakeClientSftp: ClientSftp = {
    connect: jest.fn(),
    end: jest.fn(),
    fastGet: jest.fn(),
    list: jest.fn(),
  };

  afterEach(() => {
    fs.rmSync("data_test/sortie/source-fake", { recursive: true });
  });

  it("efface les dossiers contenant les anciens fichiers téléchargés en local pour éviter d’utiliser d’anciennes données", async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fs.existsSync(localPath)).toBe(false);
  });

  it('crée le répertoire "simple"', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fs.existsSync("data_test/sortie/source-fake/simple")).toBe(true);
  });

  it('crée le répertoire "nomenclature"', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fs.existsSync("data_test/sortie/source-fake/nomenclature")).toBe(true);
  });

  it('crée le répertoire "enrichi"', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fs.existsSync("data_test/sortie/source-fake/enrichi")).toBe(true);
  });

  it("se connecte au SFTP", async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fakeClientSftp.connect).toHaveBeenCalledWith({
      algorithms: { kex: ["algo1", "algo2"] },
      debug: undefined,
      host: "localhost",
      port: 22,
      privateKey: "privateKey",
      username: "usr_finess_ls",
    });
    expect(fakeLogger.info).toHaveBeenNthCalledWith(1, "[FINESS] La connexion au SFTP est ouverte.");
  });

  it('télécharge les dernières fiches d’identité en date du répertoire "simple"', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, [
      { name: "finess_cs1400101_stock_20211214-0333.xml.gz" },
      { name: "finess_cs1400101_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1400102_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1400102_stock_20211214-0336.xml.gz" },
    ]);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fakeClientSftp.list).toHaveBeenNthCalledWith(1, simpleSftpPath, "*.xml.gz");
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      1,
      `${simpleSftpPath}/finess_cs1400101_stock_20211214-0333.xml.gz`,
      `data_test/sortie/${localPath}/simple/finess_cs1400101_stock_20211214-0333.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      2,
      `${simpleSftpPath}/finess_cs1400102_stock_20211214-0336.xml.gz`,
      `data_test/sortie/${localPath}/simple/finess_cs1400102_stock_20211214-0336.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeLogger.info).toHaveBeenNthCalledWith(2, '[FINESS] Les deux fichiers contenant les fiches d’identité du répertoire "simple" téléchargés.');
  });

  it('télécharge les dernières catégories et statuts juridiques en date du répertoire "nomenclature"', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, [
      { name: "finess_cs1500106_stock_20211214-0417.xml.gz" },
      { name: "finess_cs1500106_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1500107_stock_20221214-0336.xml.gz" },
    ]);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fakeClientSftp.list).toHaveBeenNthCalledWith(2, nomenclatureSftpPath, "*.xml.gz");
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      1,
      `${nomenclatureSftpPath}/finess_cs1500106_stock_20211214-0417.xml.gz`,
      `data_test/sortie/${localPath}/nomenclature/finess_cs1500106_stock_20211214-0417.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      2,
      `${nomenclatureSftpPath}/finess_cs1500107_stock_20221214-0336.xml.gz`,
      `data_test/sortie/${localPath}/nomenclature/finess_cs1500107_stock_20221214-0336.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeLogger.info).toHaveBeenNthCalledWith(
      3,
      '[FINESS] Les fichiers contenants les catégories et statuts juridique du répertoire "nomenclature" téléchargés.'
    );
  });

  it('télécharge les dernières autorisations en date du répertoire "enrichi"', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, [
      { name: "finess_cs1400103_stock_20211214-0343.xml.gz" },
      { name: "finess_cs1400103_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1400104_stock_20211214-0344.xml.gz" },
      { name: "finess_cs1400104_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1400105_stock_20211214-0345.xml.gz" },
      { name: "finess_cs1400105_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1600101_stock_20211214-0346.xml.gz" },
      { name: "finess_cs1600101_stock_20000101-0000.xml.gz" },
      { name: "finess_cs1600102_stock_20211214-0347.xml.gz" },
      { name: "finess_cs1600102_stock_20000101-0000.xml.gz" },
    ]);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fakeClientSftp.list).toHaveBeenNthCalledWith(3, enrichiSftpPath, "*.xml.gz");
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      1,
      `${enrichiSftpPath}/finess_cs1400103_stock_20211214-0343.xml.gz`,
      `data_test/sortie/${localPath}/enrichi/finess_cs1400103_stock_20211214-0343.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      2,
      `${enrichiSftpPath}/finess_cs1400104_stock_20211214-0344.xml.gz`,
      `data_test/sortie/${localPath}/enrichi/finess_cs1400104_stock_20211214-0344.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      3,
      `${enrichiSftpPath}/finess_cs1400105_stock_20211214-0345.xml.gz`,
      `data_test/sortie/${localPath}/enrichi/finess_cs1400105_stock_20211214-0345.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      4,
      `${enrichiSftpPath}/finess_cs1600101_stock_20211214-0346.xml.gz`,
      `data_test/sortie/${localPath}/enrichi/finess_cs1600101_stock_20211214-0346.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      5,
      `${enrichiSftpPath}/finess_cs1600102_stock_20211214-0347.xml.gz`,
      `data_test/sortie/${localPath}/enrichi/finess_cs1600102_stock_20211214-0347.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    );
    expect(fakeLogger.info).toHaveBeenNthCalledWith(4, '[FINESS] Les 5 fichiers contenant les autorisations du répertoire "enrichi" téléchargés.');
  });

  it("se déconnecte du SFTP", async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    // WHEN
    await sftpDownloadDataSource.exécute();

    // THEN
    expect(fakeLogger.info).toHaveBeenNthCalledWith(5, "[FINESS] Le connexion au SFTP est fermée.");
    expect(fakeClientSftp.end).toHaveBeenCalledWith();
  });

  it("signale un message d’erreur quand il se connecte au SFTP avec une mauvaise configuration", async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée();
    simuleLaListeDesFichiersPrésentsDansLeDossierSimple(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(fakeClientSftp, []);
    simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(fakeClientSftp, []);
    const errorMessage = "connexion impossible";
    jest.spyOn(fakeClientSftp, "connect").mockImplementation().mockRejectedValueOnce(new Error(errorMessage));
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(
      fakeClientSftp,
      sftpPath,
      localPath,
      fakeDataCrawlerDependencies.environmentVariables,
      fakeLogger
    );

    try {
      // WHEN
      await sftpDownloadDataSource.exécute();
      throw new Error("ne devrait pas passer ici");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] [FINESS] Une erreur est survenue lors de la connexion au SFTP : ${errorMessage}`);
    }
  });
});

function simuleLaLectureDeLaClefPrivée() {
  jest.spyOn(fs, "readFileSync").mockReturnValueOnce("privateKey");
}

function simuleLaListeDesFichiersPrésentsDansLeDossierSimple(clientSftp: ClientSftp, fichiers: { name: string }[]) {
  jest
    .spyOn(clientSftp, "list")
    .mockImplementation()
    .mockResolvedValueOnce(fichiers as FileInfo[]);
}
function simuleLaListeDesFichiersPrésentsDansLeDossierNomenclature(clientSftp: ClientSftp, fichiers: { name: string }[]) {
  jest
    .spyOn(clientSftp, "list")
    .mockImplementation()
    .mockResolvedValueOnce(fichiers as FileInfo[]);
}
function simuleLaListeDesFichiersPrésentsDansLeDossierEnrichi(clientSftp: ClientSftp, fichiers: { name: string }[]) {
  jest
    .spyOn(clientSftp, "list")
    .mockImplementation()
    .mockResolvedValueOnce(fichiers as FileInfo[]);
}
