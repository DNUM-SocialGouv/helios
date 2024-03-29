import { Dependencies } from "../../infrastructure/dependencies";
import { getFakeDataCrawlerDependencies, uneEntitéJuridique, uneSecondeEntitéJuridique } from "../../testHelper";
import { Catégorisation, EntitéJuridique } from "../entities/EntitéJuridique";
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
      fakeDataCrawlerDependencies.catégorisationSourceExterneLoader,
      fakeDataCrawlerDependencies.logger
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

      jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockResolvedValue([entitéJuridiqueSIH]);
      jest
        .spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques")
        .mockReturnValue([niveauStatutJuridiqueSIH]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const entitésJuridiquesToSave: EntitéJuridique[] = [
        {
          ...entitéJuridiqueSIH,
          catégorisation: Catégorisation.PUBLIC,
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
        .mockResolvedValue([entitéJuridiqueSyndicat]);
      jest
        .spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques")
        .mockReturnValue([niveauStatutJuridiqueSyndicat]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const entitésJuridiquesToSave: EntitéJuridique[] = [
        {
          ...entitéJuridiqueSyndicat,
          catégorisation: Catégorisation.PRIVE_NON_LUCRATIF,
        },
      ];
      expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiquesToSave, expect.anything());
    });

    it("associe une catégorisation 'privé lucratif' pour les entités juridiques dont le statut juridique niveau 2 est 2200", async () => {
      // GIVEN
      const entitéJuridiqueSNC = {
        ...uneEntitéJuridique,
        statutJuridique: "71",
      };
      const niveauStatutJuridiqueSNC = {
        statutJuridique: "71",
        statutJuridiqueNiv1: "2000",
        statutJuridiqueNiv2: "2200",
      };

      jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockResolvedValue([entitéJuridiqueSNC]);
      jest
        .spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques")
        .mockReturnValue([niveauStatutJuridiqueSNC]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const entitésJuridiquesToSave: EntitéJuridique[] = [
        {
          ...entitéJuridiqueSNC,
          catégorisation: Catégorisation.PRIVE_LUCRATIF,
        },
      ];
      expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiquesToSave, expect.anything());
    });

    it("associe une catégorisation 'personne morale de droit etranger' pour les entités juridiques dont le statut juridique niveau 1 est 3000", async () => {
      // GIVEN
      const entitéJuridiqueDroitEtranger = {
        ...uneEntitéJuridique,
        statutJuridique: "90",
      };
      const niveauStatutJuridiqueDroitEtranger = {
        statutJuridique: "90",
        statutJuridiqueNiv1: "3000",
        statutJuridiqueNiv2: "3100",
      };

      jest
        .spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes")
        .mockResolvedValue([entitéJuridiqueDroitEtranger]);
      jest
        .spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques")
        .mockReturnValue([niveauStatutJuridiqueDroitEtranger]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const entitésJuridiquesToSave: EntitéJuridique[] = [
        {
          ...entitéJuridiqueDroitEtranger,
          catégorisation: Catégorisation.PERSONNE_MORALE_DROIT_ETRANGER,
        },
      ];
      expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiquesToSave, expect.anything());
    });

    it("log un warning si une catégorisation n'a pas été trouvée", async () => {
      // GIVEN
      const entitéJuridiqueAvecUnMauvaisStatutJuridique: EntitéJuridique = {
        ...uneEntitéJuridique,
        numéroFinessEntitéJuridique: "10",
        statutJuridique: "999",
      };

      jest
        .spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes")
        .mockResolvedValue([entitéJuridiqueAvecUnMauvaisStatutJuridique]);
      jest.spyOn(fakeDataCrawlerDependencies.catégorisationSourceExterneLoader, "récupèreLesNiveauxDesStatutsJuridiques").mockReturnValue([]);

      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute();

      // THEN
      const warningMessage = "Aucune catégorisation n'a été trouvée pour le statutJuridique 999 sur l'entité juridique 10";
      expect(fakeDataCrawlerDependencies.logger.warn).toHaveBeenCalledWith(warningMessage);
    });
  });

  it("récupère les entités juridiques des sources de données externes avec la date de mise à jour de leur fichier source", async () => {
    // GIVEN
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockResolvedValue([]);

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
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, "récupèreLesEntitésJuridiquesOuvertes").mockResolvedValue(entitésJuridiques);

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
      .mockResolvedValue(entitésJuridiquesOuvertes);

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
