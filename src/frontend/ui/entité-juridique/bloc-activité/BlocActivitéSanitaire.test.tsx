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
    const titre = screen.getByText(wording.NOMBRE_DE_PASSAGES_AUX_URGENCES, { selector: "h6" });
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
    const titre = screen.getByText(wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR, { selector: "h6" });
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
    const titre = screen.queryByText(wording.NOMBRE_DE_SÉJOUR_MCO, { selector: "h6" });
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
    const titre = screen.queryByText(wording.NOMBRE_DE_HAD, { selector: "h6" });
    expect(titre).toBeInTheDocument();
  });
});
