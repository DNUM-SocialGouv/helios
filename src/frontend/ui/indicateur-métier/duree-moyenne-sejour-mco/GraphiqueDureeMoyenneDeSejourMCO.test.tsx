import { within, fireEvent, screen } from "@testing-library/react";

import { DureeMoyenneSejourMCOViewModel } from "./DureeMoyenneDeSejourMCOViewModel";
import { GraphiqueDureeMoyenneDeSejourMCO } from "./GraphiqueDureeMoyenneDeSejourMCO";
import { ActiviteMoyenneMCO } from "./IndicateurDureeMoyenneDesSejoursMCO";
import { ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";
const activitesMoyenneMCO: ActiviteMoyenneMCO[] = [
  {
    année: annéeEnCours - 1,
    dureeMoyenneSejourMedecine: {
      dateMiseÀJourSource: "2022-10-01",
      value: 100,
    },
    dureeMoyenneSejourChirurgie: {
      dateMiseÀJourSource: "2022-10-01",
      value: 150,
    },
    dureeMoyenneSejourObstetrique: {
      dateMiseÀJourSource: "2022-10-01",
      value: 200,
    },
  },
];
const activitesSanitaireMensuel: ActivitesSanitaireMensuel = {
  activitesSanitaireMensuelList: [],
  dateDeMiseAJour: "11/12/12"
}

describe("Graphique Moyenne de Sejour MCO", () => {
  let viewModel: DureeMoyenneSejourMCOViewModel;
  let graphiqueTest: GraphiqueTest;
  let activitéMensuelleViewModel: ActivitesMensuelViewModel;

  beforeAll(() => {
    // GIVEN
    viewModel = new DureeMoyenneSejourMCOViewModel(activitesMoyenneMCO, wording);
    activitéMensuelleViewModel = new ActivitesMensuelViewModel(activitesSanitaireMensuel, wording)
    graphiqueTest = new GraphiqueTest(wording);
  });

  it("affiche abréviation du fichier source", () => {
    // WHEN
    renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const pmsi = graphiqueTest.abréviationFichierSource("PMSI");
    expect(pmsi).toBeInTheDocument();
    expect(pmsi).toHaveAttribute("title", wording.PMSI_TITLE);
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);
    // THEN
    const titre = graphiqueTest.titre(wording.MOYENNE_DE_SEJOUR_MCO);
    expect(titre).toBeInTheDocument();
  });

  it("affiche la date de mise à jour du fichier PMSI", () => {
    // WHEN
    renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const dateMiseAJour = graphiqueTest.dateMiseAJour("PMSI", "01/10/2022");
    expect(dateMiseAJour[0]).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    let viewModel: DureeMoyenneSejourMCOViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new DureeMoyenneSejourMCOViewModel(activitesMoyenneMCO, wording);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-1`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.MOYENNE_DE_SEJOUR_MCO);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription[0]);
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("100")).toBeInTheDocument();
      expect(transcriptionTable.getByText("150")).toBeInTheDocument();
      expect(transcriptionTable.getByText("200")).toBeInTheDocument();
    });
  });

  it("affiche la mise en exergue pour les années manquantes", () => {
    // WHEN
    renderFakeComponent(<GraphiqueDureeMoyenneDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const exergue = graphiqueTest.miseEnExergue([annéeEnCours - 5, annéeEnCours - 4, annéeEnCours - 3, annéeEnCours - 2]);
    expect(exergue).toBeInTheDocument();
  });
});
