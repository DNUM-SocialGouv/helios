import { screen, within, fireEvent } from "@testing-library/react";

import { GraphiqueNombreDeJourneesUsld } from "./GraphiqueNombreDeJourneesUsld";
import { NombreDeJourneesUsldViewModel } from "./NombreDeJourneesUsldViewModel";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";

describe("Graphique Nombre de Journées USLD", () => {
  let graphiqueTest: GraphiqueTest;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
  });

  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new NombreDeJourneesUsldViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);

    // THEN
    const sae = graphiqueTest.abréviationFichierSource("SAE");
    expect(sae).toBeInTheDocument();
    expect(sae).toHaveAttribute("title", wording.SAE_TITLE);
  });

  describe("Détails info bulle", () => {
    let viewModel: NombreDeJourneesUsldViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new NombreDeJourneesUsldViewModel([], wording);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-3`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.NOMBRE_DE_JOURNEES_USLD);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("pas de nombre de journées usld renseignées", () => {
    let viewModel: NombreDeJourneesUsldViewModel;

    beforeEach(() => {
      // GIVEN
      viewModel = new NombreDeJourneesUsldViewModel([], wording);
    });

    it("affiche le titre", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);
      // THEN
      const titre = graphiqueTest.titre(wording.NOMBRE_DE_JOURNEES_USLD);
      expect(titre).toBeInTheDocument();
    });

    it("désactive la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toBeDisabled();
    });

    it("affiche la mise en exergue de toutes les années sans données", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={viewModel} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}, ${annéeEnCours - 1}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });

  describe("nombre de journées usld renseignées", () => {
    let passageUrgenceUneAnnée: NombreDeJourneesUsldViewModel;

    beforeAll(() => {
      passageUrgenceUneAnnée = new NombreDeJourneesUsldViewModel(
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

    it("affiche la date de mise à jour du fichier SAE", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const dateMiseAJour = graphiqueTest.dateMiseAJour("SAE", "01/10/2020");
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={passageUrgenceUneAnnée} />);

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
      renderFakeComponent(<GraphiqueNombreDeJourneesUsld etabFiness={etabFiness} etabTitle={etabTitle} nombreDeJourneesUsldViewModel={passageUrgenceUneAnnée} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });
});
