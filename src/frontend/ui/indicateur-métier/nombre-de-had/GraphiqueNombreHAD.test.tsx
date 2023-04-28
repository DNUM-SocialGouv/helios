import { screen, within } from "@testing-library/react";

import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { GraphiqueNombreHAD } from "./GraphiqueNombreHAD";
import { GraphiqueNombreHADViewModel } from "./GraphiqueNombreHADViewModel";

const { wording } = fakeFrontDependencies;

describe("Graphique Nombre de HAD", () => {
  let graphiqueTest: GraphiqueTest;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
  });

  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new GraphiqueNombreHADViewModel([]);

    // WHEN
    renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={viewModel} />);

    // THEN
    const rpu = graphiqueTest.abréviationFichierSource("PMSI");
    expect(rpu).toBeInTheDocument();
    expect(rpu).toHaveAttribute("title", wording.PMSI_TITLE);
  });

  describe("Détails info bulle", () => {
    let viewModel: GraphiqueNombreHADViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new GraphiqueNombreHADViewModel([]);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-6`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={viewModel} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.NOMBRE_DE_HAD);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      graphiqueTest.fermeDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("pas de nombre de passage aux urgences renseignés", () => {
    let viewModel: GraphiqueNombreHADViewModel;

    beforeEach(() => {
      // GIVEN
      viewModel = new GraphiqueNombreHADViewModel([]);
    });

    it("affiche le titre", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={viewModel} />);
      // THEN
      const titre = graphiqueTest.titre(wording.NOMBRE_DE_HAD);
      expect(titre).toBeInTheDocument();
    });

    it("affiche la mise en exergue de toutes les années sans données", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={viewModel} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}, ${annéeEnCours - 1}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });

  describe("nombre de passage aux urgences renseignés", () => {
    let nombreHADUneAnnée: GraphiqueNombreHADViewModel;

    beforeAll(() => {
      nombreHADUneAnnée = new GraphiqueNombreHADViewModel([
        {
          année: annéeEnCours - 1,
          value: 100,
          dateMiseÀJourSource: "2020-10-01",
        },
      ]);
    });

    it("affiche la date de mise à jour du fichier PMSI", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={nombreHADUneAnnée} />);

      // THEN
      const dateMiseAJour = graphiqueTest.dateMiseAJour("PMSI", "01/10/2020");
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={nombreHADUneAnnée} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={nombreHADUneAnnée} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription);
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("100")).toBeInTheDocument();
    });

    it("affiche la mise en exergue pour les années manquantes", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreHAD nombreHADViewModel={nombreHADUneAnnée} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });
});
