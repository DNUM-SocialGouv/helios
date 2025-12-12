import { fireEvent, screen, within } from "@testing-library/react";

import { BlocRessourcesHumainesEntiteJuridique } from "./BlocRessourcesHumainesEntiteJuridique";
import { EntiteJuridiqueRessourcesHumainesViewModel } from "./EntiteJuridiqueRessourcesHumainesViewModel";
import { EntiteJuridiqueRessourcesHumaines } from "../../../../backend/métier/entities/entité-juridique/EntiteJuridiqueRessourcesHumaines";
import { EntitéJuridiqueViewModelTestBuilder } from "../../../test-helpers/test-builder/EntitéJuridiqueViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";

describe("La page entité juridique - bloc ressources humaines", () => {
  const ressourcesHumainesViewModel = new EntiteJuridiqueRessourcesHumainesViewModel(
    EntitéJuridiqueViewModelTestBuilder.entitéJuridique.ressourcesHumaines, wording
  );
  const indiceDeLIndicateur: Record<keyof EntiteJuridiqueRessourcesHumaines, number> = {
    annee: -1,
    nombreEtpPm: 0,
    nombreEtpPnm: 1,
    depensesInterimPm: 2,
    joursAbsenteismePm: 3,
    joursAbsenteismePnm: 4
  };

  describe("L’indicateur du nombre d’ETP PM", () => {
    it("affiche l’intitulé de l’indicateur du nombre d’ETP PM, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreEtpPm];
      const titre = within(indicateur).getByText(textMatch(wording.NOMBRE_D_ETP_PM), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("07/07/2025")} - Source : ANCRE`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abreviationSourceOrigin = within(indicateur).getAllByText("ANCRE", { selector: "abbr" });
      expect(abreviationSourceOrigin[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-nombre-etp-pm");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du nombre d’ETP PM après avoir cliqué sur le bouton "détails"', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreEtpPm];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      fireEvent.click(détails);

      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: "Nombre d’ETP PM" });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("ANCRE", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });

    it('affiche le tableau de transcription du Nombre d’ETP PM', () => {

      renderFakeComponent(
        <BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />
      );
      const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole('listitem');
      const indicateur = indicateurs[indiceDeLIndicateur.nombreEtpPm];
      const boutonTranscription = within(indicateur).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION });

      fireEvent.click(boutonTranscription);

      const tableau = screen.getAllByRole('table', { name: 'tableau transcription' })[0];
      expect(tableau).toBeInTheDocument();

      const headers = within(tableau).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Année');
      expect(headers[1]).toHaveTextContent('Nombre d’ETP PM');

      const rows = within(tableau).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cells = within(rows[1]).getAllByRole('cell');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('2025');
      expect(cells[1]).toHaveTextContent('100');
    });
  });

  describe("L’indicateur du nombre d’ETP PNM", () => {
    it("affiche l’intitulé de l’indicateur du nombre d’ETP PNM, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreEtpPnm];
      const titre = within(indicateur).getByText(textMatch(wording.NOMBRE_D_ETP_PNM), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("08/07/2025")} - Source : ANCRE`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abreviationSourceOrigin = within(indicateur).getAllByText("ANCRE", { selector: "abbr" });
      expect(abreviationSourceOrigin[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-nombre-etp-pnm");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du nombre d’ETP PNM après avoir cliqué sur le bouton "détails"', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreEtpPnm];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      fireEvent.click(détails);

      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: "Nombre d’ETP PNM" });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("ANCRE", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });

    it('affiche le tableau de transcription du Nombre d’ETP PNM', () => {

      renderFakeComponent(
        <BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />
      );
      const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole('listitem');
      const indicateur = indicateurs[indiceDeLIndicateur.nombreEtpPnm];
      const boutonTranscription = within(indicateur).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION });

      fireEvent.click(boutonTranscription);

      const tableau = screen.getAllByRole('table', { name: 'tableau transcription' })[1];
      expect(tableau).toBeInTheDocument();

      const headers = within(tableau).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Année');
      expect(headers[1]).toHaveTextContent('Nombre d’ETP PNM');

      const rows = within(tableau).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cells = within(rows[1]).getAllByRole('cell');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('2025');
      expect(cells[1]).toHaveTextContent('120');
    });
  });


  describe("L’indicateur dépenses d’intérim PM", () => {
    it("affiche l’intitulé de l’indicateur Dépenses d’intérim PM, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.depensesInterimPm];
      const titre = within(indicateur).getByText(textMatch(wording.DEPENSES_INTERIM_PM), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("09/07/2025")} - Source : ANCRE`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abreviationSourceOrigin = within(indicateur).getAllByText("ANCRE", { selector: "abbr" });
      expect(abreviationSourceOrigin[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-depenses-interim-pm");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle dépenses d’intérim PM après avoir cliqué sur le bouton "détails"', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.depensesInterimPm];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      fireEvent.click(détails);

      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: "Dépenses d’intérim PM" });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("ANCRE", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });

    it('affiche le tableau de transcription de dépenses d’intérim PM', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole('listitem');
      const indicateur = indicateurs[indiceDeLIndicateur.depensesInterimPm];
      const boutonTranscription = within(indicateur).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION });

      fireEvent.click(boutonTranscription);

      const tableau = screen.getAllByRole('table', { name: 'tableau transcription' })[2];
      expect(tableau).toBeInTheDocument();

      const headers = within(tableau).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Année');
      expect(headers[1]).toHaveTextContent('Dépenses d’intérim PM');

      const rows = within(tableau).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cells = within(rows[1]).getAllByRole('cell');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('2025');
      expect(cells[1]).toHaveTextContent('230');
    });
  });


  describe("L’indicateur jours absenteisme PM", () => {
    it("affiche l’intitulé de l’indicateur jours absenteisme PM, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.joursAbsenteismePm];
      const titre = within(indicateur).getByText(textMatch(wording.JOURS_ABSENTEISME_PM), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("10/07/2025")} - Source : ANCRE`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abreviationSourceOrigin = within(indicateur).getAllByText("ANCRE", { selector: "abbr" });
      expect(abreviationSourceOrigin[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-jours-absenteisme-pm");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle jours absenteisme PM après avoir cliqué sur le bouton "détails"', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.joursAbsenteismePm];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      fireEvent.click(détails);

      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: wording.JOURS_ABSENTEISME_PM });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("ANCRE", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });

    it('affiche le tableau de transcription de jours absenteisme PM', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole('listitem');
      const indicateur = indicateurs[indiceDeLIndicateur.joursAbsenteismePm];
      const boutonTranscription = within(indicateur).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION });

      fireEvent.click(boutonTranscription);

      const tableau = screen.getAllByRole('table', { name: 'tableau transcription' })[3];
      expect(tableau).toBeInTheDocument();

      const headers = within(tableau).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Année');
      expect(headers[1]).toHaveTextContent(wording.JOURS_ABSENTEISME_PM);

      const rows = within(tableau).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cells = within(rows[1]).getAllByRole('cell');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('2025');
      expect(cells[1]).toHaveTextContent('41');
    });
  });

  describe("L’indicateur jours absenteisme PNM", () => {
    it("affiche l’intitulé de l’indicateur jours absenteisme PNM, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.joursAbsenteismePnm];
      const titre = within(indicateur).getByText(textMatch(wording.JOURS_ABSENTEISME_PNM), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("11/07/2025")} - Source : ANCRE`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abreviationSourceOrigin = within(indicateur).getAllByText("ANCRE", { selector: "abbr" });
      expect(abreviationSourceOrigin[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-jours-absenteisme-pnm");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle jours absenteisme PNM après avoir cliqué sur le bouton "détails"', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.joursAbsenteismePnm];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      fireEvent.click(détails);

      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: wording.JOURS_ABSENTEISME_PNM });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("ANCRE", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ANCRE_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });

    it('affiche le tableau de transcription de jours absenteisme PNM', () => {

      renderFakeComponent(<BlocRessourcesHumainesEntiteJuridique entiteJuridiqueRessourcesHumainesViewModel={ressourcesHumainesViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      const ressourcesHumaines = screen.getByRole('region', { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole('listitem');
      const indicateur = indicateurs[indiceDeLIndicateur.joursAbsenteismePnm];
      const boutonTranscription = within(indicateur).getByRole('button', { name: wording.AFFICHER_LA_TRANSCRIPTION });

      fireEvent.click(boutonTranscription);

      const tableau = screen.getAllByRole('table', { name: 'tableau transcription' })[4];
      expect(tableau).toBeInTheDocument();

      const headers = within(tableau).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Année');
      expect(headers[1]).toHaveTextContent(wording.JOURS_ABSENTEISME_PNM);

      const rows = within(tableau).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cells = within(rows[1]).getAllByRole('cell');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('2025');
      expect(cells[1]).toHaveTextContent('3 900');
    });
  });

})
