import { fireEvent, screen, within } from "@testing-library/react";

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { PageÉtablissementTerritorialSanitaire } from "../PageÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "../ÉtablissementTerritorialSanitaireViewModel";

const { paths, wording } = fakeFrontDependencies;

describe("La page établissement territorial sanitaire - bloc activité", () => {
  const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths);

  it.each([
    [wording.NOMBRE_DE_SÉJOUR_MCO, 0, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2, "RPU", wording.RPU_TITLE],
  ])("affiche les informations de l’indicateur %s", (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    expect(indicateurs).toHaveLength(3);
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: "h6" });
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
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1, "PMSI", wording.PMSI_TITLE],
    [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2, "RPU", wording.RPU_TITLE],
  ])(
    'affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (%s)',
    (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
      // GIVEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);
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
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1],
    [wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, 2],
  ])('ferme l’info bulle après avoir cliqué sur le bouton "Fermer" (%s)', (titreSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);
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
        wording.HOSPITALISATION_PARTIELLE_SSR,
        wording.HOSPITALISATION_COMPLÈTE_SSR,
        wording.HOSPITALISATION_PARTIELLE_PSY,
        wording.HOSPITALISATION_COMPLÈTE_PSY,
      ],
      1,
    ],
    [[wording.ANNÉE, wording.NOMBRE_DE_PASSAGES_AUX_URGENCES], 2],
  ])("affiche un tableau descriptif avec les cinq années", (libellésLigneDEnTête, identifiant) => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    const tableau = within(indicateurs[identifiant]).getByRole("table");

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

  it.each([
    [wording.NOMBRE_DE_SÉJOUR_MCO, 1, 1, 1, 1, 1, null, null, null, null, null, null],
    [wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, 1, null, null, null, null, 1, 1, 1, 1, 1, 1],
  ])(
    "n’affiche pas l’indicateur quand sa valeur est vide (%s)",
    (
      titreSection,
      indicateur1,
      indicateur2,
      indicateur3,
      indicateur4,
      indicateur5,
      indicateur6,
      indicateur7,
      indicateur8,
      indicateur9,
      indicateur10,
      indicateur11
    ) => {
      const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel(
        {
          activités: [
            {
              année: 2017,
              nombreDePassagesAuxUrgences: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur1,
              },
              nombreJournéesCompletePsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur2,
              },
              nombreJournéesCompletesSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur3,
              },
              nombreJournéesPartiellesPsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur4,
              },
              nombreJournéesPartielsSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur5,
              },
              nombreSéjoursCompletsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur6,
              },
              nombreSéjoursCompletsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur7,
              },
              nombreSéjoursCompletsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur8,
              },
              nombreSéjoursPartielsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur9,
              },
              nombreSéjoursPartielsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur10,
              },
              nombreSéjoursPartielsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur11,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
            },
            {
              année: 2018,
              nombreDePassagesAuxUrgences: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur1,
              },
              nombreJournéesCompletePsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur2,
              },
              nombreJournéesCompletesSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur3,
              },
              nombreJournéesPartiellesPsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur4,
              },
              nombreJournéesPartielsSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur5,
              },
              nombreSéjoursCompletsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur6,
              },
              nombreSéjoursCompletsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur7,
              },
              nombreSéjoursCompletsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur8,
              },
              nombreSéjoursPartielsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur9,
              },
              nombreSéjoursPartielsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur10,
              },
              nombreSéjoursPartielsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur11,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
            },
            {
              année: 2019,
              nombreDePassagesAuxUrgences: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur1,
              },
              nombreJournéesCompletePsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur2,
              },
              nombreJournéesCompletesSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur3,
              },
              nombreJournéesPartiellesPsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur4,
              },
              nombreJournéesPartielsSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur5,
              },
              nombreSéjoursCompletsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur6,
              },
              nombreSéjoursCompletsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur7,
              },
              nombreSéjoursCompletsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur8,
              },
              nombreSéjoursPartielsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur9,
              },
              nombreSéjoursPartielsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur10,
              },
              nombreSéjoursPartielsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur11,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
            },
            {
              année: 2020,
              nombreDePassagesAuxUrgences: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur1,
              },
              nombreJournéesCompletePsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur2,
              },
              nombreJournéesCompletesSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur3,
              },
              nombreJournéesPartiellesPsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur4,
              },
              nombreJournéesPartielsSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur5,
              },
              nombreSéjoursCompletsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur6,
              },
              nombreSéjoursCompletsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur7,
              },
              nombreSéjoursCompletsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur8,
              },
              nombreSéjoursPartielsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur9,
              },
              nombreSéjoursPartielsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur10,
              },
              nombreSéjoursPartielsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur11,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
            },
            {
              année: 2021,
              nombreDePassagesAuxUrgences: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur1,
              },
              nombreJournéesCompletePsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur2,
              },
              nombreJournéesCompletesSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur3,
              },
              nombreJournéesPartiellesPsy: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur4,
              },
              nombreJournéesPartielsSsr: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur5,
              },
              nombreSéjoursCompletsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur6,
              },
              nombreSéjoursCompletsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur7,
              },
              nombreSéjoursCompletsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur8,
              },
              nombreSéjoursPartielsChirurgie: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur9,
              },
              nombreSéjoursPartielsMédecine: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur10,
              },
              nombreSéjoursPartielsObstétrique: {
                dateMiseÀJourSource: "2021-07-07",
                value: indicateur11,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
            },
          ],
          autorisationsEtCapacités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
          identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
        },
        wording,
        paths
      );

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansActivité} />);

      // THEN
      const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
      const indicateurs = within(activité).queryAllByRole("listitem");
      expect(indicateurs).toHaveLength(2);
      const listes = within(activité).getAllByRole("list");
      const titre = within(listes[0]).queryByText(titreSection, { selector: "p" });
      expect(titre).not.toBeInTheDocument();
    }
  );

  it("n’affiche pas le graphique de l’indicateur mais une mise en exergue quand sa valeur de toutes les années sont vides (Nombre de passages aux urgences)", () => {
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel(
      {
        activités: [
          {
            année: 2017,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2018,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2019,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2020,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2021,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: 1,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
        ],
        autorisationsEtCapacités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      },
      wording,
      paths
    );

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansActivité} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).queryAllByRole("listitem");

    const exergue = within(indicateurs[2]).getByText(
      `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}, ${annéeEnCours - 1}`,
      { selector: "p" }
    );
    expect(exergue).toBeInTheDocument();
    const transcription = within(indicateurs[2]).getByText(wording.AFFICHER_LA_TRANSCRIPTION);
    expect(transcription).toBeDisabled();
  });

  it("affiche une phrase à la place des indicateurs lorsque des activités sont renseignées mais les indicateurs sont vides", () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel(
      {
        activités: [
          {
            année: 2017,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2018,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2019,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2020,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
          {
            année: 2021,
            nombreDePassagesAuxUrgences: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletePsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesCompletesSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartiellesPsy: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreJournéesPartielsSsr: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursCompletsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsChirurgie: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsMédecine: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            nombreSéjoursPartielsObstétrique: {
              dateMiseÀJourSource: "2021-07-07",
              value: null,
            },
            numéroFinessÉtablissementTerritorial: "010000040",
          },
        ],
        autorisationsEtCapacités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      },
      wording,
      paths
    );

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansActivité} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const phrase = within(activité).getByText(wording.INDICATEURS_VIDES);
    expect(phrase).toBeInTheDocument();
  });

  it("affiche une phrase à la place des indicateurs lorsqu’aucune activité n’est renseignée", () => {
    // GIVEN
    const établissementTerritorialSansActivité = new ÉtablissementTerritorialSanitaireViewModel(
      {
        activités: [],
        autorisationsEtCapacités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
        identité: ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
      },
      wording,
      paths
    );

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansActivité} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const phrase = within(activité).getByText(wording.INDICATEURS_VIDES);
    expect(phrase).toBeInTheDocument();
  });
});
