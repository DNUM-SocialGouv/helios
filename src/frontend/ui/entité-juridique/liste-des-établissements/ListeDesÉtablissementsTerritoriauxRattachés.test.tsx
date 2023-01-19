import { screen, within } from "@testing-library/react";

import { ÉtablissementTerritorialRattachéViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialRattachéViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./ListeDesÉtablissementsTerritoriauxRattachés";

const { paths, wording } = fakeFrontDependencies;
const établissementsTerritoriauxRattachésViewModels = [
  ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording),
  ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording),
];

describe("affiche la liste des établissements territoriaux rattachés à l’entité juridique", () => {
  it("affiche le titre de la liste", () => {
    // WHEN
    renderFakeComponent(
      <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
    );

    // THEN
    const titre = screen.getByRole("heading", { level: 2, name: wording.ÉTABLISSEMENTS_RATTACHÉS });
    expect(titre).toBeInTheDocument();
  });

  it("affiche la liste des établissements rattachés avec un lien pour accéder à chaque établissement comportant le numéro FINESS de l’établissement et son nom court", () => {
    // WHEN
    renderFakeComponent(
      <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
    );

    // THEN
    const listeDesÉtablissementsRattachés = screen.getAllByRole("listitem");
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
    renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={[]} />);

    // THEN
    const établissementTerritoriauxRattachés = screen.queryByRole("region", { name: wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS });
    expect(établissementTerritoriauxRattachés).not.toBeInTheDocument();
  });
});
