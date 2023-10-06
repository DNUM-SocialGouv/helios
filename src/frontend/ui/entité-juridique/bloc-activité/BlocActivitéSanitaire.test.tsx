import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { EntitéJuridiqueActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { BlocActivitéSanitaire } from "./BlocActivitéSanitaire";
import { EntitéJuridiqueActivitésViewModel } from "./EntitéJuridiqueActivitésViewModel";

const { wording } = fakeFrontDependencies;

describe("Bloc Activité Sanitaire", () => {
  it("affiche le GraphiqueNombrePassageUrgence", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel(
      [
        mock<EntitéJuridiqueActivités>({
          année: 2020,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: "2020-10-01",
            value: 100,
          },
          nombreJournéesPartiellesSsr: {},
          nombreJournéesCompletesPsy: {},
          nombreJournéesCompletesSsr: {},
          nombreJournéesPartiellesPsy: {},
          nombreSéjoursHad: {},
        }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le GraphiquePsySSR", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel(
      [
        mock<EntitéJuridiqueActivités>({
          année: annéeEnCours - 1,
          nombreJournéesPartiellesSsr: {
            dateMiseÀJourSource: "2020-10-01",
            value: 1111,
          },
          nombreJournéesCompletesPsy: {
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
          nombreSéjoursHad: {},
          nombreDePassagesAuxUrgences: {},
        }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le GraphiqueNombreDeSejourMCO", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel(
      [
        mock<EntitéJuridiqueActivités>({
          année: annéeEnCours - 1,
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: "2020-10-01",
            value: 100,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: "2020-10-01",
            value: 200,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: "2020-10-01",
            value: 300,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: "2020-10-01",
            value: 300,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: "2020-10-01",
            value: 200,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: "2020-10-01",
            value: 100,
          },
          nombreJournéesPartiellesSsr: {},
          nombreJournéesCompletesPsy: {},
          nombreJournéesCompletesSsr: {},
          nombreJournéesPartiellesPsy: {},
          nombreSéjoursHad: {},
          nombreDePassagesAuxUrgences: {},
        }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.queryByText(wording.NOMBRE_DE_SÉJOUR_MCO, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche  l'indicateur HAD si il y a des donnees", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel(
      [
        mock<EntitéJuridiqueActivités>({
          année: annéeEnCours - 1,
          nombreSéjoursHad: {
            dateMiseÀJourSource: "2020-10-01",
            value: 500,
          },
          nombreJournéesPartiellesSsr: {},
          nombreJournéesCompletesPsy: {},
          nombreJournéesCompletesSsr: {},
          nombreJournéesPartiellesPsy: {},
          nombreDePassagesAuxUrgences: {},
        }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.queryByText(wording.NOMBRE_DE_HAD, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel([], wording);

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.AUCUNE_DONNÉE_RENSEIGNÉE_INDICATEURS);
    expect(titre).toBeInTheDocument();
  });

  it("affiche l'indicateur vide si les données sont null", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueActivitésViewModel(
      [
        mock<EntitéJuridiqueActivités>({
          année: annéeEnCours - 1,
          nombreDePassagesAuxUrgences: {
            value: null,
            dateMiseÀJourSource: "2020-10-01",
          },
          nombreSéjoursPartielsMédecine: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreSéjoursCompletsMédecine: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreSéjoursPartielsChirurgie: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreSéjoursCompletsChirurgie: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreSéjoursPartielsObstétrique: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreSéjoursCompletsObstétrique: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreJournéesPartiellesSsr: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreJournéesCompletesPsy: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreJournéesPartiellesPsy: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreJournéesCompletesSsr: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
          nombreSéjoursHad: {
            dateMiseÀJourSource: "2020-10-01",
            value: null,
          },
        }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.AUCUNE_DONNÉE_RENSEIGNÉE_INDICATEURS);
    expect(titre).toBeInTheDocument();
  });
});
