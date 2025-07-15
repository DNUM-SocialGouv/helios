import { RechercheParmiLesEntitésEtÉtablissementsUseCase } from "./RechercheParmiLesEntitésEtÉtablissementsUseCase";
import { RésultatDeRechercheTestBuilder } from "../../test-builder/RésultatDeRechercheTestBuilder";
import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

describe("La recherche des entités juridiques et des établissements territoriaux", () => {
  it("retourne les résultats de la recherche", async () => {
    // GIVEN
    const résultatDeRecherche: RésultatDeRecherche = {
      nombreDeRésultats: 3,
      résultats: [
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité(),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementMédicoSocial(),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire(),
      ],
    };
    const mockedRechercheParTerme = jest.fn().mockResolvedValueOnce(résultatDeRecherche);
    const rechercheLoader: RechercheLoader = { recherche: mockedRechercheParTerme, rechercheAvancee: mockedRechercheParTerme, rechercheParNumeroFiness: mockedRechercheParTerme };
    const termeDeLaRecherche = "terme de la recherche";
    const premièrePage = 1;

    const rechercheParmiLesEntitésEtÉtablissementsUseCase = new RechercheParmiLesEntitésEtÉtablissementsUseCase(rechercheLoader);

    // WHEN
    const résultatsDeLaRecherche = await rechercheParmiLesEntitésEtÉtablissementsUseCase.exécute(termeDeLaRecherche, premièrePage);

    // THEN
    expect(mockedRechercheParTerme).toHaveBeenCalledWith(termeDeLaRecherche, premièrePage, undefined, undefined, undefined);
    expect(mockedRechercheParTerme).toHaveBeenCalledTimes(1);
    expect(résultatsDeLaRecherche).toStrictEqual<RésultatDeRecherche>({
      nombreDeRésultats: 3,
      résultats: [
        {
          commune: "OYONNAX",
          département: "AIN",
          numéroFiness: "010018407",
          raisonSocialeCourte: "CH DU HAUT BUGEY",
          type: "Entité juridique",
          rattachement: "",
        },
        {
          commune: "NANTUA",
          département: "AIN",
          numéroFiness: "010000040",
          raisonSocialeCourte: "CH NANTUA",
          type: "Médico-social",
          rattachement: "010018407",
        },
        {
          commune: "VILLENEUVE D ASCQ",
          département: "NORD",
          numéroFiness: "590782553",
          raisonSocialeCourte: "HP VILLENEUVE DASCQ",
          type: "Sanitaire",
          rattachement: "010018407",
        },
      ],
    });
  });
});
