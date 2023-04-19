import { fireEvent, screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import {
  AutorisationsActivités,
  AutresActivités,
  ReconnaissanceContractuelleActivités,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "../../entité-juridique/bloc-autorisations-capacites/EntitéJuridiqueAutorisationsCapacitesViewModel";
import { GraphiqueAutresActivites } from "./GraphiqueAutresActivites";

const { wording } = fakeFrontDependencies;

describe("GraphiqueAutresActivites", () => {
  let graphiqueTest: GraphiqueTest;
  let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      mock<AutorisationsActivités>(),
      mock<AutresActivités>({ autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }] }),
      mock<ReconnaissanceContractuelleActivités>(),
      wording
    );
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutresActivites entiteJuridiqueAutorisations={viewModel.autresActivités} />);

    // THEN
    const titre = graphiqueTest.titre(wording.AUTRES_ACTIVITÉS);
    expect(titre).toBeInTheDocument();
  });

  it("affiche abréviation du fichier source ARHGOS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutresActivites entiteJuridiqueAutorisations={viewModel.autresActivités} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("ARHGOS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.ARHGOS_TITLE);
  });

  it("affiche abréviation du fichier source FINESS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutresActivites entiteJuridiqueAutorisations={viewModel.autresActivités} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("FINESS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.FINESS_TITLE);
  });

  describe("Détails info bulle", () => {
    let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
        [],
        mock<AutorisationsActivités>(),
        mock<AutresActivités>({ autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }] }),
        mock<ReconnaissanceContractuelleActivités>(),
        wording
      );
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueAutresActivites entiteJuridiqueAutorisations={viewModel.autresActivités} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-autorisation-activites`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueAutresActivites entiteJuridiqueAutorisations={viewModel.autresActivités} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.AUTRES_ACTIVITÉS);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueAutresActivites entiteJuridiqueAutorisations={viewModel.autresActivités} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });
});
