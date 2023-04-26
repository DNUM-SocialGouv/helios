import { fireEvent, screen, within } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../ÉtablissementTerritorialMédicoSocialViewModel";
import { BlocAutorisationEtCapacitéMédicoSocial } from "./BlocAutorisationEtCapacitéMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from "./ÉtablissementTerritorialMédicoSocialAutorisationsViewModel";

const { paths, wording } = fakeFrontDependencies;

describe("La page établissement territorial médico-social - bloc autorisation et capacité", () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths);

  it("affiche le titre de la partie capacités, sa source et l’accès aux détails", () => {
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    // THEN
    const capacités = screen.getAllByRole("listitem")[0];
    const titre = screen.getByText(wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS, { selector: "h6" });
    expect(titre).toBeInTheDocument();
    const dateMiseAJour = within(capacités).getAllByText(textMatch(`${wording.miseÀJour("19/08/2022")} - Source : FINESS`), { selector: "p" });
    expect(dateMiseAJour[0]).toBeInTheDocument();
    const abréviationSourceFournisseur = within(capacités).getAllByText("FINESS", { selector: "abbr" });
    expect(abréviationSourceFournisseur[0]).toHaveAttribute("title", wording.FINESS_TITLE);
    const détails = within(capacités).getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-capacité-par-activités-médico-social");
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it("affiche un tableau descriptif des capacités", () => {
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const capacités = indicateurs[0];
    const tableau = within(capacités).getByRole("table");
    const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ACTIVITÉ });
    const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.CAPACITÉ_INSTALLÉE });
    expect(annéeLigneDEnTête).toBeInTheDocument();
    expect(indicateurLigneDEnTête).toBeInTheDocument();

    const activitésEtCapacités = [
      {
        activité: wording.NOMBRE_TOTAL_DE_PLACE,
        capacité: "30",
      },
      {
        activité: "Accueil de Jour",
        capacité: "10",
      },
      {
        activité: "Hébergement Complet Internat",
        capacité: "10",
      },
      {
        activité: "Prestation en milieu ordinaire",
        capacité: "10",
      },
    ];
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    activitésEtCapacités.forEach((activitéEtCapacité, index) => {
      const annéeDeLaPremièreLigne = within(lignes[index]).getByRole("cell", { name: activitéEtCapacité.activité });
      expect(annéeDeLaPremièreLigne).toBeInTheDocument();
      const valeurDeLaPremièreLigne = within(lignes[index]).getByRole("cell", { name: activitéEtCapacité.capacité });
      expect(valeurDeLaPremièreLigne).toBeInTheDocument();
    });
  });

  it('affiche le contenu de l’info bulle des capacités après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

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
    const abréviationSourceFournisseur = within(infoBulle).getAllByText("FINESS", { selector: "abbr" });
    expect(abréviationSourceFournisseur[0]).toHaveAttribute("title", wording.FINESS_TITLE);
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

  it('ferme l’info bulle des capacités après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

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

  it("affiche le titre de la partie autorisations, sa source et l’accès aux détails", () => {
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const autorisations = indicateurs[1];
    const titre = within(autorisations).getByText(wording.AUTORISATIONS, { selector: "h6" });
    expect(titre).toBeInTheDocument();
    const dateMiseAJour = within(autorisations).getAllByText(textMatch(`${wording.miseÀJour("18/08/2022")} - Source : ARHGOS, FINESS`), { selector: "p" });
    expect(dateMiseAJour[0]).toBeInTheDocument();
    const abréviationSourceFournisseur = within(autorisations).getAllByText("FINESS", { selector: "abbr" });
    expect(abréviationSourceFournisseur[0]).toHaveAttribute("title", wording.FINESS_TITLE);
    const abréviationSourceOrigine = within(autorisations).getAllByText("ARHGOS", { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.ARHGOS_TITLE);
    const détails = within(autorisations).getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-autorisations-médico-social");
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it('affiche le contenu de l’info bulle des autorisations après avoir cliqué sur le bouton "détails"', () => {
    // GIVEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const détails = within(indicateurs[1]).getByRole("button", { name: wording.DÉTAILS });

    // WHEN
    fireEvent.click(détails);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "true");
    const infoBulle = screen.getByRole("dialog", { name: wording.AUTORISATIONS });
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
  });

  it('ferme l’info bulle des autorisations après avoir cliqué sur le bouton "Fermer"', () => {
    // GIVEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const détails = within(indicateurs[1]).getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);
    const infoBulle = screen.getByRole("dialog", { name: wording.AUTORISATIONS });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

    // WHEN
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it("affiche un lien pour chaque disciplines de l’établissement", () => {
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const autorisations = indicateurs[1];
    const discipline1 = within(autorisations).getByRole("link", { name: "Accueil temporaire pour Personnes Âgées [657]" });
    expect(discipline1).toHaveAttribute("aria-expanded", "false");
    const discipline2 = within(autorisations).getByRole("link", { name: "Accueil temporaire pour adultes handicapés [658]" });
    expect(discipline2).toHaveAttribute("aria-expanded", "false");
  });

  it("affiche un lien pour chaque activités d’une discipline", () => {
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const autorisations = indicateurs[1];
    const activité1 = within(autorisations).getByRole("link", { name: "Hébergement Complet Internat [11]" });
    expect(activité1).toHaveAttribute("aria-expanded", "false");
    const activité2 = within(autorisations).getByRole("link", { name: "Prestation en milieu ordinaire [16]" });
    expect(activité2).toHaveAttribute("aria-expanded", "false");
    const activité3 = within(autorisations).getByRole("link", { name: "Accueil de Jour [21]" });
    expect(activité3).toHaveAttribute("aria-expanded", "false");
  });

  it("affiche le titre, les dates et les capacités pour chaque clientèle quand ces informations sont renseignées", () => {
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialMédicoSocial.autorisationsViewModel}
      />
    );

    // THEN
    const autorisationEtCapacité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const indicateurs = within(autorisationEtCapacité).getAllByRole("listitem");
    const autorisations = indicateurs[1];
    const informationsDUneAutorisation = within(autorisations).getAllByRole("list", { name: "dates-et-capacités" })[0];
    const tags = within(informationsDUneAutorisation).getAllByRole("listitem");

    expect(tags[0].textContent).toBe("PH vieillissantes [702]");
    expect(tags[1].textContent).toBe(`${wording.DATE_D_AUTORISATION} : 01/01/2020`);
    expect(tags[2].textContent).toBe(`${wording.MISE_À_JOUR_AUTORISATION} : 01/01/2020`);
    expect(tags[3].textContent).toBe(`${wording.DERNIÈRE_INSTALLATION} : N/A`);
    expect(tags[4].textContent).toBe(`${wording.CAPACITÉ_AUTORISÉE} : 10`);
    expect(tags[5].textContent).toBe(`${wording.CAPACITÉ_INSTALLÉE} : 0`);
  });

  it("affiche une phrase à la place des indicateurs lorsqu’aucune autorisation n’est renseignée", () => {
    // GIVEN
    const établissementTerritorialSansAutorisation = new ÉtablissementTerritorialMédicoSocialViewModel(
      {
        activités: [],
        autorisationsEtCapacités: {
          autorisations: {
            dateMiseÀJourSource: "2022-05-14",
            disciplines: [],
          },
          capacités: {
            capacitéParActivité: [],
            dateMiseÀJourSource: "2022-08-18",
          },
          numéroFinessÉtablissementTerritorial: "010000040",
        },
        budgetEtFinances: [],
        identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
        ressourcesHumaines: [],
      },
      wording,
      paths
    );

    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialSansAutorisation.autorisationsViewModel}
      />
    );

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ });
    const phrase = within(activité).getByText(wording.INDICATEURS_VIDES);
    expect(phrase).toBeInTheDocument();
  });

  it("n'affiche pas les autorisations s'il n'y en a pas", () => {
    const autorisationsCapacites = { ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations, autorisations: { disciplines: [] } };
    const etablissementMedicoSocialAutorisationsViewModel = new ÉtablissementTerritorialMédicoSocialAutorisationsViewModel(
      mock<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité>(autorisationsCapacites),
      wording
    );
    // WHEN
    renderFakeComponent(
      <BlocAutorisationEtCapacitéMédicoSocial établissementTerritorialAutorisationsMédicoSocialViewModel={etablissementMedicoSocialAutorisationsViewModel} />
    );

    // THEN
    const titre = screen.queryByText(wording.AUTORISATIONS, { selector: "h6" });
    expect(titre).not.toBeInTheDocument();
  });
});
