import { fireEvent, screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { GraphiqueEquipementMateriauxLourds } from "./GraphiqueEquipementMateriauxLourds";
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

describe("GraphiqueEquipementMaterielLourd", () => {
  let graphiqueTest: GraphiqueTest;
  let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      mock<AutorisationsActivités>(),
      mock<AutorisationActivitesAmm>({ autorisations: [] }),
      mock<AutresActivités>(),
      mock<ReconnaissanceContractuelleActivités>(),
      mock<EquipementsMateriauxLourdsActivités>({
        autorisations: [{ equipementEtablissements: [{ equipements: [{ autorisations: [{ nom: "test", valeur: "test value" }] }] }] }],
      }),
      wording
    );
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={viewModel.equipementsLourds} />);

    // THEN
    const titre = graphiqueTest.titre(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS);
    expect(titre).toBeInTheDocument();
  });

  it("affiche abréviation du fichier source ARHGOS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={viewModel.equipementsLourds} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource(wording.SI_AUTORISATIONS_TITLE);
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.SI_AUTORISATIONS_TITLE);
  });

  it("affiche abréviation du fichier source FINESS", () => {
    // WHEN
    renderFakeComponent(<GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={viewModel.equipementsLourds} />);

    // THEN
    const arhgos = graphiqueTest.abréviationFichierSource("FINESS");
    expect(arhgos).toBeInTheDocument();
    expect(arhgos).toHaveAttribute("title", wording.FINESS_TITLE);
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={viewModel.equipementsLourds} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-equipement-materiaux-lourds`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={viewModel.equipementsLourds} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={viewModel.equipementsLourds} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });
});
