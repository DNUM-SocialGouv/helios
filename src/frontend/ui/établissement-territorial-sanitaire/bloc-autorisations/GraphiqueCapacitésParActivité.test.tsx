import { fireEvent, screen, within } from "@testing-library/react";
import { mock, mockDeep } from "jest-mock-extended";

import {
  CapacitéSanitaire,
  ÉtablissementTerritorialSanitaireAutorisationEtCapacité,
} from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../testHelper";
import { GraphiqueCapacitésParActivité } from "./GraphiqueCapacitésParActivité";
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsViewModel";

const { wording } = fakeFrontDependencies;

describe("GraphiqueCapacitésParActivité", () => {
  const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
    ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
    wording
  );

  it('affiche les informations de l’indicateur "Capacité par activités"', () => {
    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

    // THEN
    const indicateurs = screen.getAllByRole("listitem");
    const capacitéParActivités = indicateurs[0];
    const titre = within(capacitéParActivités).getByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "p" });
    expect(titre).toBeInTheDocument();
    const dateMiseAJour = within(capacitéParActivités).getAllByText(textMatch(`${wording.miseÀJour("02/09/2022")} - Source : SAE`), { selector: "p" });
    expect(dateMiseAJour[0]).toBeInTheDocument();
    const transcription = within(capacitéParActivités).getByText(wording.AFFICHER_LA_TRANSCRIPTION);
    expect(transcription).toHaveAttribute("aria-expanded", "false");
    expect(transcription).not.toBeDisabled();
    const abréviationSourceOrigine = within(capacitéParActivités).getAllByText("SAE", { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.SAE_TITLE);
    const détails = within(capacitéParActivités).getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-capacite-sanitaire");
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it('affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (Capacité par activités)', () => {
    // GIVEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
    const indicateurs = screen.getAllByRole("listitem");
    const détails = within(indicateurs[0]).getByRole("button", { name: wording.DÉTAILS });

    // WHEN
    fireEvent.click(détails);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "true");
    const infoBulle = screen.getByRole("dialog", { name: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
    expect(fermer).toBeInTheDocument();
    const abréviationSourceOrigine = within(infoBulle).getAllByText("SAE", { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.SAE_TITLE);
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
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
    const indicateurs = screen.getAllByRole("listitem");
    const détails = within(indicateurs[0]).getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);
    const infoBulle = screen.getByRole("dialog", { name: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

    // WHEN
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it("affiche un tableau descriptif avec les toutes les activités", () => {
    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

    // THEN
    const indicateurs = screen.getAllByRole("listitem");
    const tableau = within(indicateurs[0]).getByRole("table");

    const libellésLigneDEnTête = [wording.ACTIVITÉS, wording.LITS, wording.PLACES];
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
    const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
      mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
        capacités: [
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
      }),
      wording
    );

    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

    // THEN
    const indicateurs = screen.getAllByRole("listitem");
    const tableau = within(indicateurs[0]).getByRole("table");
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    expect(lignes).toHaveLength(5);
  });

  it("affiche un tableau descriptif avec USLD en moins quand le nombre de lits est non renseigné", () => {
    // GIVEN
    const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
      mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
        capacités: [
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
      }),
      wording
    );

    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

    // THEN
    const indicateurs = screen.getAllByRole("listitem");
    const tableau = within(indicateurs[0]).getByRole("table");
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    expect(lignes).toHaveLength(5);
  });

  it("n’affiche pas l’indicateur quand sa valeur est vide (Capacité par activités)", () => {
    const autorisationsSansActivité = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
      {
        autorisations: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autorisations,
        autresActivités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autresActivités,
        capacités: [
          {
            année: 2022,
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
        numéroFinessÉtablissementTerritorial: "123456789",
        reconnaissancesContractuelles: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.reconnaissancesContractuelles,
        équipementsMatérielsLourds: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.équipementsMatérielsLourds,
      },
      wording
    );

    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsSansActivité} />);

    // THEN
    const titreCapacitéParActivité = screen.queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "p" });
    expect(titreCapacitéParActivité).not.toBeInTheDocument();
  });

  it("n’affiche pas les capacités lorsque celles-ci ne sont pas renseignées", () => {
    const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
      mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
        autorisations: mock<ÉtablissementTerritorialSanitaireAutorisationEtCapacité["autorisations"]>({
          activités: [{}],
        }),
        capacités: [],
      }),
      wording
    );

    // WHEN
    renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

    // THEN
    const titreCapacitéParActivité = screen.queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "p" });
    expect(titreCapacitéParActivité).not.toBeInTheDocument();
  });

  describe("Changes les capacités par année", () => {
    let autorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel;

    it("les deux années sont dans le select trié par ordre anté chronologique", () => {
      // GIVEN
      autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
        mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
          capacités: [mock<CapacitéSanitaire>({ année: 2021 }), mock<CapacitéSanitaire>({ année: 2022 })],
        }),
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
      // THEN
      const indicateursAutorisationsEtCapacités = screen.getAllByRole("option");
      expect(indicateursAutorisationsEtCapacités).toHaveLength(2);
      expect(indicateursAutorisationsEtCapacités[0].textContent).toBe("2022");
      expect(indicateursAutorisationsEtCapacités[1].textContent).toBe("2021");
    });

    it("l’année la plus récente est selectionnée par défaut", () => {
      // GIVEN
      autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
        mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
          capacités: [mock<CapacitéSanitaire>({ année: 2021 }), mock<CapacitéSanitaire>({ année: 2022 })],
        }),
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
      // THEN
      const années: HTMLOptionElement[] = screen.getAllByRole("option");
      expect(années[0].selected).toBe(true);
    });

    it("n'affiche pas les années avec des capacités vides", () => {
      // GIVEN
      const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
        mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
          capacités: [
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
        }),
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
      // THEN
      const indicateursAutorisationsEtCapacités = screen.getAllByRole("option");
      expect(indicateursAutorisationsEtCapacités).toHaveLength(1);
    });

    it("quand on selectionne une autre année, le graphique se met à jour avec la capacité de l’année selectionnée", () => {
      // GIVEN
      const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
        mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
          capacités: [
            mock<CapacitéSanitaire>({
              année: 2022,
              nombreDeLitsEnMédecine: 10,
            }),
            mock<CapacitéSanitaire>({
              année: 2021,
              nombreDeLitsEnMédecine: 30,
            }),
          ],
        }),
        wording
      );

      // WHEN
      renderFakeComponent(<GraphiqueCapacitésParActivité établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "2021" } });

      // THEN
      const tableauDesCapacités = screen.getByRole("table");
      const body = within(tableauDesCapacités).getAllByRole("rowgroup")[1];
      const médecine = within(body).getAllByRole("row")[0];
      const nbLitMédecine = within(médecine).getAllByRole("cell")[1];
      expect(nbLitMédecine.textContent).toBe("30");
    });
  });
});
