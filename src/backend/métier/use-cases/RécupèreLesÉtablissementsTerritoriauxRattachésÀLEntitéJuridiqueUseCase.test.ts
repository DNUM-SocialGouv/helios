import { numéroFinessEntitéJuridique } from "../../testHelper";
import { DomaineÉtablissementTerritorial } from "../entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { ÉtablissementTerritorialRattachéLoader } from "../gateways/ÉtablissementTerritorialRattachéLoader";
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from "./RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase";

describe("La récupération des établissements territoriaux rattachés à une entité juridique", () => {
  it("récupère la liste des établissements territoriaux", async () => {
    // GIVEN
    const établissementsTerritoriauxAttendus: ÉtablissementTerritorialRattaché[] = [
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: "111222333",
        raisonSocialeCourte: "Établissement 1",
        libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)"
      },
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: "333222111",
        raisonSocialeCourte: "Établissement 2",
        libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)"
      },
    ];
    const mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce(établissementsTerritoriauxAttendus);
    const établissementTerritorialLoader: ÉtablissementTerritorialRattachéLoader = {
      chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement: mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement,
    };
    const récupèreLesÉtablissementsTerritoriauxRattachésUseCase = new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(établissementTerritorialLoader);

    // WHEN
    const établissementsTerritoriaux = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFinessEntitéJuridique);

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual(établissementsTerritoriauxAttendus);
    expect(mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique);
    expect(mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1);
  });
});
