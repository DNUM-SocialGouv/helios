import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import { SessionProvider } from "next-auth/react";

import { ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { CatégorisationEnum } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { RésultatDeRechercheTestBuilder } from "../../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { EtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { PageÉtablissementTerritorialSanitaire } from "../PageÉtablissementTerritorialSanitaire";

const { paths, wording } = fakeFrontDependencies;

const mockSession = {
  name: "john",
  email: "test@test.fr",
  user: {
    idUser: "1",
    firstname: "Doe",
    role: 1,
    institution: {},
    institutionId: 1,
    codeRegion: 84,
    codeProfiles: [""],
  },
  expires: "1235",
};

const result = RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({
  numéroFiness: "000000000",
});
const rechercheViewModel = new RechercheViewModel(result, paths);

describe("La page établissement territorial sanitaire - ressources humaines", () => {
  const makeActiviteMensuelleViewModel = () =>
    new ActivitesMensuelViewModel(
      mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12",
      }),
      wording
    );

  it("affiche le bloc ressources humaines pour les établissements publics", () => {
    const établissementTerritorialSanitaireViewModel =
      EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        categorisationDeLEntitéDeRattachement: {
          value: CatégorisationEnum.PUBLIC,
          dateMiseÀJourSource: "2025-09-24",
        },
      });

    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={makeActiviteMensuelleViewModel()}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={
            établissementTerritorialSanitaireViewModel
          }
        />
      </SessionProvider>
    );

    const ressourcesHumaines = screen.getByRole("region", {
      name: wording.TITRE_BLOC_RESSOURCES_HUMAINES,
    });
    expect(ressourcesHumaines).toBeDefined();
  });

  it("affiche le bloc ressources humaines pour les établissements privés non lucratifs", () => {
    const établissementTerritorialSanitaireViewModel =
      EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        categorisationDeLEntitéDeRattachement: {
          value: CatégorisationEnum.PRIVE_NON_LUCRATIF,
          dateMiseÀJourSource: "2025-09-24",
        },
      });

    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={makeActiviteMensuelleViewModel()}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={
            établissementTerritorialSanitaireViewModel
          }
        />
      </SessionProvider>
    );

    const ressourcesHumaines = screen.getByRole("region", {
      name: wording.TITRE_BLOC_RESSOURCES_HUMAINES,
    });
    expect(ressourcesHumaines).toBeDefined();
  });

  it("n'affiche pas le bloc ressources humaines pour les établissements privés lucratifs", () => {
    const établissementTerritorialSanitaireViewModel =
      EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        categorisationDeLEntitéDeRattachement: {
          value: CatégorisationEnum.PRIVE_LUCRATIF,
          dateMiseÀJourSource: "2025-09-24",
        },
      });

    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={makeActiviteMensuelleViewModel()}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={
            établissementTerritorialSanitaireViewModel
          }
        />
      </SessionProvider>
    );

    const ressourcesHumaines = screen.queryByRole("region", {
      name: wording.TITRE_BLOC_RESSOURCES_HUMAINES,
    });
    expect(ressourcesHumaines).toBeNull();
  });

  it("n'affiche pas le bloc ressources humaines pour les établissements personne morale droit étranger", () => {
    const établissementTerritorialSanitaireViewModel =
      EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        categorisationDeLEntitéDeRattachement: {
          value: CatégorisationEnum.PERSONNE_MORALE_DROIT_ETRANGER,
          dateMiseÀJourSource: "2025-09-24",
        },
      });

    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={makeActiviteMensuelleViewModel()}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={
            établissementTerritorialSanitaireViewModel
          }
        />
      </SessionProvider>
    );

    const ressourcesHumaines = screen.queryByRole("region", {
      name: wording.TITRE_BLOC_RESSOURCES_HUMAINES,
    });
    expect(ressourcesHumaines).toBeNull();
  });
});
