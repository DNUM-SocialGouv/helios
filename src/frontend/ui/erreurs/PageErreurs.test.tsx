import { screen } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent, trimHtml } from "../../testHelper";
import { Page404 } from "./Page404";
import { Page500 } from "./Page500";

const { paths, wording } = fakeFrontDependencies;

describe("Page d’erreurs", () => {
  it("affiche la page 404", () => {
    // WHEN
    renderFakeComponent(<Page404 />);

    // THEN
    const titre = screen.getByRole("heading", { level: 1, name: wording.PAGE_NON_TROUVÉE_404 });
    expect(titre).toBeInTheDocument();
    const codeErreur = screen.getByText(wording.CODE_ERREUR_404, { selector: "p" });
    expect(codeErreur).toBeInTheDocument();
    const sousTitre = screen.getByText(wording.SOUS_TITRE_ERREUR_404, { selector: "p" });
    expect(sousTitre).toBeInTheDocument();
    const description = screen.getByText(trimHtml(wording.DESCRIPTION_ERREUR_404), { selector: "p" });
    expect(description).toBeInTheDocument();
    const lienVersLAccueil = screen.getByRole("link", { name: wording.ACCUEIL });
    expect(lienVersLAccueil).toHaveAttribute("href", paths.ACCUEIL);
    expect(document.title).toBe(wording.PAGE_NON_TROUVÉE_404);
  });

  it("affiche la page 500", () => {
    // WHEN
    renderFakeComponent(<Page500 />);

    // THEN
    const titre = screen.getByRole("heading", { level: 1, name: wording.ERREUR_INATTENDUE_500 });
    expect(titre).toBeInTheDocument();
    const codeErreur = screen.getByText(wording.CODE_ERREUR_500, { selector: "p" });
    expect(codeErreur).toBeInTheDocument();
    const sousTitre = screen.getByText(wording.SOUS_TITRE_ERREUR_500, { selector: "p" });
    expect(sousTitre).toBeInTheDocument();
    const description = screen.getByText(trimHtml(wording.DESCRIPTION_ERREUR_500), { selector: "p" });
    expect(description).toBeInTheDocument();
    const lienVersLAccueil = screen.getByRole("link", { name: wording.ACCUEIL });
    expect(lienVersLAccueil).toHaveAttribute("href", paths.ACCUEIL);
    expect(document.title).toBe(wording.ERREUR_INATTENDUE_500);
  });
});
