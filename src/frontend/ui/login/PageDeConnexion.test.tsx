import { fireEvent, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { RésultatDeRechercheTestBuilder } from "../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { fakeFrontDependencies, htmlNodeAndReactElementMatcher, renderFakeComponent } from "../../test-helpers/testHelper";
import { régions } from "../région/régions";
import { PageDeConnexion } from "./PageDeConnexion";

jest.mock("next/router", () => require("next-router-mock"));

const { paths, wording } = fakeFrontDependencies;

describe("La page de d’accueil", () => {
  it("n'affiche pas un bandeau d’information mentionnant le développement du site", () => {
    // WHEN
    renderFakeComponent(<PageDeConnexion />);

    // THEN
    expect(screen.queryByText(wording.SITE_EN_CONSTRUCTION)).not.toBeInTheDocument();
  });

  it("affiche le formulaire de connexion", () => {
    // WHEN
    renderFakeComponent(<PageDeConnexion />);

    // THEN
    const titre = screen.getByRole("heading", { level: 1, name: wording.CONNEXION_TITRE });
    expect(titre).toBeInTheDocument();
    const formulaire = screen.getByRole("login");
    const labelId = within(formulaire).getByLabelText(wording.CONNEXION_IDENTIFIANT);
    expect(labelId).toBeInTheDocument();
    const inputId = within(formulaire).getByRole("textbox", { name: wording.CONNEXION_IDENTIFIANT });
    expect(inputId).toBeInTheDocument();
    const labelMdp  = within(formulaire).getByLabelText(wording.CONNEXION_MOT_DE_PASSE);
    expect(labelMdp ).toBeInTheDocument();
    const inputMdp = within(formulaire).getByTestId("password-1758-input");
    expect(inputMdp).toBeInTheDocument();
    const labelMdpOublie = within(formulaire).getByRole("link", { name: wording.CONNEXION_MOT_DE_PASSE_OUBLIE });
    expect(labelMdpOublie).toHaveAttribute("href", paths.MOT_DE_PASSE_OUBLIE);
    const connexion = within(formulaire).getByRole("button", { name: wording.CONNEXION_LIBELLE });
    expect(connexion).toBeInTheDocument();
  });

// TODO see Header test where fake router is implemented
it("redirige vers la page d'acceuil lors d'une connexion valide", () => {
    // // GIVEN
    // renderFakeComponent(<PageDeConnexion />);
    // const formulaire = screen.getByRole("search");
    // const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    
    // // WHEN
    // fireEvent.click(rechercher);

    // // THEN
    
  });
  
// TODO
  it("affiche une erreur quand email ou mot de passe incorrect", () => {
    // GIVEN
    // renderFakeComponent(<PageDeConnexion />);
    // const formulaire = screen.getByRole("search");
    // const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    
    // // WHEN
    // fireEvent.click(rechercher);

    // // THEN
    
  });

});
