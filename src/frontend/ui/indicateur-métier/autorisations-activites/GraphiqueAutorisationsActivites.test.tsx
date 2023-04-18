import { fireEvent, screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { AutorisationActivites } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "../../entité-juridique/bloc-autorisations-capacites/EntitéJuridiqueAutorisationsCapacitesViewModel";
import { GraphiqueAutorisationsActivites } from "./GraphiqueAutorisationsActivites";

const { wording } = fakeFrontDependencies;

describe("GraphiqueAutorisationActivite", () => {
  let graphiqueTest: GraphiqueTest;
  let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      [mock<AutorisationActivites>({ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] })],
      wording
    );
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);

    // THEN
    const titre = graphiqueTest.titre(wording.AUTORISATIONS_ACTIVITES);
    expect(titre).toBeInTheDocument();
  });

  it("affiche abréviation du fichier source ARHGOS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("ARHGOS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.ARHGOS_TITLE);
  });

  it("affiche abréviation du fichier source FINESS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);

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
        [mock<AutorisationActivites>({ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] })],
        wording
      );
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-autorisation-activites`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.AUTORISATIONS_ACTIVITES);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("Donnee manquants", () => {
    it("n'affiche pas le graphique s'il n'y a pas de données", () => {
      // GIVEN
      viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel([], [], wording);

      // WHEN
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisations} />);

      // THEN
      const graphique = graphiqueTest.titre(wording.AUTORISATIONS_ACTIVITES);
      expect(graphique).not.toBeInTheDocument();
    });
  });
});
