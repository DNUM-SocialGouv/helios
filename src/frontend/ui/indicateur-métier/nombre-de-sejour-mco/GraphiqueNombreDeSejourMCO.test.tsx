import { within } from "@testing-library/react";

import { GraphiqueNombreDeSejourMCO } from "./GraphiqueNombreDeSejourMCO";
import { ActivitéMCO } from "./IndicateurDesSejoursMCO";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";
import { ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

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
const activitesSanitaireMensuel: ActivitesSanitaireMensuel = {
  activitesSanitaireMensuelList: [],
  dateDeMiseAJour: "11/12/12"
}

describe("Graphique Nombre de Sejour MCO", () => {
  let viewModel: NombreDeSejourMCOViewModel;
  let graphiqueTest: GraphiqueTest;
  let activitéMensuelleViewModel: ActivitesMensuelViewModel;

  beforeAll(() => {
    // GIVEN
    viewModel = new NombreDeSejourMCOViewModel(activitesMCO, wording);
    activitéMensuelleViewModel = new ActivitesMensuelViewModel(activitesSanitaireMensuel, wording)
    graphiqueTest = new GraphiqueTest(wording);
  });

  it("affiche abréviation du fichier source", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const pmsi = graphiqueTest.abréviationFichierSource("PMSI");
    expect(pmsi).toBeInTheDocument();
    expect(pmsi).toHaveAttribute("title", wording.PMSI_TITLE);
  });

  it("affiche le titre", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);
    // THEN
    const titre = graphiqueTest.titre(wording.NOMBRE_DE_SÉJOUR_MCO);
    expect(titre).toBeInTheDocument();
  });

  it("affiche la date de mise à jour du fichier PMSI", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const dateMiseAJour = graphiqueTest.dateMiseAJour("PMSI", "01/10/2022");
    expect(dateMiseAJour[0]).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    let viewModel: NombreDeSejourMCOViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new NombreDeSejourMCOViewModel(activitesMCO, wording);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-0`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.NOMBRE_DE_SÉJOUR_MCO);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      graphiqueTest.fermeDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
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

  it("affiche la mise en exergue pour les années manquantes", () => {
    // WHEN
    renderFakeComponent(<GraphiqueNombreDeSejourMCO activitéMensuelleViewModel={activitéMensuelleViewModel} nombreDeSejourMCOViewModel={viewModel} />);

    // THEN
    const exergue = graphiqueTest.miseEnExergue([annéeEnCours - 5, annéeEnCours - 4, annéeEnCours - 3, annéeEnCours - 2]);
    expect(exergue).toBeInTheDocument();
  });
});
