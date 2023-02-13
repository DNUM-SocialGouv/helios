import { fireEvent, screen, within } from "@testing-library/react";

import { annéeEnCours, fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../testHelper";
import { GraphiqueNombrePassageUrgence } from "./GraphiqueNombrePassageUrgence";
import { NombrePassageAuxUrgencesViewModel } from "./NombrePassageAuxUrgencesViewModel";

const { wording } = fakeFrontDependencies;

describe("Graphique Nombre de Passage d'urgence", () => {
  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new NombrePassageAuxUrgencesViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

    // THEN
    const rpu = screen.getAllByText("RPU", { selector: "abbr" })[0];
    expect(rpu).toBeInTheDocument();
    expect(rpu).toHaveAttribute("title", wording.RPU_TITLE);
  });

  describe("Détails info bulle", () => {
    let viewModel: NombrePassageAuxUrgencesViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new NombrePassageAuxUrgencesViewModel([], wording);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

      // THEN
      const détails = screen.getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-2`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

      // WHEN
      const détails = screen.getByRole("button", { name: wording.DÉTAILS });
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = screen.getByRole("heading", {
        level: 1,
        name: wording.NOMBRE_DE_PASSAGES_AUX_URGENCES,
      });
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);
      const détails = screen.getByRole("button", { name: wording.DÉTAILS });
      fireEvent.click(détails);

      // WHEN
      const fermer = screen.getByRole("button", { name: wording.FERMER });
      fireEvent.click(fermer);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("pas de nombre de passage aux urgences renseignés", () => {
    let viewModel: NombrePassageAuxUrgencesViewModel;

    beforeEach(() => {
      // GIVEN
      viewModel = new NombrePassageAuxUrgencesViewModel([], wording);
    });

    it("affiche le titre", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);
      // THEN
      const titre = screen.getByText(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, { selector: "p" });
      expect(titre).toBeInTheDocument();
    });

    it("désactive la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

      // THEN
      const transcription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
      expect(transcription).toBeDisabled();
    });

    it("affiche la mise en exergue de toutes les années sans données", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}, ${annéeEnCours - 1}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });

  describe("nombre de passage aux urgences renseignés", () => {
    let passageUrgenceUneAnnée: NombrePassageAuxUrgencesViewModel;

    beforeAll(() => {
      passageUrgenceUneAnnée = new NombrePassageAuxUrgencesViewModel(
        [
          {
            année: annéeEnCours - 1,
            value: 100,
            dateMiseÀJourSource: "2020-10-01",
          },
        ],
        wording
      );
    });

    it("affiche la date de mise à jour du fichier RPU", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const dateMiseAJour = screen.getAllByText(textMatch(`${wording.miseÀJour("01/10/2020")} - Source : RPU`), {
        selector: "p",
      });
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const transcription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={passageUrgenceUneAnnée} />);

      // WHEN
      const afficherLaTranscription = screen.getByText(wording.AFFICHER_LA_TRANSCRIPTION);
      fireEvent.click(afficherLaTranscription);

      // THEN
      const transcription = screen.getByRole("table");
      const transcriptionTable = within(transcription);
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("100")).toBeInTheDocument();
    });

    it("affiche la mise en exergue pour les années manquantes", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });
});
