import { fireEvent, screen } from "@testing-library/react";

import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { GraphiqueNombreDeSejourMCO } from "./GraphiqueNombreDeSejourMCO";
import { ActivitéMCO } from "./IndicateurDesSejoursMCO";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

const { wording } = fakeFrontDependencies;
const activitesMCO: ActivitéMCO[] = [
  {
    année: annéeEnCours,
    nombreSéjoursPartielsMédecine: {
      dateMiseÀJourSource: "2022-10-01",
      value: 100,
    },
    nombreSéjoursCompletsMédecine: {
      dateMiseÀJourSource: "2022-10-01",
      value: 150,
    },
    nombreSéjoursPartielsChirurgie: {
      dateMiseÀJourSource: "2022-10-01",
      value: 200,
    },
    nombreSéjoursCompletsChirurgie: {
      dateMiseÀJourSource: "2022-10-01",
      value: 50,
    },
    nombreSéjoursPartielsObstétrique: {
      dateMiseÀJourSource: "2022-10-01",
      value: 100,
    },
    nombreSéjoursCompletsObstétrique: {
      dateMiseÀJourSource: "2022-10-01",
      value: 90,
    },
  },
];

describe("Graphique Nombre de Sejour MCO", () => {
  let viewModel: NombreDeSejourMCOViewModel;

  beforeAll(() => {
    // GIVEN
    viewModel = new NombreDeSejourMCOViewModel(activitesMCO, wording);
  });

  it("affiche abréviation du fichier source", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const rpu = screen.getAllByText("PMSI", { selector: "abbr" })[0];
    expect(rpu).toBeInTheDocument();
    expect(rpu).toHaveAttribute("title", wording.PMSI_TITLE);
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);
    // THEN
    const titre = screen.getByText(wording.NOMBRE_DE_SÉJOUR_MCO, { selector: "p" });
    expect(titre).toBeInTheDocument();
  });
});

describe("Détails info bulle", () => {
  let viewModel: NombreDeSejourMCOViewModel;

  beforeAll(() => {
    // GIVEN
    viewModel = new NombreDeSejourMCOViewModel(activitesMCO, wording);
  });

  it("affiche le bouton de détail", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const détails = screen.getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-0`);
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
    // GIVEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);

    // WHEN
    const détails = screen.getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "true");
    const h1 = screen.getByRole("heading", {
      level: 1,
      name: wording.NOMBRE_DE_SÉJOUR_MCO,
    });
    expect(h1).toBeInTheDocument();
  });

  it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
    // GIVEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);
    const détails = screen.getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);

    // WHEN
    const fermer = screen.getByRole("button", { name: wording.FERMER });
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });
});
