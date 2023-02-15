import { fireEvent, screen, within } from "@testing-library/react";

import { annéeEnCours, fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../testHelper";
import { GraphiqueNombreDeSejourMCO } from "./GraphiqueNombreDeSejourMCO";
import { ActivitéMCO } from "./IndicateurDesSejoursMCO";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

const { wording } = fakeFrontDependencies;
const activitesMCO: ActivitéMCO[] = [
  {
    année: annéeEnCours - 1,
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
      value: 500,
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

  it("affiche la date de mise à jour du fichier PMSI", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const dateMiseAJour = screen.getAllByText(textMatch(`${wording.miseÀJour("01/10/2022")} - Source : PMSI`), {
      selector: "p",
    });
    expect(dateMiseAJour[0]).toBeInTheDocument();
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

  it("affiche la transcription", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const transcription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
    expect(transcription).toHaveAttribute("aria-expanded", "false");
    expect(transcription).not.toBeDisabled();
  });

  it("affiche le contenu de la transcription", () => {
    // GIVEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO nombreDeSejourMCOViewModel={viewModel} />);

    // WHEN
    const afficherLaTranscription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
    fireEvent.click(afficherLaTranscription);

    // THEN
    const transcription = screen.getByRole("table");
    const transcriptionTable = within(transcription);
    expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
    expect(transcriptionTable.getByText("100")).toBeInTheDocument();
    expect(transcriptionTable.getByText("150")).toBeInTheDocument();
    expect(transcriptionTable.getByText("200")).toBeInTheDocument();
    expect(transcriptionTable.getByText("50")).toBeInTheDocument();
    expect(transcriptionTable.getByText("500")).toBeInTheDocument();
    expect(transcriptionTable.getByText("90")).toBeInTheDocument();
  });
});
