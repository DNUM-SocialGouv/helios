import { fireEvent, screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { GraphiqueAutorisationsActivites } from "./GraphiqueAutorisationsActivites";
import {
  AutorisationActivitesAmm,
  AutorisationsActivités,
  AutresActivités,
  EquipementsMateriauxLourdsActivités,
  ReconnaissanceContractuelleActivités,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "../../entité-juridique/bloc-autorisations-capacites/EntitéJuridiqueAutorisationsCapacitesViewModel";

const { wording } = fakeFrontDependencies;

describe("GraphiqueAutorisationActivite", () => {
  let graphiqueTest: GraphiqueTest;
  let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      mock<AutorisationsActivités>({ autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }], dateMiseÀJourSource: '11/11/2025' }),
      mock<AutorisationActivitesAmm>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<AutresActivités>(),
      mock<ReconnaissanceContractuelleActivités>(),
      mock<EquipementsMateriauxLourdsActivités>(),
      wording
    );
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisationsActivités} entiteJuridiqueAutorisationsAmm={viewModel.autorisationsAmmActivites} />);

    // THEN
    const titre = graphiqueTest.titre(wording.AUTORISATIONS_ACTIVITES);
    expect(titre).toBeInTheDocument();
  });

  it("affiche abréviation du fichier source ARHGOS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisationsActivités} entiteJuridiqueAutorisationsAmm={viewModel.autorisationsAmmActivites} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("ARHGOS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.ARHGOS_TITLE);
  });

  it("affiche abréviation du fichier source FINESS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisationsActivités} entiteJuridiqueAutorisationsAmm={viewModel.autorisationsAmmActivites} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("FINESS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.FINESS_TITLE);
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisationsActivités} entiteJuridiqueAutorisationsAmm={viewModel.autorisationsAmmActivites} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-autorisation-activites`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisationsActivités} entiteJuridiqueAutorisationsAmm={viewModel.autorisationsAmmActivites} />);

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
      renderFakeComponent(<GraphiqueAutorisationsActivites entiteJuridiqueAutorisations={viewModel.autorisationsActivités} entiteJuridiqueAutorisationsAmm={viewModel.autorisationsAmmActivites} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });
});
