import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { BlocActivitéSanitaire } from "./BlocActivitéSanitaire";
import { EntitéJuridiqueActivitésViewModel } from "./EntitéJuridiqueActivitésViewModel";

const { wording } = fakeFrontDependencies;

describe("Bloc Activité Sanitaire", () => {
  it("affiche le GraphiqueNombrePassageUrgence", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel(
      [
        mock<EntitéJuridiqueActivités>({
          année: 2020,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2020-10-01",
            value: 100,
          },
        }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, { selector: "p" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel([], wording);

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });
});
