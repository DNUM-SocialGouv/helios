import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { CapacitéSanitaireEntitéJuridique } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { BlocAutorisationsCapacites } from "./BlocAutorisationsCapacites";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";

const { wording } = fakeFrontDependencies;

describe("Bloc Autorisation et activités", () => {
  it("affiche le GraphiqueCapacitesParActivite", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel([mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })], wording);

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });

  it("n'affiche pas le graphique capacité par activité s'il n'y a pas de valeur", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel([], wording);

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "h6" });
    expect(titre).not.toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel([], wording);

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });
});
