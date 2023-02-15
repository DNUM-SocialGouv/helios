import { screen } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { Footer } from "./Footer";

const { paths, wording } = fakeFrontDependencies;

describe("Le pied de page", () => {
  it("affiche un lien pour accéder à la page d’accueil", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const accueil = screen.getByRole("link", { name: wording.ACCUEIL });
    expect(accueil).toHaveAttribute("href", paths.ACCUEIL);
  });

  it("affiche des liens externes pour accéder à legigrance.gouv.fr, gouvernement.fr, service-public.fr et data.gouv.fr", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const legifrance = screen.getByRole("link", { name: `${wording.LEGIFRANCE} - ${wording.NOUVELLE_FENÊTRE}` });
    expect(legifrance).toHaveAttribute("href", "https://legifrance.gouv.fr");
    expect(legifrance).toHaveAttribute("rel", "external noopener noreferrer");
    expect(legifrance).toHaveAttribute("target", "_blank");
    expect(legifrance.textContent).toBe(wording.LEGIFRANCE);

    const gouvernement = screen.getByRole("link", { name: `${wording.GOUVERNEMENT} - ${wording.NOUVELLE_FENÊTRE}` });
    expect(gouvernement).toHaveAttribute("href", "https://gouvernement.fr");
    expect(gouvernement).toHaveAttribute("rel", "external noopener noreferrer");
    expect(gouvernement).toHaveAttribute("target", "_blank");
    expect(gouvernement.textContent).toBe(wording.GOUVERNEMENT);

    const servicePublic = screen.getByRole("link", { name: `${wording.SERVICE_PUBLIC} - ${wording.NOUVELLE_FENÊTRE}` });
    expect(servicePublic).toHaveAttribute("href", "https://service-public.fr");
    expect(servicePublic).toHaveAttribute("rel", "external noopener noreferrer");
    expect(servicePublic).toHaveAttribute("target", "_blank");
    expect(servicePublic.textContent).toBe(wording.SERVICE_PUBLIC);

    const dataGouv = screen.getByRole("link", { name: `${wording.DATA_GOUV} - ${wording.NOUVELLE_FENÊTRE}` });
    expect(dataGouv).toHaveAttribute("href", "https://data.gouv.fr");
    expect(dataGouv).toHaveAttribute("rel", "external noopener noreferrer");
    expect(dataGouv).toHaveAttribute("target", "_blank");
    expect(dataGouv.textContent).toBe(wording.DATA_GOUV);
  });

  it("affiche un lien pour accéder à la page d’informations sur l’accessibilité", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const accessibilité = screen.getByRole("link", { name: `${wording.ACCESSIBILITÉ} : ${wording.NON_CONFORME}` });
    expect(accessibilité).toHaveAttribute("href", paths.ACCESSIBILITÉ);
  });

  it("affiche un lien pour accéder aux mentions légales", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const mentionsLégales = screen.getByRole("link", { name: wording.MENTIONS_LÉGALES });
    expect(mentionsLégales).toHaveAttribute("href", paths.MENTIONS_LÉGALES);
  });

  it("affiche un lien pour accéder à la page d’informations relatives aux données personnelles", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const donnéesPersonnelles = screen.getByRole("link", { name: wording.DONNÉES_PERSONNELLES });
    expect(donnéesPersonnelles).toHaveAttribute("href", paths.DONNÉES_PERSONNELLES);
  });

  it("affiche un lien pour nous contacter", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const nousContacter = screen.getByRole("link", { name: wording.NOUS_CONTACTER });
    expect(nousContacter).toHaveAttribute("href", "mailto:dnum.scn-helios-support@sg.social.gouv.fr");
    expect(nousContacter).toHaveAttribute("target", "_blank");
    expect(nousContacter).toHaveAttribute("rel", "external noopener noreferrer");
  });

  it("affiche la mention que tout le contenu est sous une licence", () => {
    // WHEN
    renderFakeComponent(<Footer />);

    // THEN
    const licence = screen.getByText(wording.LICENCE_ETALAB);
    expect(licence).toBeInTheDocument();
    const lienLicence = screen.getByRole("link", { name: `${wording.LICENCE_ETALAB} - ${wording.NOUVELLE_FENÊTRE}` });
    expect(lienLicence).toHaveAttribute("href", "https://github.com/etalab/licence-ouverte/blob/master/LO.md");
    expect(lienLicence).toHaveAttribute("rel", "external noopener noreferrer");
    expect(lienLicence).toHaveAttribute("target", "_blank");
    expect(lienLicence.textContent).toBe(wording.LICENCE_ETALAB);
  });
});
