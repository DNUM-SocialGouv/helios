import { screen, within } from "@testing-library/react";

import { EntitéJuridiqueViewModelTestBuilder } from "../../../test-builder/EntitéJuridiqueViewModelTestBuilder";
import { ÉtablissementTerritorialRattachéViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialRattachéViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { PageEntitéJuridique } from "../PageEntitéJuridique";

const { paths, wording } = fakeFrontDependencies;
const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestBuilder.crée(wording);
const établissementsTerritoriauxRattachésViewModels = [
  ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording),
  ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording),
];

describe("affiche la liste des établissements territoriaux rattachés à l’entité juridique", () => {
  it("affiche le titre de la liste", () => {
    // WHEN
    renderFakeComponent(
      <PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />
    );

    // THEN
    const établissementTerritoriauxRattachés = screen.getByRole("region", { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS });
    expect(within(établissementTerritoriauxRattachés).getByRole("heading", { level: 2, name: wording.ÉTABLISSEMENTS_RATTACHÉS })).toBeInTheDocument();
  });

  it("affiche la liste des établissements rattachés avec un lien pour accéder à chaque établissement comportant le numéro FINESS de l’établissement et son nom court", () => {
    // WHEN
    renderFakeComponent(
      <PageEntitéJuridique
        entitéJuridiqueViewModel={entitéJuridiqueViewModel}
        établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
      />
    );

    // THEN
    const établissementsTerritoriauxRattachés = screen.getByRole("region", { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS });
    const listeDesÉtablissementsRattachés = within(établissementsTerritoriauxRattachés).getAllByRole("listitem");
    expect(listeDesÉtablissementsRattachés).toHaveLength(établissementsTerritoriauxRattachésViewModels.length);
    const établissementTerritorialMédicoSocial = within(listeDesÉtablissementsRattachés[0]).getByRole("link", {
      name: "Établissement territorial - 010000040 - CH NANTUA",
    });
    expect(établissementTerritorialMédicoSocial).toHaveAttribute("href", `${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/010000040`);
    const abréviationÉtablissementTerritorial = within(établissementTerritorialMédicoSocial).getByText("ET", { selector: "abbr" });
    expect(abréviationÉtablissementTerritorial).toHaveAttribute("title", wording.ÉTABLISSEMENT_TERRITORIAL);
    const établissementTerritorialSanitaire = within(listeDesÉtablissementsRattachés[1]).getByRole("link", {
      name: "Établissement territorial - 590782553 - HP VILLENEUVE DASCQ",
    });
    expect(établissementTerritorialSanitaire).toHaveAttribute("href", `${paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE}/590782553`);
  });

  it("n’affiche pas la liste des établissements territoriaux rattachés quand l’entité juridique n’en a pas", () => {
    // WHEN
    renderFakeComponent(<PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} établissementsTerritoriauxRattachésViewModels={[]} />);

    // THEN
    const établissementTerritoriauxRattachés = screen.queryByRole("region", { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS });
    expect(établissementTerritoriauxRattachés).not.toBeInTheDocument();
  });
});
