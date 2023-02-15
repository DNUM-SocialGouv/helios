import { fireEvent, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { RésultatDeRechercheTestBuilder } from "../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { fakeFrontDependencies, htmlNodeAndReactElementMatcher, renderFakeComponent } from "../../test-helpers/testHelper";
import { régions } from "../région/régions";
import { PageRecherche } from "./PageRecherche";

jest.mock("next/router", () => require("next-router-mock"));

const { paths, wording } = fakeFrontDependencies;

describe("La page de d’accueil", () => {
  it("affiche un bandeau d’information mentionnant le développement du site", () => {
    // WHEN
    renderFakeComponent(<PageRecherche />);

    // THEN
    expect(screen.getByText(wording.SITE_EN_CONSTRUCTION, { selector: "p" })).toBeInTheDocument();
  });

  it("affiche le formulaire", () => {
    // WHEN
    renderFakeComponent(<PageRecherche />);

    // THEN
    const titre = screen.getByRole("heading", { level: 1, name: wording.RECHERCHE_TITRE });
    expect(titre).toBeInTheDocument();
    const description = screen.getByText(htmlNodeAndReactElementMatcher(wording.RECHERCHE_DESCRIPTION), { selector: "p" });
    expect(description).toBeInTheDocument();
    const formulaire = screen.getByRole("search");
    const label = within(formulaire).getByLabelText(wording.RECHERCHE_LABEL);
    expect(label).toBeInTheDocument();
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    expect(input).toBeInTheDocument();
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    expect(rechercher).toBeInTheDocument();
  });

  it("affiche la cartographie", () => {
    // WHEN
    renderFakeComponent(<PageRecherche />);

    // THEN
    const cartographie = screen.getByLabelText(wording.CARTOGRAPHIE);
    const titre = within(cartographie).getByRole("heading", { level: 2, name: wording.CARTOGRAPHIE });
    expect(titre).toBeInTheDocument();
    const sousTitre = within(cartographie).getByRole("heading", { level: 3, name: wording.OFFRE_SANTÉ_PAR_REGION });
    expect(sousTitre).toBeInTheDocument();
    const description = within(cartographie).getByText(wording.CARTOGRAPHIE_DESCRIPTION, { selector: "p" });
    expect(description).toBeInTheDocument();
    const listeRégions = within(cartographie).getAllByRole("listitem");
    const auvergneRhôneAlpes = within(listeRégions[0]).getByRole("link", { name: régions["auvergne-rhone-alpes"].label });
    expect(auvergneRhôneAlpes).toHaveAttribute("href", paths.RÉGION + "/auvergne-rhone-alpes");
    const occitanie = within(listeRégions[1]).getByRole("link", { name: régions["occitanie"].label });
    expect(occitanie).toHaveAttribute("href", paths.RÉGION + "/occitanie");
    const bretagne = within(listeRégions[2]).getByRole("link", { name: régions["bretagne"].label });
    expect(bretagne).toHaveAttribute("href", paths.RÉGION + "/bretagne");
    const paysDeLaLoire = within(listeRégions[3]).getByRole("link", { name: régions["pays-de-la-loire"].label });
    expect(paysDeLaLoire).toHaveAttribute("href", paths.RÉGION + "/pays-de-la-loire");
  });

  it('affiche les résultats après avoir cliqué sur le bouton "Rechercher"', async () => {
    // GIVEN
    const nombreDeRésultats = 3;
    const résultats: Résultat[] = [
      {
        commune: "SAINT-BRIEUC",
        département: "CÔTES D’ARMOR",
        numéroFiness: "010003598",
        raisonSocialeCourte: "CH SAINT BRIEUC",
        type: "Médico-social",
      },
      {
        commune: "SAINT-BRIEUC",
        département: "CÔTES D’ARMOR",
        numéroFiness: "010005239",
        raisonSocialeCourte: "CH HAUT BUGEY",
        type: "Sanitaire",
      },
      {
        commune: "SAINT-BRIEUC",
        département: "CÔTES D’ARMOR",
        numéroFiness: "010008407",
        raisonSocialeCourte: "CH VILLENEUVE DASCQ",
        type: "Entité Juridique",
      },
    ];
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve<RésultatDeRecherche>({
          nombreDeRésultats,
          résultats,
        }),
    });
    renderFakeComponent(<PageRecherche />);
    const terme = "hospitalier";
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: terme } });

    // WHEN
    fireEvent.click(rechercher);

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttente).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttente);
    const résultatsDeRecherche = screen.getByLabelText(wording.RÉSULTAT_DE_RECHERCHE);
    const textDuRésultat = within(résultatsDeRecherche).getByText(wording.rechercheNombreRésultats(nombreDeRésultats, terme), { selector: "p" });
    expect(textDuRésultat).toBeInTheDocument();
    const tuiles = within(résultatsDeRecherche).queryAllByRole("listitem");
    expect(tuiles).toHaveLength(3);
    const titreTuile = within(tuiles[0]).getByRole("heading", { level: 2, name: "010003598 - CH SAINT BRIEUC" });
    expect(titreTuile).toBeInTheDocument();
    const lienMédicoSocial = within(tuiles[0]).getByRole("link", { name: "010003598 - CH SAINT BRIEUC" });
    expect(lienMédicoSocial).toHaveAttribute("href", paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + "/" + résultats[0].numéroFiness);
    const lienSanitaire = within(tuiles[1]).getByRole("link", { name: "010005239 - CH HAUT BUGEY" });
    expect(lienSanitaire).toHaveAttribute("href", paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + résultats[1].numéroFiness);
    const lienEntitéJuridique = within(tuiles[2]).getByRole("link", { name: "010008407 - CH VILLENEUVE DASCQ" });
    expect(lienEntitéJuridique).toHaveAttribute("href", paths.ENTITÉ_JURIDIQUE + "/" + résultats[2].numéroFiness);
    const départementCommuneTuile = within(tuiles[0]).getByText("côtes d’armor, saint-brieuc", { selector: "p" });
    expect(départementCommuneTuile).toBeInTheDocument();
  });

  it("affiche un bouton permettant de charger les résultats suivants quand il y a plusieurs pages de résultats", async () => {
    // GIVEN
    const résultats = [
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "111111111" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "222222222" }),
    ];
    const nombreDeRésultats = résultats.length + 1;

    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve<RésultatDeRecherche>({
          nombreDeRésultats,
          résultats,
        }),
    });
    renderFakeComponent(<PageRecherche />);
    const terme = "hospitalier";
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: terme } });

    // WHEN
    fireEvent.click(rechercher);

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttente).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttente);
    const résultatsDeLaRecherche = screen.getByRole("region", { name: wording.RÉSULTAT_DE_RECHERCHE });
    expect(within(résultatsDeLaRecherche).getByRole("button", { name: wording.VOIR_PLUS_RÉSULTATS })).toBeInTheDocument();
  });

  it("n’affiche pas le bouton permettant de charger les résultats suivants quand tous les résultats sont affichés", async () => {
    // GIVEN
    const résultats = [
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "111111111" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "222222222" }),
    ];
    const nombreDeRésultats = résultats.length;

    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve<RésultatDeRecherche>({
          nombreDeRésultats,
          résultats,
        }),
    });
    renderFakeComponent(<PageRecherche />);
    const terme = "hospitalier";
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: terme } });

    // WHEN
    fireEvent.click(rechercher);

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttente).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttente);
    const résultatsDeLaRecherche = screen.getByRole("region", { name: wording.RÉSULTAT_DE_RECHERCHE });
    expect(within(résultatsDeLaRecherche).queryByRole("button", { name: wording.VOIR_PLUS_RÉSULTATS })).not.toBeInTheDocument();
  });

  it("affiche les résultats à la suite de ceux déjà affichés quand on charge les résultats suivants", async () => {
    // GIVEN
    const résultatsPremièrePage = [
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000001" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000002" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000003" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000004" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000005" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000006" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000007" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000008" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000009" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000010" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000011" }),
    ];
    const résultatsSecondePage = [
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000012" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000013" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000014" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000015" }),
    ];
    const nombreDeRésultats = résultatsPremièrePage.length + résultatsSecondePage.length;

    jest
      .spyOn(global, "fetch")
      // @ts-ignore
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve<RésultatDeRecherche>({
            nombreDeRésultats,
            résultats: résultatsPremièrePage,
          }),
      })
      // @ts-ignore
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve<RésultatDeRecherche>({
            nombreDeRésultats,
            résultats: résultatsSecondePage,
          }),
      });
    renderFakeComponent(<PageRecherche />);
    const terme = "hospitalier";
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: terme } });
    fireEvent.click(rechercher);
    const enAttentePremièreRecherche = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttentePremièreRecherche).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttentePremièreRecherche);
    const résultatsDeLaRecherche = screen.getByRole("region", { name: wording.RÉSULTAT_DE_RECHERCHE });
    const voirPlusDeRésultats = within(résultatsDeLaRecherche).getByRole("button", { name: wording.VOIR_PLUS_RÉSULTATS });

    // WHEN
    fireEvent.click(voirPlusDeRésultats);

    // THEN
    const enAttenteSecondePage = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttenteSecondePage).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttenteSecondePage);
    const tuiles = within(résultatsDeLaRecherche).queryAllByRole("listitem");
    expect(tuiles).toHaveLength(16);
    const titreDernierRésultat = within(tuiles[15]).getByRole("heading", { level: 2, name: "000000015 - CH DU HAUT BUGEY" });
    expect(titreDernierRésultat).toBeInTheDocument();
  });

  it("supprime les résultats précédemment affichés si une nouvelle recherche est lancée", async () => {
    // GIVEN
    const résultatsPremièreRecherche = [
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000001" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000002" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000003" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000004" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000005" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000006" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000007" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000008" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000009" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000010" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000011" }),
    ];
    const nombreDeRésultatsDeLaPremièreRecherche = résultatsPremièreRecherche.length;
    const résultatsSecondeRecherche = [
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: "120000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: "130000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: "140000000" }),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire({ numéroFiness: "150000000" }),
    ];
    const nombreDeRésultatsDeLaSecondeRecherche = résultatsSecondeRecherche.length;

    jest
      .spyOn(global, "fetch")
      // @ts-ignore
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve<RésultatDeRecherche>({
            nombreDeRésultats: nombreDeRésultatsDeLaPremièreRecherche,
            résultats: résultatsPremièreRecherche,
          }),
      })
      // @ts-ignore
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve<RésultatDeRecherche>({
            nombreDeRésultats: nombreDeRésultatsDeLaSecondeRecherche,
            résultats: résultatsSecondeRecherche,
          }),
      });
    renderFakeComponent(<PageRecherche />);
    const termeDeLaPremièreRecherche = "hospitalier";
    const formulaire = screen.getByRole("search");
    const boutonRechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: termeDeLaPremièreRecherche } });
    fireEvent.click(boutonRechercher);
    const enAttentePremièreRecherche = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttentePremièreRecherche).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttentePremièreRecherche);

    const termeDeLaSecondeRecherche = "brouette";
    fireEvent.change(input, { target: { value: termeDeLaSecondeRecherche } });

    // WHEN
    fireEvent.click(boutonRechercher);

    // THEN
    const enAttenteSecondeRecherche = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttenteSecondeRecherche).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttenteSecondeRecherche);
    const résultatsDeLaRecherche = screen.getByRole("region", { name: wording.RÉSULTAT_DE_RECHERCHE });
    const tuiles = within(résultatsDeLaRecherche).queryAllByRole("listitem");
    expect(tuiles).toHaveLength(4);
    const titrePremierRésultatDeLaSecondeRecherche = within(tuiles[0]).getByRole("heading", { level: 2, name: "120000000 - HP VILLENEUVE DASCQ" });
    expect(titrePremierRésultatDeLaSecondeRecherche).toBeInTheDocument();
  });

  it("affiche une phrase explicite si la recherche n’aboutit à aucun résultat", async () => {
    // GIVEN
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve<RésultatDeRecherche>({
          nombreDeRésultats: 0,
          résultats: [],
        }),
    });
    renderFakeComponent(<PageRecherche />);
    const terme = "hospitalier";
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: terme } });

    // WHEN
    fireEvent.click(rechercher);

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttente).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttente);
    const textDuRésultat = screen.getByText(wording.aucunRésultat(terme), { selector: "p" });
    expect(textDuRésultat).toBeInTheDocument();
  });

  it("affiche une phrase explicite si le backend ne répond plus", async () => {
    // GIVEN
    jest.spyOn(global, "fetch").mockRejectedValue("API is down");
    renderFakeComponent(<PageRecherche />);
    const terme = "hospitalier";
    const formulaire = screen.getByRole("search");
    const rechercher = within(formulaire).getByRole("button", { name: wording.RECHERCHE_LABEL });
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    fireEvent.change(input, { target: { value: terme } });

    // WHEN
    fireEvent.click(rechercher);

    // THEN
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttente).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttente);
    const erreurTechnique = screen.getByText(wording.ERREUR_TECHNIQUE, { selector: "p" });
    expect(erreurTechnique).toBeInTheDocument();
  });

  it("affiche les résultats quand on recherche à partir du header", async () => {
    const terme = "hospitalier";
    const router = mockRouter;
    router.query = { terme };
    const nombreDeRésultats = 3;
    const résultats: Résultat[] = [
      {
        commune: "SAINT-BRIEUC",
        département: "CÔTES D’ARMOR",
        numéroFiness: "010003598",
        raisonSocialeCourte: "CH SAINT BRIEUC",
        type: "Médico-social",
      },
      {
        commune: "SAINT-BRIEUC",
        département: "CÔTES D’ARMOR",
        numéroFiness: "010005239",
        raisonSocialeCourte: "CH HAUT BUGEY",
        type: "Sanitaire",
      },
      {
        commune: "SAINT-BRIEUC",
        département: "CÔTES D’ARMOR",
        numéroFiness: "010008407",
        raisonSocialeCourte: "CH VILLENEUVE DASCQ",
        type: "Entité Juridique",
      },
    ];
    // @ts-ignore
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve<RésultatDeRecherche>({
          nombreDeRésultats,
          résultats,
        }),
    });

    // WHEN
    renderFakeComponent(<PageRecherche />);

    // THEN
    const formulaire = screen.getByRole("search");
    const input = within(formulaire).getByPlaceholderText(wording.RECHERCHE_PLACEHOLDER);
    expect(input).toHaveAttribute("value", terme);
    const enAttente = screen.getByText(wording.RECHERCHE_EN_ATTENTE, { selector: "p" });
    expect(enAttente).toBeInTheDocument();
    await waitForElementToBeRemoved(enAttente);
    const résultatsDeRecherche = screen.getByLabelText(wording.RÉSULTAT_DE_RECHERCHE);
    const textDuRésultat = within(résultatsDeRecherche).getByText(wording.rechercheNombreRésultats(nombreDeRésultats, terme), { selector: "p" });
    expect(textDuRésultat).toBeInTheDocument();
    const tuiles = within(résultatsDeRecherche).queryAllByRole("listitem");
    expect(tuiles).toHaveLength(3);
    const titreTuile = within(tuiles[0]).getByRole("heading", { level: 2, name: "010003598 - CH SAINT BRIEUC" });
    expect(titreTuile).toBeInTheDocument();
    const lienMédicoSocial = within(tuiles[0]).getByRole("link", { name: "010003598 - CH SAINT BRIEUC" });
    expect(lienMédicoSocial).toHaveAttribute("href", paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + "/" + résultats[0].numéroFiness);
    const lienSanitaire = within(tuiles[1]).getByRole("link", { name: "010005239 - CH HAUT BUGEY" });
    expect(lienSanitaire).toHaveAttribute("href", paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + résultats[1].numéroFiness);
    const lienEntitéJuridique = within(tuiles[2]).getByRole("link", { name: "010008407 - CH VILLENEUVE DASCQ" });
    expect(lienEntitéJuridique).toHaveAttribute("href", paths.ENTITÉ_JURIDIQUE + "/" + résultats[2].numéroFiness);
    const départementCommuneTuile = within(tuiles[0]).getByText("côtes d’armor, saint-brieuc", { selector: "p" });
    expect(départementCommuneTuile).toBeInTheDocument();
  });
});
