import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import {
  AutorisationsActivités,
  AutresActivités,
  CapacitéSanitaireEntitéJuridique,
  ReconnaissanceContractuelleActivités,
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
      { autorisations: [], dateMiseÀJourSource: "" },
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
      mock<AutresActivités>({ autorisations: [] }),
      mock<ReconnaissanceContractuelleActivités>({ autorisations: [] }),
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.AUTORISATIONS_ACTIVITES, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le Graphique Autres Activite", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })],
      mock<AutorisationsActivités>({ autorisations: [] }),
      mock<AutresActivités>({ autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test2" }] }] }] }] }] }),
      mock<ReconnaissanceContractuelleActivités>({ autorisations: [] }),
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.AUTRES_ACTIVITÉS, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le Graphique Reconnaissance Contractuelles", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })],
      mock<AutorisationsActivités>({ autorisations: [] }),
      mock<AutresActivités>({ autorisations: [] }),
      mock<ReconnaissanceContractuelleActivités>({
        autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test2" }] }] }] }] }],
      }),
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.RECONNAISSANCES_CONTRACTUELLES, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });

  it("n'affiche pas les autorisations s'il n'y a pas de valeur", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const autorisationActivites = screen.queryByText(wording.AUTORISATIONS_ACTIVITES, { selector: "h6" });
    const autresActivites = screen.queryByText(wording.AUTRES_ACTIVITÉS, { selector: "h6" });
    const reconnaissanceContractuelles = screen.queryByText(wording.RECONNAISSANCES_CONTRACTUELLES, { selector: "h6" });
    expect(autorisationActivites).not.toBeInTheDocument();
    expect(autresActivites).not.toBeInTheDocument();
    expect(reconnaissanceContractuelles).not.toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });
});
