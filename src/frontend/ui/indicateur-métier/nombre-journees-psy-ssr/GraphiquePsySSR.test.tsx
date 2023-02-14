import { fireEvent, screen, within } from "@testing-library/react";

import { annéeEnCours, fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../testHelper";
import { GraphiquePsySSR } from "./GraphiquePsySSR";
import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";

const { wording } = fakeFrontDependencies;

describe("Graphique Psy SSR", () => {
  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new NombreDeJourneesPsySSRViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={viewModel} />);

    // THEN
    const pmsi = screen.getAllByText("PMSI", { selector: "abbr" })[0];
    expect(pmsi).toBeInTheDocument();
    expect(pmsi).toHaveAttribute("title", wording.PMSI_TITLE);
  });

  it("affiche le titre", () => {
    // GIVEN
    const viewModel = new NombreDeJourneesPsySSRViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={viewModel} />);
    // THEN
    const titre = screen.getByText(wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, { selector: "p" });
    expect(titre).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    let viewModel: NombreDeJourneesPsySSRViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new NombreDeJourneesPsySSRViewModel([], wording);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={viewModel} />);

      // THEN
      const détails = screen.getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-1`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={viewModel} />);

      // WHEN
      const détails = screen.getByRole("button", { name: wording.DÉTAILS });
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = screen.getByRole("heading", {
        level: 1,
        name: wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR,
      });
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={viewModel} />);
      const détails = screen.getByRole("button", { name: wording.DÉTAILS });
      fireEvent.click(détails);

      // WHEN
      const fermer = screen.getByRole("button", { name: wording.FERMER });
      fireEvent.click(fermer);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("nombre de journées ssr psy renseignés", () => {
    let psySSRUneAnnée: NombreDeJourneesPsySSRViewModel;

    beforeAll(() => {
      psySSRUneAnnée = new NombreDeJourneesPsySSRViewModel(
        [
          {
            année: annéeEnCours - 1,
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2020-10-01",
              value: 1111,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2020-10-01",
              value: 2222,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2020-10-01",
              value: 3333,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2020-10-01",
              value: 4444,
            },
          },
        ],
        wording
      );
    });

    it("affiche la date de mise à jour du fichier PMSI", () => {
      // WHEN
      renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // THEN
      const dateMiseAJour = screen.getAllByText(textMatch(`${wording.miseÀJour("01/10/2020")} - Source : PMSI`), {
        selector: "p",
      });
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // THEN
      const transcription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiquePsySSR nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // WHEN
      const afficherLaTranscription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
      fireEvent.click(afficherLaTranscription);

      // THEN
      const transcription = screen.getByRole("table");
      const transcriptionTable = within(transcription);
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("1 111")).toBeInTheDocument();
      expect(transcriptionTable.getByText("2 222")).toBeInTheDocument();
      expect(transcriptionTable.getByText("3 333")).toBeInTheDocument();
      expect(transcriptionTable.getByText("4 444")).toBeInTheDocument();
    });
  });
});
