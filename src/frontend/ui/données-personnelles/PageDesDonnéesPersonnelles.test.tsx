import { screen, within } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../testHelper";
import { PageDesDonnéesPersonnelles } from "./PageDesDonnéesPersonnelles";

const { wording } = fakeFrontDependencies;

describe("La page des données personnelles", () => {
  it("affiche les informations liées aux données personnelles", () => {
    // WHEN
    renderFakeComponent(<PageDesDonnéesPersonnelles />);

    // THEN
    expect(screen.getByRole("region", { name: wording.FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: wording.PROTECTION_DES_DONNÉES_PERSONNELLES })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: wording.DROITS_DES_PERSONNES_CONCERNÉES })).toBeInTheDocument();
  });

  it("affiche un lien pour envoyer un e-mail pour chaque délégué à la protection des données des 18 régions", () => {
    // WHEN
    renderFakeComponent(<PageDesDonnéesPersonnelles />);

    // THEN
    const droitsDesPersonnesConcernées = screen.getByRole("region", { name: wording.DROITS_DES_PERSONNES_CONCERNÉES });
    const adressesEmails = within(droitsDesPersonnesConcernées).getAllByRole("link");
    expect(adressesEmails).toHaveLength(18);
  });

  it("explicite les acronymes utilisés dans le texte", () => {
    // WHEN
    renderFakeComponent(<PageDesDonnéesPersonnelles />);

    // THEN
    const abréviationDeLAgenceRégionaleDeSanté = screen.getByText("ARS", { selector: "abbr" });
    expect(abréviationDeLAgenceRégionaleDeSanté).toHaveAttribute("title", "Agence Régionale de Santé");
    const abréviationDuRGPD = screen.getByText("RGPD", { selector: "abbr" });
    expect(abréviationDuRGPD).toHaveAttribute("title", "Règlement Général sur la Protection des Données");
    const abréviationDuDPO = screen.getByText("DPO", { selector: "abbr" });
    expect(abréviationDuDPO).toHaveAttribute("title", "Data Protection Officer (Délégué à la Protection des Données)");
  });
});
