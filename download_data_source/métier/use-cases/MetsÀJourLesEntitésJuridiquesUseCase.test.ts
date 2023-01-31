import { Dependencies } from "../../infrastructure/dependencies";
import { getFakeDataCrawlerDependencies, uneEntitéJuridique, uneSecondeEntitéJuridique } from "../../testHelper";
import { EntitéJuridique } from "../entities/EntitéJuridique";
import { MetsÀJourLesEntitésJuridiquesUseCase } from "./MetsÀJourLesEntitésJuridiquesUseCase";

describe("Mise à jour des entités juridiques", () => {
  let fakeDataCrawlerDependencies: Dependencies;
  let sauvegarderLesEntitésJuridiques: MetsÀJourLesEntitésJuridiquesUseCase;

  beforeEach(() => {
    fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();

    sauvegarderLesEntitésJuridiques = new MetsÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.catégorisationSourceExterneLoader
    );
  });

  describe("Catégorisation", () => {
    it("associe une catégorisation 'public' pour les entités juridiques dont le statut juridique niveau 1 est 1000", async () => {
      // GIVEN
      const entitéJuridiqueSIH = {
        ...uneEntitéJuridique,
        statutJuridique: "16",
      };
      const niveauStatutJuridiqueSIH = {
        statutJuridique: "16",
        statutJuridiqueNiv1: "1000",
        statutJuridiqueNiv2: "1210",
      };

      jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockReturnValue([entitéJuridiqueSIH]);
      jest
        .spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques")
        .mockResolvedValue([niveauStatutJuridiqueSIH]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const entitésJuridiquesToSave: EntitéJuridique[] = [
        {
          ...entitéJuridiqueSIH,
          catégorisation: "public",
        },
      ];
      expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiquesToSave, expect.anything());
    });

    it("associe une catégorisation 'privé non lucratif' pour les entités juridiques dont le statut juridique niveau 2 est 2100", async () => {
      // GIVEN
      const entitéJuridiqueSyndicat = {
        ...uneEntitéJuridique,
        statutJuridique: "51",
      };
      const niveauStatutJuridiqueSyndicat = {
        statutJuridique: "51",
        statutJuridiqueNiv1: "2000",
        statutJuridiqueNiv2: "2100",
      };

      jest
        .spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes")
        .mockReturnValue([entitéJuridiqueSyndicat]);
      jest
        .spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques")
        .mockResolvedValue([niveauStatutJuridiqueSyndicat]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const entitésJuridiquesToSave: EntitéJuridique[] = [
        {
          ...entitéJuridiqueSyndicat,
          catégorisation: "prive_non_lucratif",
        },
      ];
      expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiquesToSave, expect.anything());
    });

    it.todo("renvoit une erreur si aucune catégorie n'est trouvée");
  });

  it("récupère les entités juridiques des sources de données externes avec la date de mise à jour de leur fichier source", async () => {
    // GIVEN
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockReturnValue([]);

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute();

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource).toHaveBeenCalledWith();
    expect(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes).toHaveBeenCalledWith();
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques).toHaveBeenCalledWith();
  });

  it("sauvegarde les entités juridiques des sources de données externes avec la date de mise à jour de leur fichier source", async () => {
    // GIVEN
    const entitésJuridiques: EntitéJuridique[] = [uneEntitéJuridique, uneSecondeEntitéJuridique];
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLaDateDeMiseÀJourDuFichierSource").mockReturnValue("20200101");
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockReturnValue(entitésJuridiques);

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute();

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiques, "20200101");
  });

  it("extrais les entités juridiques qui ont fermées pour les supprimer", async () => {
    // GIVEN
    const numéroFinessEntitéJuridiqueToujoursOuverte = "010018407";
    const entitésJuridiquesOuvertes: EntitéJuridique[] = [
      {
        ...uneEntitéJuridique,
        numéroFinessEntitéJuridique: numéroFinessEntitéJuridiqueToujoursOuverte,
      },
    ];
    jest
      .spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes")
      .mockReturnValue(entitésJuridiquesOuvertes);

    const entitésJuridiquesEnBase = [numéroFinessEntitéJuridiqueToujoursOuverte, "123456789"];
    jest
      .spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, "récupèreLeNuméroFinessDesEntitésJuridiques")
      .mockResolvedValue(entitésJuridiquesEnBase);

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute();

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.supprime).toHaveBeenCalledWith(["123456789"]);
  });

  it("signale une alerte si la récupération des entités juridiques échoue", async () => {
    // GIVEN
    const messageDerreur = "téléchargement interrompu";
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockImplementation(() => {
      throw new Error(messageDerreur);
    });

    try {
      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();
      throw new Error("ne devrait pas passer ici");
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`);
    }
  });
});
