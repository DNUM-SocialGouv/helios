import { screen, within } from "@testing-library/react";

import { GraphiqueNombrePassageUrgence } from "./GraphiqueNombrePassageUrgence";
import { NombrePassageAuxUrgencesViewModel } from "./NombrePassageAuxUrgencesViewModel";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;

describe("Graphique Nombre de Passage d'urgence", () => {
  let graphiqueTest: GraphiqueTest;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
  });

  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new NombrePassageAuxUrgencesViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

    // THEN
    const rpu = graphiqueTest.abréviationFichierSource("RPU");
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
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-3`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      graphiqueTest.fermeDétail();

      // THEN
      const détails = graphiqueTest.détail;
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
      const titre = graphiqueTest.titre(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES);
      expect(titre).toBeInTheDocument();
    });

    it("désactive la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={viewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
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
      const dateMiseAJour = graphiqueTest.dateMiseAJour("RPU", "01/10/2020");
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombrePassageUrgence nombrePassageAuxUrgencesViewModel={passageUrgenceUneAnnée} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription[0]);
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
