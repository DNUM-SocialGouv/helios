import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import {
  AutorisationsActivités,
  CapacitéSanitaireEntitéJuridique,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { BlocAutorisationsCapacites } from "./BlocAutorisationsCapacites";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";

const { wording } = fakeFrontDependencies;

describe("Bloc Autorisation et activités", () => {
  it("affiche le GraphiqueCapacitesParActivite", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })],
      { autorisations: [], dateMiseÀJourSource: "" },
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le GraphiqueAutorisationActivite", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })],
      mock<AutorisationsActivités>({ autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }] }),
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.AUTORISATIONS_ACTIVITES, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });

  it("n'affiche pas le graphique capacité par activité s'il n'y a pas de valeur", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel([], { autorisations: [], dateMiseÀJourSource: "" }, wording);

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "h6" });
    expect(titre).not.toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel([], { autorisations: [], dateMiseÀJourSource: "" }, wording);

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });
});
