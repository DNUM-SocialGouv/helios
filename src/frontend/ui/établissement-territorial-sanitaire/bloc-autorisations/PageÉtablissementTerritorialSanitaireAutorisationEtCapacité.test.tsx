import { fireEvent, screen, within } from "@testing-library/react";
import { mock, mockDeep } from "jest-mock-extended";

import {
  CapacitéSanitaire,
  ÉtablissementTerritorialSanitaireAutorisationEtCapacité,
} from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { numéroFinessÉtablissementTerritorial } from "../../../../backend/testHelper";
import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../testHelper";
import { PageÉtablissementTerritorialSanitaire } from "../PageÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "../ÉtablissementTerritorialSanitaireViewModel";
import { BlocAutorisationEtCapacitéSanitaire } from "./BlocAutorisationEtCapacitéSanitaire";
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsViewModel";

const { paths, wording } = fakeFrontDependencies;

describe("La page établissement territorial sanitaire - bloc autorisation et capacité", () => {
  const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths);

  describe("L’indicateur de la capacité par activités", () => {
    it('affiche les informations de l’indicateur "Capacité par activités"', () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
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
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
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
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
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
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
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
      const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(
        wording,
        paths,
        {
          capacités: [
            {
              année: 2022,
              dateMiseÀJourSource: "2022-09-02",
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
            },
          ],
        }
      );

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const tableau = within(indicateurs[0]).getByRole("table");
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(5);
    });

    it("affiche un tableau descriptif avec USLD en moins quand le nombre de lits est non renseigné", () => {
      // GIVEN
      const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(
        wording,
        paths,
        {
          capacités: [
            {
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
            },
          ],
        }
      );

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const tableau = within(indicateurs[0]).getByRole("table");
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(5);
    });

    it("n’affiche pas l’indicateur quand sa valeur est vide (Capacité par activités)", () => {
      const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel(
        {
          activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
          autorisationsEtCapacités: {
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
          identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
        },
        wording,
        paths
      );

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansActivité} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateursAutorisationsEtCapacités = within(autorisationEtCapacité).getAllByRole("list")[0];
      const titreCapacitéParActivité = within(indicateursAutorisationsEtCapacités).queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "p" });
      expect(titreCapacitéParActivité).not.toBeInTheDocument();
    });

    it("n’affiche pas les capacités lorsque celles-ci ne sont pas renseignées", () => {
      const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel(
        {
          activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
          autorisationsEtCapacités: {
            autorisations: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autorisations,
            autresActivités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.autresActivités,
            capacités: [],
            numéroFinessÉtablissementTerritorial: "123456789",
            reconnaissancesContractuelles: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.reconnaissancesContractuelles,
            équipementsMatérielsLourds: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités.équipementsMatérielsLourds,
          },
          identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
        },
        wording,
        paths
      );

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansActivité} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateursAutorisationsEtCapacités = within(autorisationEtCapacité).getAllByRole("list")[0];
      const titreCapacitéParActivité = within(indicateursAutorisationsEtCapacités).queryByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "p" });
      expect(titreCapacitéParActivité).not.toBeInTheDocument();
    });

    describe("Afficher une selection avec les années des capacités", () => {
      let autorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel;

      beforeAll(() => {
        // GIVEN
        autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
          mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
            capacités: [mock<CapacitéSanitaire>({ année: 2022 }), mock<CapacitéSanitaire>({ année: 2021 })],
          }),
          wording
        );
      });

      it("les deux années sont dans le select", () => {
        // WHEN
        renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
        // THEN
        const indicateursAutorisationsEtCapacités = screen.getAllByRole("option");
        expect(indicateursAutorisationsEtCapacités).toHaveLength(2);
        expect(indicateursAutorisationsEtCapacités[0].textContent).toBe("2022");
        expect(indicateursAutorisationsEtCapacités[1].textContent).toBe("2021");
      });

      it("l’année la plus récente est selectionnée par défaut", () => {
        // WHEN
        renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
        // THEN
        const annéesAutorisationsEtCapacités = screen.getAllByRole("list")[0];
        const années: HTMLOptionElement[] = within(annéesAutorisationsEtCapacités).getAllByRole("option");
        expect(années[0].selected).toBe(true);
      });
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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);
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

  it.each([
    [wording.AUTORISATIONS, "autorisations-sanitaire"],
    [wording.AUTRES_ACTIVITÉS, "autres-activités-sanitaire"],
    [wording.RECONNAISSANCES_CONTRACTUELLES, "reconnaissances-contractuelles-sanitaire"],
    [wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, "équipements-matériels-lourds-sanitaire"],
  ])("affiche le titre de la partie %s, sa source et l’accès aux détails", (nomDeLIndicateur: string, suffixeDeLInfoBulle: string) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const autorisations = sélectionneLIndicateur(nomDeLIndicateur, indicateurs);
    const titre = within(autorisations).getByText(nomDeLIndicateur, { selector: "p" });
    expect(titre).toBeInTheDocument();
    const dateMiseAJour = within(autorisations).getAllByText(textMatch(`${wording.miseÀJour("29/08/2022")} - Source : ARHGOS, FINESS`), { selector: "p" });
    expect(dateMiseAJour[0]).toBeInTheDocument();
    const abréviationSourceFournisseur = within(autorisations).getAllByText("FINESS", { selector: "abbr" });
    expect(abréviationSourceFournisseur[0]).toHaveAttribute("title", wording.FINESS_TITLE);
    const abréviationSourceOrigine = within(autorisations).getAllByText("ARHGOS", { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ARHGOS_TITLE);
    const détails = within(autorisations).getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-${suffixeDeLInfoBulle}`);
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it.each([[wording.AUTORISATIONS], [wording.AUTRES_ACTIVITÉS], [wording.RECONNAISSANCES_CONTRACTUELLES], [wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS]])(
    "a une infobulle avec le contenu relatif aux %s",
    (nomDeLIndicateur: string) => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autorisations = sélectionneLIndicateur(nomDeLIndicateur, indicateurs);
      const détails = within(autorisations).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: nomDeLIndicateur });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceFournisseur = within(infoBulle).getAllByText("FINESS", { selector: "abbr" });
      expect(abréviationSourceFournisseur[0]).toHaveAttribute("title", wording.FINESS_TITLE);
      const abréviationSourceOrigine = within(infoBulle).getAllByText("ARHGOS", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ARHGOS_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const informationsComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(informationsComplémentaires).toBeInTheDocument();
    }
  );

  it.each([
    [wording.AUTORISATIONS, "autorisations", "activités"],
    [wording.AUTRES_ACTIVITÉS, "autresActivités", "activités"],
    [wording.RECONNAISSANCES_CONTRACTUELLES, "reconnaissancesContractuelles", "activités"],
    [wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, "équipementsMatérielsLourds", "équipements"],
  ])("n’affiche pas l’indicateur si l’établissement n’a pas de %s", (nomDeLIndicateur: string, champDeLaDonnéeVide: string, activitésOuÉquipements) => {
    // GIVEN
    const établissementTerritorialSansAutorisations = new ÉtablissementTerritorialSanitaireViewModel(
      {
        activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
        autorisationsEtCapacités: {
          ...ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
          [champDeLaDonnéeVide]: {
            [activitésOuÉquipements]: [],
            dateMiseÀJourSource: "2022-09-05",
          },
        },
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      },
      wording,
      paths
    );

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansAutorisations} />);

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    expect(within(autorisationEtCapacité).queryByText(nomDeLIndicateur, { selector: "p" })).not.toBeInTheDocument();
    expect(within(autorisationEtCapacité).queryByText(wording.INDICATEURS_VIDES)).not.toBeInTheDocument();
  });

  describe("L’indicateur des autorisations", () => {
    it("affiche un lien pour chaque activité de l’établissement", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs);
      expect(
        within(autorisations).getByRole("link", { name: "Traitement de l'insuffisance rénale chronique par épuration extrarénale [16]" })
      ).toBeInTheDocument();
    });

    it("affiche un lien pour chaque modalité d’une activité", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs);
      expect(within(autorisations).getByRole("link", { name: "Hémodialyse en unité médicalisée [42]" })).toBeInTheDocument();
    });

    it("affiche le libellé et le code de la forme, les dates et le numéro arhgos pour chacune des formes quand ces informations sont renseignées", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs);
      const informationsDUneAutorisation = within(autorisations).getAllByRole("list", { name: "autorisations" })[0];
      const tags = within(informationsDUneAutorisation).getAllByRole("listitem");

      expect(tags[0].textContent).toBe("Pas de forme [00]");
      expect(tags[1].textContent).toBe(`${wording.NUMÉRO_ARHGOS} : 01-00-000`);
      expect(tags[2].textContent).toBe(`${wording.DATE_DE_MISE_EN_OEUVRE} : N/A`);
      expect(tags[3].textContent).toBe(`${wording.DATE_DE_FIN} : 03/05/2026`);
      expect(tags[4].textContent).toBe(`${wording.DATE_D_AUTORISATION} : 11/10/2005`);
    });
  });

  describe("L’indicateur des autres activités", () => {
    it("affiche un lien pour chaque autre activité de l’établissement", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs);
      const activité1 = within(autresActivités).getByRole("link", { name: "Installation de chirurgie esthétique [A0]" });
      expect(activité1).toHaveAttribute("aria-expanded", "false");
      const activité2 = within(autresActivités).getByRole("link", { name: "Dépôt de sang [A1]" });
      expect(activité2).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche un lien pour chaque modalité d’une autre activité", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs);
      const modalité1 = within(autresActivités).getByRole("link", { name: "Dépôt relais [M2]" });
      expect(modalité1).toHaveAttribute("aria-expanded", "false");
      const modalité2 = within(autresActivités).getByRole("link", { name: "Dépôt d'urgence [M0]" });
      expect(modalité2).toHaveAttribute("aria-expanded", "false");
      const modalité3 = within(autresActivités).getByRole("link", { name: "Multi-Organes [31]" });
      expect(modalité3).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche le libellé et le code de la forme et les dates pour chacune des formes quand ces informations sont renseignées", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs);
      const informationsDUneAutreActivité = within(autresActivités).getAllByRole("list", { name: "autre-activité" })[0];
      const tags = within(informationsDUneAutreActivité).getAllByRole("listitem");

      expect(tags[0].textContent).toBe("Pas de forme [00]");
      expect(tags[1].textContent).toBe(`${wording.DATE_D_AUTORISATION} : 03/06/2019`);
      expect(tags[2].textContent).toBe(`${wording.DATE_DE_MISE_EN_OEUVRE} : 03/06/2019`);
      expect(tags[3].textContent).toBe(`${wording.DATE_DE_FIN} : N/A`);
    });
  });

  it("affiche une phrase à la place des indicateurs lorsqu’aucune autorisation ni capacité n’est renseignée", () => {
    // GIVEN
    const établissementTerritorialSansAutorisationsNiCapacités = new ÉtablissementTerritorialSanitaireViewModel(
      {
        activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
        autorisationsEtCapacités: {
          autorisations: {
            activités: [],
            dateMiseÀJourSource: "2022-09-05",
          },
          autresActivités: {
            activités: [],
            dateMiseÀJourSource: "2022-09-05",
          },
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
          numéroFinessÉtablissementTerritorial,
          reconnaissancesContractuelles: {
            activités: [],
            dateMiseÀJourSource: "2022-09-05",
          },
          équipementsMatérielsLourds: {
            dateMiseÀJourSource: "2022-09-05",
            équipements: [],
          },
        },
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      },
      wording,
      paths
    );

    // WHEN
    renderFakeComponent(
      <PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansAutorisationsNiCapacités} />
    );

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    expect(within(activité).getByText(wording.INDICATEURS_VIDES)).toBeInTheDocument();
  });

  it.each([
    {
      indicateurAffiché: wording.AUTORISATIONS,
      viewModel: ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(wording, paths, {
        autresActivités: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
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
        reconnaissancesContractuelles: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: "2022-08-29",
          équipements: [],
        },
      }),
    },
    {
      indicateurAffiché: wording.AUTRES_ACTIVITÉS,
      viewModel: ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(wording, paths, {
        autorisations: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
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
        reconnaissancesContractuelles: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: "2022-08-29",
          équipements: [],
        },
      }),
    },
    {
      indicateurAffiché: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS,
      viewModel: ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(wording, paths, {
        autorisations: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        autresActivités: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        reconnaissancesContractuelles: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: "2022-08-29",
          équipements: [],
        },
      }),
    },
    {
      indicateurAffiché: wording.RECONNAISSANCES_CONTRACTUELLES,
      viewModel: ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(wording, paths, {
        autorisations: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        autresActivités: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
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
        équipementsMatérielsLourds: {
          dateMiseÀJourSource: "2022-08-29",
          équipements: [],
        },
      }),
    },
    {
      indicateurAffiché: wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS,
      viewModel: ÉtablissementTerritorialSanitaireViewModelTestBuilder.créeAvecAutorisationsEtCapacités(wording, paths, {
        autorisations: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
        autresActivités: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
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
        reconnaissancesContractuelles: {
          activités: [],
          dateMiseÀJourSource: "2022-08-29",
        },
      }),
    },
  ])("affiche l’indicateur $indicateurAffiché lorsqu’il est le seul à être renseigné", ({ indicateurAffiché, viewModel }) => {
    // GIVEN
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={viewModel} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    expect(within(activité).getByText(indicateurAffiché, { selector: "h1" })).toBeInTheDocument();
    expect(within(activité).queryByText(wording.INDICATEURS_VIDES)).not.toBeInTheDocument();
  });

  describe("L’indicateur des reconnaissances contractuelles", () => {
    it("affiche un lien pour chaque reconnaissance contractuelle de l’établissement", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs);
      const activité = within(reconnaissancesContractuelles).getByRole("link", { name: "Surveillance continue [R7]" });
      expect(activité).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche un lien pour chaque modalité d’une reconnaissance contractuelle", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs);
      const modalité = within(reconnaissancesContractuelles).getByRole("link", {
        name: "USC polyvalente - adulte (non adossée à une unité de réanimation) [N8]",
      });
      expect(modalité).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche le libellé et le code de la forme, le numéro AHRGOS, CPOM et et les dates pour chacune des formes quand ces informations sont renseignées", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs);
      const informationsDUneReconnaissanceContractuelle = within(reconnaissancesContractuelles).getAllByRole("list", {
        name: "reconnaissance-contractuelle",
      })[0];
      const tags = within(informationsDUneReconnaissanceContractuelle).getAllByRole("listitem");

      expect(tags[0].textContent).toBe("Hospitalisation complète (24 heures consécutives ou plus) [01]");
      expect(tags[1].textContent).toBe(`${wording.NUMÉRO_ARHGOS} : 18-00-RC00000`);
      expect(tags[2].textContent).toBe("Numéro de CPOM : 18-00-C00000");
      expect(within(tags[2]).getByText("CPOM", { selector: "abbr" })).toHaveAttribute("title", wording.CPOM_TITLE);
      expect(tags[3].textContent).toBe("Date d’effet de l’ASR : 30/11/2013");
      expect(within(tags[3]).getByText("ASR", { selector: "abbr" })).toHaveAttribute("title", wording.ASR_TITLE);
      expect(tags[4].textContent).toBe("Date d’effet du CPOM : 01/11/2013");
      expect(within(tags[4]).getByText("CPOM", { selector: "abbr" })).toHaveAttribute("title", wording.CPOM_TITLE);
      expect(tags[5].textContent).toBe("Date de fin du CPOM : 30/11/2018");
      expect(within(tags[5]).getByText("CPOM", { selector: "abbr" })).toHaveAttribute("title", wording.CPOM_TITLE);
      expect(tags[6].textContent).toBe(`${wording.CAPACITÉ_AUTORISÉE} : 4`);
    });
  });

  describe("L’indicateur des équipements matériels lourds", () => {
    it("affiche un lien pour chaque équipement matériel lourd de l’établissement", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const équipementsMatérielsLourds = sélectionneLIndicateur(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, indicateurs);
      const équipement = within(équipementsMatérielsLourds).getByRole("link", { name: "Appareil d'IRM à utilisation clinique [06201]" });
      expect(équipement).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche les autorisations et leurs dates quand ces informations sont renseignées", () => {
      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const équipementsMatérielsLourds = sélectionneLIndicateur(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, indicateurs);
      const informationsDUnEquipementMatérielLourd = within(équipementsMatérielsLourds).getAllByRole("list", { name: "équipement-matériel-lourd" });
      const tagsLigne1 = within(informationsDUnEquipementMatérielLourd[0]).getAllByRole("listitem");
      const tagsLigne2 = within(informationsDUnEquipementMatérielLourd[1]).getAllByRole("listitem");

      expect(tagsLigne1[0].textContent).toBe(`${wording.NUMÉRO_ARHGOS} : 01-00-0000`);
      expect(tagsLigne1[1].textContent).toBe(`${wording.DATE_D_AUTORISATION} : 02/05/2006`);
      expect(tagsLigne1[2].textContent).toBe(`${wording.DATE_DE_MISE_EN_OEUVRE} : 20/01/2009`);
      expect(tagsLigne1[3].textContent).toBe(`${wording.DATE_DE_FIN} : 16/02/2027`);
      expect(tagsLigne2[0].textContent).toBe(`${wording.NUMÉRO_ARHGOS} : 01-20-0000`);
      expect(tagsLigne2[1].textContent).toBe(`${wording.DATE_D_AUTORISATION} : 14/12/2005`);
      expect(tagsLigne2[2].textContent).toBe(`${wording.DATE_DE_MISE_EN_OEUVRE} : N/A`);
      expect(tagsLigne2[3].textContent).toBe(`${wording.DATE_DE_FIN} : 16/03/2026`);
    });
  });

  it("affiche les autorisations et capacités dans le bon ordre", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const itemCapacitéParActivités = sélectionneLIndicateur(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, indicateurs);
    const indexPartieCapacitéParActivités = indicateurs.indexOf(itemCapacitéParActivités);
    const itemAutorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs);
    const indexPartieAutorisations = indicateurs.indexOf(itemAutorisations);
    const itemAutresActivités = sélectionneLIndicateur(wording.AUTRES_ACTIVITÉS, indicateurs);
    const indexPartieAutresActivités = indicateurs.indexOf(itemAutresActivités);
    const itemReconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs);
    const indexPartieReconnaissancesContractuelles = indicateurs.indexOf(itemReconnaissancesContractuelles);
    const itemÉquipementsMatérielsLourds = sélectionneLIndicateur(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, indicateurs);
    const indexPartieÉquipementsMatérielsLourds = indicateurs.indexOf(itemÉquipementsMatérielsLourds);

    expect(indexPartieCapacitéParActivités).toBeLessThan(indexPartieAutorisations);
    expect(indexPartieAutorisations).toBeLessThan(indexPartieAutresActivités);
    expect(indexPartieAutresActivités).toBeLessThan(indexPartieReconnaissancesContractuelles);
    expect(indexPartieReconnaissancesContractuelles).toBeLessThan(indexPartieÉquipementsMatérielsLourds);
  });
});

function sélectionneLIndicateur(indicateur: string, éléments: HTMLElement[]): HTMLElement {
  const itemAutorisations = éléments.filter((element) => element.textContent?.includes(indicateur));
  expect(itemAutorisations).toHaveLength(1);
  return itemAutorisations[0];
}
