import { screen } from "@testing-library/react";

import { PageDesDonnéesPersonnelles } from "./PageDesDonnéesPersonnelles";
import { fakeFrontDependencies, renderFakeComponent } from "../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;

describe("La page des données personnelles", () => {
  it("affiche les informations liées aux données personnelles", () => {
    // WHEN
    renderFakeComponent(<PageDesDonnéesPersonnelles />);

    // THEN
    expect(screen.getByRole("region", { name: wording.FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: wording.PROTECTION_DES_DONNÉES_PERSONNELLES })).toBeInTheDocument();
  });

  it("explicite les acronymes utilisés dans le texte", () => {
    // WHEN
    renderFakeComponent(<PageDesDonnéesPersonnelles />);

    // THEN
    const abréviationDeLAgenceRégionaleDeSanté = screen.getByText("ARS", { selector: "abbr" });
    expect(abréviationDeLAgenceRégionaleDeSanté).toHaveAttribute("title", "Agence Régionale de Santé");
    const abréviationDuRGPD = screen.getByText("RGPD", { selector: "abbr" });
    expect(abréviationDuRGPD).toHaveAttribute("title", "Règlement Général sur la Protection des Données");
  });
});
