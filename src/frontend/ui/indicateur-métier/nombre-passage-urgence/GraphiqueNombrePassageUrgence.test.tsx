import { screen } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { GraphiqueNombrePassageUrgence } from "./GraphiqueNombrePassageUrgence";
import { NombrePassageAuxUrgencesViewModel } from "./NombrePassageAuxUrgencesViewModel";

const { wording } = fakeFrontDependencies;

describe("Graphique Nombre de Passage d'urgence", () => {
  it("affiche le titre", () => {
    // GIVEN
    const viewModel = new NombrePassageAuxUrgencesViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, { selector: "p" });
    expect(titre).toBeInTheDocument();
  });
});
