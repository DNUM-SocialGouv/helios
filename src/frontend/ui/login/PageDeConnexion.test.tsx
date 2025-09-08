import { screen, within } from "@testing-library/react";

import { PageDeConnexion } from "./PageDeConnexion";
import { fakeFrontDependencies, renderFakeComponent } from "../../test-helpers/testHelper";

jest.mock("next/router", () => require("next-router-mock"));

const { wording } = fakeFrontDependencies;

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
    const formulaire = screen.getByTestId("login-form");
    const labelId = within(formulaire).getByLabelText(wording.CONNEXION_IDENTIFIANT);
    expect(labelId).toBeInTheDocument();
    const inputId = within(formulaire).getByRole("textbox", { name: wording.CONNEXION_IDENTIFIANT });
    expect(inputId).toBeInTheDocument();
    const labelMdp  = within(formulaire).getByLabelText(wording.CONNEXION_MOT_DE_PASSE);
    expect(labelMdp ).toBeInTheDocument();
    const inputMdp = within(formulaire).getByTestId("password-1758-input");
    expect(inputMdp).toBeInTheDocument();
    const connexion = within(formulaire).getByRole("button", { name: wording.CONNEXION_LIBELLE });
    expect(connexion).toBeInTheDocument();
  });

// TODO redirige vers la page d'acceuil lors d'une connexion valide
  
// TODO affiche une erreur quand email ou mot de passe incorrect

});
