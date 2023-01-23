import { screen, within } from "@testing-library/react";

import PageDAccueil from "../../../../pages";
import Accessibilité from "../../../../pages/accessibilite";
import DonnéesPersonnelles from "../../../../pages/donnees-personnelles";
import MentionsLégales from "../../../../pages/mentions-legales";
import { EntitéJuridiqueViewModelTestBuilder } from "../../../test-builder/EntitéJuridiqueViewModelTestBuilder";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { ÉtablissementTerritorialRattachéViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialRattachéViewModelTestBuilder";
import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { EtablissementsTerritoriauxRattachésViewModel } from "../../entité-juridique/liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { PageEntitéJuridique } from "../../entité-juridique/PageEntitéJuridique";
import { PageRégion } from "../../région/PageRégion";
import { régions } from "../../région/régions";
import { PageÉtablissementTerritorialMédicoSocial } from "../../établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial";
import { PageÉtablissementTerritorialSanitaire } from "../../établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire";
import { Breadcrumb } from "./Breadcrumb";

jest.mock("next/router", () => require("next-router-mock"));
const { paths, wording } = fakeFrontDependencies;

describe("Le fil d’Ariane (breadcrumb)", () => {
  it("ne s’affiche pas sur la page d’accueil", () => {
    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageDAccueil />
      </>
    );

    // THEN
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it.each([
    [Accessibilité, wording.ACCESSIBILITÉ],
    [MentionsLégales, wording.MENTIONS_LÉGALES],
    [DonnéesPersonnelles, wording.DONNÉES_PERSONNELLES],
  ])("affiche le chemin jusqu’à la page courante", (Page, expected) => {
    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <Page />
      </>
    );

    // THEN
    const breadcrumb = screen.getByRole("navigation");
    const levels = within(breadcrumb).getAllByRole("listitem");
    expect(levels).toHaveLength(2);
    const accueil = levels[0];
    const titreDeLaPage = levels[1];
    expect(within(accueil).getByRole("link")).toBeInTheDocument();
    expect(within(accueil).getByText(wording.ACCUEIL)).toHaveAttribute("href", "/");
    expect(within(titreDeLaPage).queryByRole("link")).not.toBeInTheDocument();
    expect(within(titreDeLaPage).getByText(expected)).toBeInTheDocument();
  });

  it("affiche le chemin jusqu’à la page entité juridique", () => {
    // GIVEN
    const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestBuilder.crée(wording);
    const établissementsTerritoriauxRattachésViewModels = new EtablissementsTerritoriauxRattachésViewModel(
      [
        ÉtablissementTerritorialRattachéViewModelTestBuilder.établissementTerritorialMédicoSocialRattaché,
        ÉtablissementTerritorialRattachéViewModelTestBuilder.établissementTerritorialSanitaireRattaché,
      ],
      wording
    );

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageEntitéJuridique
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </>
    );

    // THEN
    const breadcrumb = screen.getByRole("navigation");
    const levels = within(breadcrumb).getAllByRole("listitem");
    expect(levels).toHaveLength(2);
    const accueil = levels[0];
    const entitéJuridique = levels[1];
    const lienAccueil = within(accueil).getByRole("link", { name: wording.ACCUEIL });
    expect(lienAccueil).toHaveAttribute("href", "/");
    expect(within(entitéJuridique).queryByRole("link")).not.toBeInTheDocument();
    expect(within(entitéJuridique).getByText("EJ", { selector: "abbr" })).toHaveAttribute("title", wording.ENTITÉ_JURIDIQUE);
    expect(entitéJuridique.textContent).toBe("EJ - 220000020 - CH SAINT BRIEUC");
  });

  it("affiche le chemin jusqu’à la page établissement territorial médico-social", () => {
    // GIVEN
    const établissementTerritorialMédicoSocialViewModel = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths);

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialMédicoSocialViewModel} />
      </>
    );

    // THEN
    const breadcrumb = screen.getByRole("navigation");
    const levels = within(breadcrumb).getAllByRole("listitem");
    expect(levels).toHaveLength(3);
    const accueil = levels[0];
    const entitéJuridique = levels[1];
    const établissementTerritorial = levels[2];
    const lienAccueil = within(accueil).getByRole("link", { name: wording.ACCUEIL });
    expect(lienAccueil).toHaveAttribute("href", "/");
    const lienEntitéJuridique = within(entitéJuridique).getByRole("link", { name: "Entité juridique - 010008407 - CH DU HAUT BUGEY" });
    expect(lienEntitéJuridique).toHaveAttribute("href", `${paths.ENTITÉ_JURIDIQUE}/010008407`);
    expect(lienEntitéJuridique.textContent).toBe("EJ - 010008407 - CH DU HAUT BUGEY");
    expect(within(lienEntitéJuridique).getByText("EJ", { selector: "abbr" })).toHaveAttribute("title", wording.ENTITÉ_JURIDIQUE);
    expect(within(établissementTerritorial).queryByRole("link")).not.toBeInTheDocument();
    expect(within(établissementTerritorial).getByText("CH DU HAUT BUGEY")).toBeInTheDocument();
  });

  it("affiche le chemin jusqu’à la page établissement territorial sanitaire", () => {
    // GIVEN
    const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths);

    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />
      </>
    );

    // THEN
    const breadcrumb = screen.getByRole("navigation");
    const levels = within(breadcrumb).getAllByRole("listitem");
    expect(levels).toHaveLength(3);
    const accueil = levels[0];
    const entitéJuridique = levels[1];
    const établissementTerritorial = levels[2];
    const lienAccueil = within(accueil).getByRole("link", { name: wording.ACCUEIL });
    expect(lienAccueil).toHaveAttribute("href", "/");
    const lienEntitéJuridique = within(entitéJuridique).getByRole("link", { name: "Entité juridique - 010008407 - HP VILLENEUVE DASCQ" });
    expect(lienEntitéJuridique).toHaveAttribute("href", `${paths.ENTITÉ_JURIDIQUE}/010008407`);
    expect(lienEntitéJuridique.textContent).toBe("EJ - 010008407 - HP VILLENEUVE DASCQ");
    expect(within(lienEntitéJuridique).getByText("EJ", { selector: "abbr" })).toHaveAttribute("title", wording.ENTITÉ_JURIDIQUE);
    expect(within(établissementTerritorial).queryByRole("link")).not.toBeInTheDocument();
    expect(within(établissementTerritorial).getByText("CH NANTUA")).toBeInTheDocument();
  });

  it("affiche le chemin jusqu’à la page d’une région", () => {
    // WHEN
    renderFakeComponent(
      <>
        <Breadcrumb />
        <PageRégion région="bretagne" />
      </>
    );

    // THEN
    const breadcrumb = screen.getByRole("navigation");
    const levels = within(breadcrumb).getAllByRole("listitem");
    expect(levels).toHaveLength(2);
    const accueil = levels[0];
    const région = levels[1];
    const lienAccueil = within(accueil).getByRole("link", { name: wording.ACCUEIL });
    expect(lienAccueil).toHaveAttribute("href", "/");
    expect(within(région).getByText(wording.régionBreadcrumb(régions["bretagne"].label))).toBeInTheDocument();
  });
});
