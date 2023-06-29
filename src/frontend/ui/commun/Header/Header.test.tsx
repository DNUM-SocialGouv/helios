import { fireEvent, screen, within } from "@testing-library/react";
import { SessionProvider } from 'next-auth/react';
import mockRouter from "next-router-mock";

import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { Header } from "./Header";

jest.mock("next/router", () => require("next-router-mock"));
const { paths, wording } = fakeFrontDependencies;
const mockSession = {
  name: "john",
  email: "test@test.fr",
  expires: "1235"
}

describe("En-tête de page", () => {
  it("affiche un lien pour accéder à la page d’accueil", () => {
    // WHEN
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const accueil = screen.getByRole("link", { name: wording.ACCUEIL });
    expect(accueil).toHaveAttribute("href", paths.ACCUEIL);
    expect(accueil.textContent).toBe(wording.TITRE_DU_SITE);
  });

  it("affiche un menu pour afficher la déconnexion et un pour le moteur de recherche en mobile", () => {
    // WHEN    
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const menuDeDéconnexion = screen.getByRole("button", { name: wording.MENU });
    expect(menuDeDéconnexion).toHaveAttribute("title", wording.MENU);
    const menuDeRecherche = screen.getAllByRole("button", { name: wording.RECHERCHE_LABEL });
    expect(menuDeRecherche[0]).toHaveAttribute("title", wording.RECHERCHE_LABEL);
    const fermer = screen.getAllByRole("button", { name: wording.FERMER });
    expect(fermer[1]).toBeInTheDocument();
  });

  it("affiche le formulaire de recherche", () => {
    // WHEN
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const formulaire = screen.getByRole("search");
    const label = within(formulaire).getByLabelText(wording.RECHERCHE_LABEL);
    expect(label).toBeInTheDocument();
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_LABEL);
    expect(input).toBeInTheDocument();
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    expect(rechercher).toBeInTheDocument();
  });

  it("redirection vers la recherche quand on fait une recherche", () => {
    // GIVEN
    const router = mockRouter;
    const terme = "hospitalier";
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_LABEL);
    fireEvent.change(input, { target: { value: terme } });

    // WHEN
    fireEvent.click(rechercher);

    // THEN
    expect(router.pathname).toBe(paths.ACCUEIL);
    expect(router.asPath).toBe(paths.ACCUEIL + "?terme=" + terme);
  });

  it("n’affiche pas le formulaire de recherche quand on est sur l’accueil", () => {
    // GIVEN
    const router = mockRouter;
    router.push(paths.ACCUEIL);

    // WHEN
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const formulaire = screen.queryByRole("search");
    expect(formulaire).not.toBeInTheDocument();
    const menuDeRecherche = screen.queryByRole("button", { name: wording.RECHERCHE_LABEL });
    expect(menuDeRecherche).not.toBeInTheDocument();
  });
});
