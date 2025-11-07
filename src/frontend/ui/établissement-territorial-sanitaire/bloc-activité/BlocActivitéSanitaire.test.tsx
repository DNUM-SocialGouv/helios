import { fireEvent, screen, within } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { BlocActivitéSanitaire } from "./BlocActivitéSanitaire";
import { EtablissementTerritorialSanitaireActiviteViewModel } from "./ÉtablissementTerritorialSanitaireActivitéViewModel";
import { ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { EtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

const { wording } = fakeFrontDependencies;

describe("La page établissement territorial sanitaire - bloc activité", () => {
  const activitésViewModel = new EtablissementTerritorialSanitaireActiviteViewModel(EtablissementTerritorialSanitaireViewModelTestBuilder.activités, wording);

  it.each([
    [wording.NOMBRE_DE_SÉJOUR_MCO, 0, "PMSI", wording.PMSI_TITLE],
    [wording.MOYENNE_DE_SEJOUR_MCO, 1, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 2, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_JOURNEES_USLD, 3, "SAE", wording.SAE_TITLE],
    [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 4, "RPU", wording.RPU_TITLE],
  ])("affiche les informations de l’indicateur %s", (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire activitéMensuelleViewModel={activitéMensuelleViewModel} établissementTerritorialSanitaireActivitéViewModel={activitésViewModel} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    expect(indicateurs).toHaveLength(5);
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: "h3" });
    expect(titre).toBeInTheDocument();
    const dateMiseAJour = within(indicateurs[identifiant]).getAllByText(textMatch(`${wording.miseÀJour("07/07/2021")} - Source : ${sourceOrigineAttendue}`), {
      selector: "p",
    });
    expect(dateMiseAJour[0]).toBeInTheDocument();
    const transcription = within(indicateurs[identifiant]).getByText(wording.AFFICHER_LA_TRANSCRIPTION);
    expect(transcription).toHaveAttribute("aria-expanded", "false");
    expect(transcription).not.toBeDisabled();
    const abréviationSourceOrigine = within(indicateurs[identifiant]).getAllByText(sourceOrigineAttendue, { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", abréviationSourceOrigineAttendue);
    const détails = within(indicateurs[identifiant]).getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-${identifiant}`);
    expect(détails).toHaveAttribute("data-fr-opened", "false");
    const exergue = within(indicateurs[identifiant]).queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, { selector: "p" });
    expect(exergue).not.toBeInTheDocument();
  });

  it.each([
    [wording.NOMBRE_DE_SÉJOUR_MCO, 0, "PMSI", wording.PMSI_TITLE],
    [wording.MOYENNE_DE_SEJOUR_MCO, 1, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 2, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_JOURNEES_USLD, 3, "SAE", wording.SAE_TITLE],
    [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 4, "RPU", wording.RPU_TITLE],
  ])(
    'affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (%s)',
    (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
      const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // GIVEN
      renderFakeComponent(<BlocActivitéSanitaire activitéMensuelleViewModel={activitéMensuelleViewModel} établissementTerritorialSanitaireActivitéViewModel={activitésViewModel} />);
      const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
      const indicateurs = within(activité).getAllByRole("listitem");
      const détails = within(indicateurs[identifiant]).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: titreSection });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText(sourceOrigineAttendue, { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", abréviationSourceOrigineAttendue);
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
    }
  );

  it.each([
    [wording.NOMBRE_DE_SÉJOUR_MCO, 0],
    [wording.MOYENNE_DE_SEJOUR_MCO, 1],
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 2],
    [wording.NOMBRE_DE_JOURNEES_USLD, 3],
    [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 4],
  ])('ferme l’info bulle après avoir cliqué sur le bouton "Fermer" (%s)', (titreSection, identifiant) => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // GIVEN
    renderFakeComponent(<BlocActivitéSanitaire activitéMensuelleViewModel={activitéMensuelleViewModel} établissementTerritorialSanitaireActivitéViewModel={activitésViewModel} />);
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    const détails = within(indicateurs[identifiant]).getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);
    const infoBulle = screen.getByRole("dialog", { name: titreSection });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

    // WHEN
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it.each([
    [
      [
        wording.ANNÉE,
        wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
        wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
        wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
        wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
        wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
        wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
      ],
      0,
    ],
    [
      [
        wording.ANNÉE,
        wording.DUREE_MOYENNE_SEJOUR_MEDECINE,
        wording.DUREE_MOYENNE_SEJOUR_CHIRURGIE,
        wording.DUREE_MOYENNE_SEJOUR_OBSTETRIQUE,
      ],
      1,
    ],
    [
      [
        wording.ANNÉE,
        wording.HOSPITALISATION_PARTIELLE_SSR,
        wording.HOSPITALISATION_COMPLÈTE_SSR,
        wording.HOSPITALISATION_PARTIELLE_PSY,
        wording.HOSPITALISATION_COMPLÈTE_PSY,
      ],
      2,
    ],
    [[wording.ANNÉE, wording.NOMBRE_DE_JOURNEES_USLD], 3],
    [[wording.ANNÉE, wording.NOMBRE_DE_PASSAGES_AUX_URGENCES], 4],
  ])("affiche un tableau descriptif avec les cinq années", (libellésLigneDEnTête, identifiant) => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire activitéMensuelleViewModel={activitéMensuelleViewModel} établissementTerritorialSanitaireActivitéViewModel={activitésViewModel} />);

    // THEN
    const tableau = screen.getAllByRole('table', { name: 'tableau transcription' })[identifiant];;

    const indicateursLigneDEnTête = within(tableau).getAllByRole("columnheader");
    libellésLigneDEnTête.forEach((libellé, index) => {
      expect(indicateursLigneDEnTête[index].textContent).toBe(libellé);
    });

    const annéesEtValeurs = [
      {
        année: "2017",
        valeur: "10",
      },
      {
        année: "2018",
        valeur: "20",
      },
      {
        année: "2019",
        valeur: "30",
      },
      {
        année: "2020",
        valeur: "40",
      },
      {
        année: "2021",
        valeur: (5000).toLocaleString("fr"),
      },
    ];
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    annéesEtValeurs.forEach((annéeEtValeur, index) => {
      const année = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.année });
      expect(année).toBeInTheDocument();
      const valeurs = within(lignes[index]).getAllByRole("cell", { name: annéeEtValeur.valeur });
      valeurs.forEach((valeur) => {
        expect(valeur).toBeInTheDocument();
      });
    });
  });
});
