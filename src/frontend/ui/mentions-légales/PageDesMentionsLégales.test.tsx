import { screen, within } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../test-helpers/testHelper";
import { PageDesMentionsLégales } from "./PageDesMentionsLégales";

const { wording } = fakeFrontDependencies;

describe("La page des mentions légales", () => {
  it("affiche les informations liées aux mentions légales", () => {
    // WHEN
    renderFakeComponent(<PageDesMentionsLégales />);

    // THEN
    expect(screen.getByRole("region", { name: wording.ÉDITEUR_DU_SITE })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: wording.PROPRIÉTÉ_INTELLECTUELLE })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: wording.LIMITES_DE_RESPONSABILITÉ })).toBeInTheDocument();
  });

  it("explicite les acronymes utilisés dans le texte", () => {
    // WHEN
    renderFakeComponent(<PageDesMentionsLégales />);

    // THEN
    const abréviationDuSystèmesDInformation = screen.getByText("SI", { selector: "abbr" });
    expect(abréviationDuSystèmesDInformation).toHaveAttribute("title", "Systèmes d’Informations");
    const propriétéIntellectuelle = screen.getByRole("region", { name: wording.PROPRIÉTÉ_INTELLECTUELLE });
    const abréviationDuServiceÀCompétenceNational = within(propriétéIntellectuelle).getByText("SCN", { selector: "abbr" });
    expect(abréviationDuServiceÀCompétenceNational).toHaveAttribute("title", "Service à Compétence National");
    const abréviationDuSystèmesDInformationMutualisés = within(propriétéIntellectuelle).getByText("SIM", { selector: "abbr" });
    expect(abréviationDuSystèmesDInformationMutualisés).toHaveAttribute("title", "Systèmes d’Information Mutualisés");
    const abréviationDeLAgenceRégionaleDeSanté = within(propriétéIntellectuelle).getByText("ARS", { selector: "abbr" });
    expect(abréviationDeLAgenceRégionaleDeSanté).toHaveAttribute("title", "Agence Régionale de Santé");
  });
});
