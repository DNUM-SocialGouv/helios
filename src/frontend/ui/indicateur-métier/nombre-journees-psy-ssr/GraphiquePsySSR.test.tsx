import { within, fireEvent, screen } from "@testing-library/react";

import { GraphiquePsySSR } from "./GraphiquePsySSR";
import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";
import { ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";
const activitesSanitaireMensuel: ActivitesSanitaireMensuel = {
  activitesSanitaireMensuelList: [],
  dateDeMiseAJour: "11/12/12"
};

describe("Graphique Psy SSR", () => {
  let graphiqueTest: GraphiqueTest;
  let activitéMensuelleViewModel: ActivitesMensuelViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    activitéMensuelleViewModel = new ActivitesMensuelViewModel(activitesSanitaireMensuel, wording);
  });

  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new NombreDeJourneesPsySSRViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={viewModel} />);

    // THEN
    const pmsi = graphiqueTest.abréviationFichierSource("PMSI");
    expect(pmsi).toBeInTheDocument();
    expect(pmsi).toHaveAttribute("title", wording.PMSI_TITLE);
  });

  it("affiche le titre", () => {
    // GIVEN
    const viewModel = new NombreDeJourneesPsySSRViewModel([], wording);

    // WHEN
    renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={viewModel} />);
    // THEN
    const titre = graphiqueTest.titre(wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR);
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
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-2`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={viewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      expect(graphiqueTest.titreDétail(wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR)).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
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
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // THEN
      const dateMiseAJour = graphiqueTest.dateMiseAJour("PMSI", "01/10/2020");
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", async () => {
      // GIVEN
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription[0]);
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("1 111")).toBeInTheDocument();
      expect(transcriptionTable.getByText("2 222")).toBeInTheDocument();
      expect(transcriptionTable.getByText("3 333")).toBeInTheDocument();
      expect(transcriptionTable.getByText("4 444")).toBeInTheDocument();
    });

    it("affiche la mise en exergue pour les années manquantes", () => {
      // WHEN
      renderFakeComponent(<GraphiquePsySSR activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreJournéesPsySSRViewModel={psySSRUneAnnée} />);

      // THEN
      const exergue = graphiqueTest.miseEnExergue([annéeEnCours - 5, annéeEnCours - 4, annéeEnCours - 3, annéeEnCours - 2]);
      expect(exergue).toBeInTheDocument();
    });
  });
});
