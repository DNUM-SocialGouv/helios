import { fireEvent, screen, within } from "@testing-library/react";
import { SessionProvider } from 'next-auth/react';
import mockRouter from "next-router-mock";

import { Header } from "./Header";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

jest.mock("next/router", () => require("next-router-mock"));
const { paths, wording } = fakeFrontDependencies;
const mockSession = {
  name: "john",
  email: "test@test.fr",
  user: {
    idUser: '1',
    firstname: 'Doe',
    role: 1,
    institution: {},
    institutionId: 1,
    codeRegion: 84,
    codeProfiles: [""]
  },
  expires: "1235"
}

describe("En-tête de page", () => {
  it("affiche un lien pour accéder à la page d’accueil", () => {
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    // WHEN
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const accueil = screen.getByRole("link", { name: "Helios" });
    expect(accueil).toHaveAttribute("href", paths.ACCUEIL);
    expect(accueil.textContent).toBe(wording.TITRE_DU_SITE);
  });

  it("affiche un menu pour afficher la déconnexion et un pour le moteur de recherche en mobile", () => {
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    // WHEN
    // On vas sure une page sur laquelle la barre de recherche est visible
    mockRouter.push(paths.HISTORY);
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const menuDeDéconnexion = screen.getAllByRole("button", { name: wording.MENU })[0];
    expect(menuDeDéconnexion).toHaveAttribute("title", wording.MENU);
    const menuDeRecherche = screen.getAllByRole("button", { name: wording.RECHERCHE_LABEL });
    expect(menuDeRecherche[0]).toHaveAttribute("title", wording.RECHERCHE_LABEL);
    const fermer = screen.getAllByRole("button", { name: wording.FERMER });
    expect(fermer[1]).toBeInTheDocument();
  });

  it("affiche le formulaire de recherche", () => {
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    // WHEN
    // On vas sur une page sur laquelle la barre de recherche est visible
    mockRouter.push(paths.HISTORY);
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
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    // GIVEN
    const router = mockRouter;
    // On vas sur une page sur laquelle la barre de recherche est visible
    router.push(paths.HISTORY);
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
  });

  it("n’affiche pas le formulaire de recherche quand on est sur l’accueil", () => {
    // GIVEN
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    const router = mockRouter;
    router.push(paths.ACCUEIL);
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });

    // WHEN
    renderFakeComponent(<SessionProvider session={mockSession}><Header /></SessionProvider>);

    // THEN
    const formulaire = screen.queryByRole("search");
    expect(formulaire).not.toBeInTheDocument();
    const menuDeRecherche = screen.queryByRole("button", { name: wording.RECHERCHE_LABEL });
    expect(menuDeRecherche).not.toBeInTheDocument();
  });
});
