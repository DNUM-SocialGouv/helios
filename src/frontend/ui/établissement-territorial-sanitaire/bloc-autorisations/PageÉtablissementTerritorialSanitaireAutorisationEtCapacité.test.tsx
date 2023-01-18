import { fireEvent, screen, within } from "@testing-library/react";
import { mock, mockDeep } from "jest-mock-extended";

import {
  CapacitéSanitaire,
  ÉtablissementTerritorialSanitaireAutorisationEtCapacité,
} from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { numéroFinessÉtablissementTerritorial } from "../../../../backend/testHelper";
import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../testHelper";
import { BlocAutorisationEtCapacitéSanitaire } from "./BlocAutorisationEtCapacitéSanitaire";
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsViewModel";

const { paths, wording } = fakeFrontDependencies;

describe("La page établissement territorial sanitaire - bloc autorisation et capacité", () => {
  const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
    ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
    wording
  );

  it.each([
    [wording.AUTORISATIONS, "autorisations-sanitaire"],
    [wording.AUTRES_ACTIVITÉS, "autres-activités-sanitaire"],
    [wording.RECONNAISSANCES_CONTRACTUELLES, "reconnaissances-contractuelles-sanitaire"],
    [wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, "équipements-matériels-lourds-sanitaire"],
  ])("affiche le titre de la partie %s, sa source et l’accès aux détails", (nomDeLIndicateur: string, suffixeDeLInfoBulle: string) => {
    // WHEN
    renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
    const autorisationsViewModelSansAutorisations = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
      mockDeep<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>({
        capacités: [mock<CapacitéSanitaire>({ année: 2022 })],
        [champDeLaDonnéeVide]: {
          [activitésOuÉquipements]: [],
        },
      }),
      wording
    );

    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModelSansAutorisations} />
    );

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    expect(within(autorisationEtCapacité).queryByText(nomDeLIndicateur, { selector: "p" })).not.toBeInTheDocument();
    expect(within(autorisationEtCapacité).queryByText(wording.INDICATEURS_VIDES)).not.toBeInTheDocument();
  });

  describe("L’indicateur des autorisations", () => {
    it("affiche un lien pour chaque activité de l’établissement", () => {
      // WHEN
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const autorisations = sélectionneLIndicateur(wording.AUTORISATIONS, indicateurs);
      expect(within(autorisations).getByRole("link", { name: "Hémodialyse en unité médicalisée [42]" })).toBeInTheDocument();
    });

    it("affiche le libellé et le code de la forme, les dates et le numéro arhgos pour chacune des formes quand ces informations sont renseignées", () => {
      // WHEN
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
    const autorisationsViewModel = new ÉtablissementTerritorialSanitaireAutorisationsViewModel(
      {
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
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
    renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={viewModel.autorisationsViewModel} />);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    expect(within(activité).getByText(indicateurAffiché, { selector: "h1" })).toBeInTheDocument();
    expect(within(activité).queryByText(wording.INDICATEURS_VIDES)).not.toBeInTheDocument();
  });

  describe("L’indicateur des reconnaissances contractuelles", () => {
    it("affiche un lien pour chaque reconnaissance contractuelle de l’établissement", () => {
      // WHEN
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const reconnaissancesContractuelles = sélectionneLIndicateur(wording.RECONNAISSANCES_CONTRACTUELLES, indicateurs);
      const activité = within(reconnaissancesContractuelles).getByRole("link", { name: "Surveillance continue [R7]" });
      expect(activité).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche un lien pour chaque modalité d’une reconnaissance contractuelle", () => {
      // WHEN
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

      // THEN
      const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
      const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
      const équipementsMatérielsLourds = sélectionneLIndicateur(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, indicateurs);
      const équipement = within(équipementsMatérielsLourds).getByRole("link", { name: "Appareil d'IRM à utilisation clinique [06201]" });
      expect(équipement).toHaveAttribute("aria-expanded", "false");
    });

    it("affiche les autorisations et leurs dates quand ces informations sont renseignées", () => {
      // WHEN
      renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
    renderFakeComponent(<BlocAutorisationEtCapacitéSanitaire établissementTerritorialSanitaireAutorisationsViewModel={autorisationsViewModel} />);

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
