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
import { GraphiqueReconnaissanceContractuelles } from "./GraphiqueReconnaissanceContractuelles";

const { wording } = fakeFrontDependencies;

describe("GraphiqueReconnaissanceContractuelles", () => {
  let graphiqueTest: GraphiqueTest;
  let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      mock<AutorisationsActivités>(),
      mock<AutresActivités>(),
      mock<ReconnaissanceContractuelleActivités>({
        autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }],
      }),
      wording
    );
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={viewModel.reconnaissanceActivités} />);

    // THEN
    const titre = graphiqueTest.titre(wording.RECONNAISSANCES_CONTRACTUELLES);
    expect(titre).toBeInTheDocument();
  });

  it("affiche abréviation du fichier source ARHGOS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={viewModel.reconnaissanceActivités} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("ARHGOS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.ARHGOS_TITLE);
  });

  it("affiche abréviation du fichier source FINESS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={viewModel.reconnaissanceActivités} />);

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
        mock<AutresActivités>(),
        mock<ReconnaissanceContractuelleActivités>({
          autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }],
        }),
        wording
      );
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={viewModel.reconnaissanceActivités} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-reconnaissance-contractuelles`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={viewModel.reconnaissanceActivités} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.RECONNAISSANCES_CONTRACTUELLES);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={viewModel.reconnaissanceActivités} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });
});
