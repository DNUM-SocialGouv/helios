import { screen, within } from "@testing-library/react";

import { ÉtablissementTerritorialRattachéViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialRattachéViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./ListeDesÉtablissementsTerritoriauxRattachés";
import { ÉtablissementTerritorialRattachéViewModel } from "./ÉtablissementTerritorialRattachéViewModel";

const { paths, wording } = fakeFrontDependencies;
const établissementsTerritoriauxRattachésViewModels = [
  ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording),
  ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording),
];

describe("affiche la liste des établissements territoriaux rattachés à l’entité juridique", () => {
  it("affiche le titre de la liste avec le nombre d'établissements total", () => {
    // WHEN
    renderFakeComponent(
      <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
    );

    // THEN
    const titre = screen.getByRole("heading", {
      level: 2,
      name: "2 " + wording.ÉTABLISSEMENTS_RATTACHÉS,
    });
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

  describe("EJ avec des ET sanitaires rattachés uniquement", () => {
    let établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[];

    beforeAll(() => {
      // GIVEN
      établissementsTerritoriauxRattachésViewModels = [
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording, { numéroFiness: "445566" }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording, { numéroFiness: "112233" }),
      ];
    });

    it("affiche un tag pour regrouper les établissements sanitaires avec le nombre d'établissements", () => {
      // WHEN
      renderFakeComponent(
        <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
      );

      // THEN
      const tagSanitaire = screen.getByText("SANITAIRE (2)");
      expect(tagSanitaire).toBeInTheDocument();
    });

    it("affiche la liste des établissements sanitaires sous le tag trié par FINESS", () => {
      // WHEN
      renderFakeComponent(
        <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
      );

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(2);
      expect(within(itemEtablissementSanitaire[0]).getByText("112233", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementSanitaire[1]).getByText("445566", { exact: false })).toBeInTheDocument();
    });

    it("n'affiche pas le tag ni la liste s'il n'y a pas d'établissements sanitaire", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={[]} />);

      // THEN
      const tagSanitaire = screen.queryByText("SANITAIRE", { exact: false });
      expect(tagSanitaire).not.toBeInTheDocument();
    });
  });

  describe("EJ avec des ET médicaux sociaux rattachés uniquement", () => {
    let établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[];

    beforeAll(() => {
      // GIVEN
      établissementsTerritoriauxRattachésViewModels = [
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording, { numéroFiness: "445566" }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording, { numéroFiness: "112233" }),
      ];
    });

    it("affiche un tag pour regrouper les établissements médicaux sociaux avec le nombre d'établissements", () => {
      // WHEN
      renderFakeComponent(
        <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
      );

      // THEN
      const tagSanitaire = screen.getByText("SOCIAL ET MEDICO-SOCIAL (2)");
      expect(tagSanitaire).toBeInTheDocument();
    });

    it("affiche la liste des établissements médicaux sociaux sous le tag trié par FINESS", () => {
      // WHEN
      renderFakeComponent(
        <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
      );

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(2);
      expect(within(itemEtablissementSanitaire[0]).getByText("112233", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementSanitaire[1]).getByText("445566", { exact: false })).toBeInTheDocument();
    });

    it("n'affiche pas le tag ni la liste s'il n'y a pas d'établissements médicaux sociaux", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={[]} />);

      // THEN
      const tagSanitaire = screen.queryByText("SOCIAL ET MEDICO-SOCIAL", { exact: false });
      expect(tagSanitaire).not.toBeInTheDocument();
    });
  });

  describe("EJ avec des ET médicaux sociaux et des ET sanitaires rattachés", () => {
    let établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[];

    beforeAll(() => {
      // GIVEN
      établissementsTerritoriauxRattachésViewModels = [
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording, { numéroFiness: "445566" }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording, { numéroFiness: "999888" }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording, { numéroFiness: "778899" }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialMédicoSocialRattaché(wording, { numéroFiness: "556677" }),
        ÉtablissementTerritorialRattachéViewModelTestBuilder.créeÉtablissementTerritorialSanitaireRattaché(wording, { numéroFiness: "222333" }),
      ];
    });

    it("affiche les deux tags avec en premier celui qui contient le plus d'établissements", () => {
      // WHEN
      renderFakeComponent(
        <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
      );

      // THEN
      const tagMedicauxSocial = screen.getByText("SOCIAL ET MEDICO-SOCIAL (3)");
      expect(tagMedicauxSocial).toBeInTheDocument();
      const tagSanitaire = screen.getByText("SANITAIRE (2)");
      expect(tagSanitaire).toBeInTheDocument();
    });

    it("affiche la liste des établissements en fonction de leur tag trié par finess", () => {
      // WHEN
      renderFakeComponent(
        <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
      );

      // THEN
      const listeEtablissementMedicauxSociaux = screen.getAllByRole("list")[0];
      const itemEtablissementMedicauxSociaux = within(listeEtablissementMedicauxSociaux).getAllByRole("listitem");
      expect(itemEtablissementMedicauxSociaux).toHaveLength(3);
      expect(within(itemEtablissementMedicauxSociaux[0]).getByText("445566", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementMedicauxSociaux[1]).getByText("556677", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementMedicauxSociaux[2]).getByText("778899", { exact: false })).toBeInTheDocument();

      const listeEtablissementSanitaire = screen.getAllByRole("list")[1];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(2);
      expect(within(itemEtablissementSanitaire[0]).getByText("222333", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementSanitaire[1]).getByText("999888", { exact: false })).toBeInTheDocument();
    });

    it("n'affiche pas le tag ni la liste s'il n'y a pas d'établissements médicaux sociaux", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={[]} />);

      // THEN
      const tagSanitaire = screen.queryByText("SOCIAL ET MEDICO-SOCIAL", { exact: false });
      expect(tagSanitaire).not.toBeInTheDocument();
    });
  });
});
