import { fireEvent, screen, within } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { CapacitéSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { EtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { GraphiqueCapacitésParActivité } from "./GraphiqueCapacitésParActivité";
import { GraphiqueCapacitésParActivitéViewModel } from "./GraphiqueCapacitésParActivitéViewModel";

const { wording } = fakeFrontDependencies;

describe("GraphiqueCapacitésParActivité", () => {
  let graphiqueTest: GraphiqueTest;
  const graphiqueCapacitésViewModel = new GraphiqueCapacitésParActivitéViewModel(
    EtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.capacités,
    wording
  );

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
  });

  it('affiche les informations de l’indicateur "Capacité par activités"', () => {
    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={graphiqueCapacitésViewModel} />);

    // THEN
    expect(graphiqueTest.titre(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE)).toBeInTheDocument();
    expect(graphiqueTest.dateMiseAJour("SAE", "02/09/2022")[0]).toBeInTheDocument();
    expect(graphiqueTest.boutonAfficherTranscription).toHaveAttribute("aria-expanded", "false");
    expect(graphiqueTest.boutonAfficherTranscription).not.toBeDisabled();
    expect(graphiqueTest.abréviationFichierSource("SAE")).toHaveAttribute("title", wording.SAE_TITLE);
    expect(graphiqueTest.détail).toHaveAttribute("aria-controls", "nom-info-bulle-capacite-sanitaire");
    expect(graphiqueTest.détail).toHaveAttribute("data-fr-opened", "false");
  });

  describe("Info bulle", () => {
    it('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (Capacité par activités)', () => {
      // GIVEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={graphiqueCapacitésViewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      expect(graphiqueTest.détail).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE });
      expect(graphiqueTest.boutonFermerDétail).toBeInTheDocument();
      expect(graphiqueTest.abréviationFichierSource("SAE")).toHaveAttribute("title", wording.SAE_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const informationsComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(informationsComplémentaires).toBeInTheDocument();
    });

    it('ferme l’info bulle après avoir cliqué sur le bouton "Fermer" (Capacité par activités)', () => {
      // GIVEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={graphiqueCapacitésViewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      graphiqueTest.fermeDétail();

      // THEN
      expect(graphiqueTest.détail).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("Transcription textuelle", () => {
    it("affiche un tableau descriptif avec les toutes les activités", () => {
      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={graphiqueCapacitésViewModel} />);

      // THEN
      const tableau = graphiqueTest.transcriptionTable;

      const libellésLigneDEnTête = [wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE, wording.LITS, wording.PLACES];
      const indicateursLigneDEnTête = within(tableau).getAllByRole("columnheader");
      libellésLigneDEnTête.forEach((libellé, index) => {
        expect(indicateursLigneDEnTête[index].textContent).toBe(libellé);
      });

      const activitésEtValeurs = [
        {
          activité: wording.MÉDECINE,
          valeur: ["20", "50"],
        },
        {
          activité: wording.CHIRURGIE,
          valeur: ["10", "20"],
        },
        {
          activité: wording.OBSTÉTRIQUE,
          valeur: ["5", "6"],
        },
        {
          activité: wording.SSR,
          valeur: ["2", wording.NON_RENSEIGNÉ],
        },
        {
          activité: wording.USLD,
          valeur: ["15", "0"],
        },
        {
          activité: wording.PSYCHIATRIE,
          valeur: ["5", "13"],
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(activitésEtValeurs.length);
      activitésEtValeurs.forEach((activitéEtValeur, index) => {
        const activité = within(lignes[index]).getByRole("cell", { name: activitéEtValeur.activité });
        expect(activité).toBeInTheDocument();
        const valeurLit = within(lignes[index]).getByRole("cell", { name: activitéEtValeur.valeur[0] });
        expect(valeurLit).toBeInTheDocument();
        const valeurPlace = within(lignes[index]).getByRole("cell", { name: activitéEtValeur.valeur[1] });
        expect(valeurPlace).toBeInTheDocument();
      });
    });

    it("affiche un tableau descriptif avec une activité en moins quand le nombre de lit et de place ne sont pas renseignés", () => {
      // GIVEN
      const autorisationsViewModel = new GraphiqueCapacitésParActivitéViewModel(
        [
          mock<CapacitéSanitaire>({
            année: 2022,
            nombreDeLitsEnChirurgie: 10,
            nombreDeLitsEnMédecine: 20,
            nombreDeLitsEnObstétrique: null,
            nombreDeLitsEnSsr: 2,
            nombreDeLitsEnUsld: 15,
            nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 15,
            nombreDePlacesEnChirurgie: 20,
            nombreDePlacesEnMédecine: 50,
            nombreDePlacesEnObstétrique: null,
            nombreDePlacesEnPsyHospitalisationPartielle: 14,
            nombreDePlacesEnSsr: null,
          }),
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsViewModel} />);

      // THEN
      const tableau = graphiqueTest.transcriptionTable;
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(5);
    });

    it("affiche un tableau descriptif avec USLD en moins quand le nombre de lits est non renseigné", () => {
      // GIVEN
      const autorisationsViewModel = new GraphiqueCapacitésParActivitéViewModel(
        [
          mock<CapacitéSanitaire>({
            année: 2022,
            dateMiseÀJourSource: "2022-09-02",
            nombreDeLitsEnChirurgie: 10,
            nombreDeLitsEnMédecine: 20,
            nombreDeLitsEnObstétrique: 20,
            nombreDeLitsEnSsr: 2,
            nombreDeLitsEnUsld: null,
            nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 15,
            nombreDePlacesEnChirurgie: 20,
            nombreDePlacesEnMédecine: 50,
            nombreDePlacesEnObstétrique: 20,
            nombreDePlacesEnPsyHospitalisationPartielle: 14,
            nombreDePlacesEnSsr: 20,
          }),
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsViewModel} />);

      // THEN
      const tableau = graphiqueTest.transcriptionTable;
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(5);
    });

    it("ne doit pas afficher de tableau s'il n'y a pas de données disponible", () => {
      // GIVEN
      const autorisationsSansActivité = new GraphiqueCapacitésParActivitéViewModel([], wording);
      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsSansActivité} />);
      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toBeDisabled();
    });
  });

  describe("Mise en exergue", () => {
    it("doit afficher la mise en exergue pour les 5 dernières années si aucune données n'est disponible", () => {
      // GIVEN
      const autorisationsSansActivité = new GraphiqueCapacitésParActivitéViewModel([], wording);
      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsSansActivité} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}, ${annéeEnCours - 1}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });

    it("doit afficher la mise en exergue pour les années manquantes sur les 5 dernières années", () => {
      // GIVEN
      const autorisationsSansActivité = new GraphiqueCapacitésParActivitéViewModel(
        [mock<CapacitéSanitaire>({ année: annéeEnCours - 2 }), mock<CapacitéSanitaire>({ année: annéeEnCours - 4 })],
        wording
      );
      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsSansActivité} />);

      // THEN
      const exergue = screen.getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 3}, ${annéeEnCours - 1}`, { selector: "p" });
      expect(exergue).toBeInTheDocument();
    });

    it("ne doit pas afficher la mise en exergue si toutes les années sont présentes", () => {
      // GIVEN
      const autorisationsSansActivité = new GraphiqueCapacitésParActivitéViewModel(
        [
          mock<CapacitéSanitaire>({ année: annéeEnCours - 1 }),
          mock<CapacitéSanitaire>({ année: annéeEnCours - 2 }),
          mock<CapacitéSanitaire>({ année: annéeEnCours - 3 }),
          mock<CapacitéSanitaire>({ année: annéeEnCours - 4 }),
          mock<CapacitéSanitaire>({ année: annéeEnCours - 5 }),
        ],
        wording
      );
      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsSansActivité} />);

      // THEN
      const exergue = screen.queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, {
        exact: false,
        selector: "p",
      });
      expect(exergue).not.toBeInTheDocument();
    });

    it("doit considérer une capacité vide comme une donnée manquante", () => {
      const autorisationsSansActivité = new GraphiqueCapacitésParActivitéViewModel(
        [
          {
            année: annéeEnCours - 5,
            dateMiseÀJourSource: "2022-09-02",
            nombreDeLitsEnChirurgie: null,
            nombreDeLitsEnMédecine: null,
            nombreDeLitsEnObstétrique: null,
            nombreDeLitsEnSsr: null,
            nombreDeLitsEnUsld: null,
            nombreDeLitsOuPlacesEnPsyHospitalisationComplète: null,
            nombreDePlacesEnChirurgie: null,
            nombreDePlacesEnMédecine: null,
            nombreDePlacesEnObstétrique: null,
            nombreDePlacesEnPsyHospitalisationPartielle: null,
            nombreDePlacesEnSsr: null,
          },
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsSansActivité} />);

      // THEN
      const exergue = screen.getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}`, {
        exact: false,
        selector: "p",
      });
      expect(exergue).toBeInTheDocument();
    });
  });

  describe("Changes les capacités par année", () => {
    let autorisationsViewModel: GraphiqueCapacitésParActivitéViewModel;

    it("les deux années sont dans le select trié par ordre chronologique", () => {
      // GIVEN
      autorisationsViewModel = new GraphiqueCapacitésParActivitéViewModel(
        [mock<CapacitéSanitaire>({ année: 2021 }), mock<CapacitéSanitaire>({ année: 2022 })],
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsViewModel} />);
      // THEN
      const indicateursAutorisationsEtCapacités = screen.getAllByTestId("groupe-annees");
      expect(indicateursAutorisationsEtCapacités).toHaveLength(2);
      expect(indicateursAutorisationsEtCapacités[0].textContent).toBe("2021");
      expect(indicateursAutorisationsEtCapacités[1].textContent).toBe("2022");
    });

    it("n'affiche pas les années avec des capacités vides", () => {
      // GIVEN
      const autorisationsViewModel = new GraphiqueCapacitésParActivitéViewModel(
        [
          mock<CapacitéSanitaire>({
            année: 2022,
            nombreDeLitsEnChirurgie: null,
            nombreDeLitsEnMédecine: null,
            nombreDeLitsEnObstétrique: null,
            nombreDeLitsEnSsr: null,
            nombreDeLitsEnUsld: null,
            nombreDeLitsOuPlacesEnPsyHospitalisationComplète: null,
            nombreDePlacesEnChirurgie: null,
            nombreDePlacesEnMédecine: null,
            nombreDePlacesEnObstétrique: null,
            nombreDePlacesEnPsyHospitalisationPartielle: null,
            nombreDePlacesEnSsr: null,
          }),
          mock<CapacitéSanitaire>({
            année: 2021,
            nombreDeLitsEnChirurgie: 15,
          }),
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsViewModel} />);
      // THEN
      const indicateursAutorisationsEtCapacités = screen.getAllByTestId("groupe-annees");
      expect(indicateursAutorisationsEtCapacités).toHaveLength(1);
    });

    it("quand on selectionne une autre année, le graphique se met à jour avec la capacité de l’année selectionnée", () => {
      // GIVEN
      const autorisationsViewModel = new GraphiqueCapacitésParActivitéViewModel(
        [
          mock<CapacitéSanitaire>({
            année: 2022,
            nombreDeLitsEnMédecine: 10,
          }),
          mock<CapacitéSanitaire>({
            année: 2021,
            nombreDeLitsEnMédecine: 30,
          }),
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité estSanitaire graphiqueCapacitésParActivitéViewModel={autorisationsViewModel} />);
      const année = screen.getByRole("button", { name: "2021" });

      // WHEN
      fireEvent.click(année);

      // THEN
      const tableauDesCapacités = screen.getByRole("table");
      const body = within(tableauDesCapacités).getAllByRole("rowgroup")[1];
      const médecine = within(body).getAllByRole("row")[0];
      const nbLitMédecine = within(médecine).getAllByRole("cell")[1];
      expect(nbLitMédecine.textContent).toBe("30");
    });
  });
});
