import { fireEvent, screen, within } from "@testing-library/react";

import { ÉtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { PageÉtablissementTerritorialSanitaire } from "../PageÉtablissementTerritorialSanitaire";

const { paths, wording } = fakeFrontDependencies;
const établissementTerritorialSanitaireViewModel = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths);
const identité = ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité;

describe("La page établissement territorial sanitaire - bloc identité", () => {
  it("affiche le titre dans l’onglet", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    expect(document.title).toBe(`ET - ${identité.numéroFinessÉtablissementTerritorial.value} - ${identité.raisonSocialeCourte.value}`);
  });

  it('affiche le titre : "ET - numéro de FINESS - nom court de l’établissement"', () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const titre = screen.getByRole("heading", {
      level: 1,
      name: `ET - ${identité.numéroFinessÉtablissementTerritorial.value} - ${identité.raisonSocialeCourte.value}`,
    });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le bouton pour imprimer", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const imprimer = screen.getByRole("button", { name: wording.TÉLÉCHARGER_EN_PDF });
    expect(imprimer).toHaveAttribute("type", "button");
  });

  it("j’imprime quand je clique sur le bouton d’impression", () => {
    // GIVEN
    jest.spyOn(window, "print").mockImplementation();
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);
    const imprimer = screen.getByRole("button", { name: wording.TÉLÉCHARGER_EN_PDF });

    // WHEN
    fireEvent.click(imprimer);

    // THEN
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it("affiche le nom de l’établissement", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléÉtablissement = within(indicateurs[0]).getByText(
      textMatch(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléÉtablissement).toBeInTheDocument();
    const abréviationFiness = within(indicateurs[0]).getByText("FINESS", { selector: "abbr" });
    expect(abréviationFiness).toHaveAttribute("title", wording.FINESS_TITLE);
    const nomDeLÉtablissement = within(indicateurs[0]).getByText(identité.raisonSociale.value, { selector: "p" });
    expect(nomDeLÉtablissement).toBeInTheDocument();
  });

  it("affiche le numéro FINESS", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléNuméroFiness = within(indicateurs[1]).getByText(textMatch(`${wording.NUMÉRO_FINESS} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléNuméroFiness).toBeInTheDocument();
    const numéroFiness = within(indicateurs[1]).getByText(identité.numéroFinessÉtablissementTerritorial.value, { selector: "p" });
    expect(numéroFiness).toBeInTheDocument();
  });

  it("affiche le SIRET", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléSiret = within(indicateurs[2]).getByText(textMatch(`${wording.SIRET} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléSiret).toBeInTheDocument();
    const siret = within(indicateurs[2]).getByText(identité.siret.value, { selector: "p" });
    expect(siret).toBeInTheDocument();
  });

  it("affiche l’adresse", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléAdresse = within(indicateurs[3]).getByText(textMatch(`${wording.ADRESSE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléAdresse).toBeInTheDocument();
    const adresse = within(indicateurs[3]).getByText("50 R PAUL PAINLEVE 01130 NANTUA", { selector: "p" });
    expect(adresse).toBeInTheDocument();
  });

  it("affiche le téléphone et e-mail", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléTéléphoneEtEmail = within(indicateurs[4]).getByText(
      textMatch(`${wording.TÉLÉPHONE_ET_EMAIL} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléTéléphoneEtEmail).toBeInTheDocument();
    const téléphoneEtEmail = within(indicateurs[4]).getByText("04 74 75 48 00 | a@example.com", { selector: "p" });
    expect(téléphoneEtEmail).toBeInTheDocument();
  });

  it("affiche un lien pour naviguer vers l’entité juridique de rattachement", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléEntitéJuridiqueDeRattachement = within(indicateurs[5]).getByText(
      textMatch(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléEntitéJuridiqueDeRattachement).toBeInTheDocument();
    const entitéJuridiqueDeRattachement = within(indicateurs[5]).getByRole("link", { name: "EJ - 010008407 - HP VILLENEUVE DASCQ" });
    expect(entitéJuridiqueDeRattachement).toHaveAttribute("href", `${paths.ENTITÉ_JURIDIQUE}/010008407`);
  });

  it("affiche la catégorie de l’établissement avec son libellé", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléCatégorieDeLÉtablissement = within(indicateurs[6]).getByText(
      textMatch(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléCatégorieDeLÉtablissement).toBeInTheDocument();
    const catégorieDeLÉtablissement = within(indicateurs[6]).getByText("355 - Centre Hospitalier (C.H.)", { selector: "p" });
    expect(catégorieDeLÉtablissement).toBeInTheDocument();
  });

  it("affiche le mode de tarification", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléModeDeTarification = within(indicateurs[7]).getByText(
      textMatch(`${wording.MODE_DE_TARIFICATION} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléModeDeTarification).toBeInTheDocument();
    const modeDeTarification = within(indicateurs[7]).getByText("99 - Indéterminé", { selector: "p" });
    expect(modeDeTarification).toBeInTheDocument();
  });

  it("affiche le statut juridique de l’établissement", () => {
    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléStatutÉtablissement = within(indicateurs[8]).getByText(
      textMatch(`${wording.STATUT_JURIDIQUE_EJ} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléStatutÉtablissement).toBeInTheDocument();
    const statutÉtablissement = within(indicateurs[8]).getByText(identité.statutJuridique.value);
    expect(statutÉtablissement).toBeInTheDocument();
  });

  describe('affiche "non renseigné" quand une valeur est vide', () => {
    it("pour le téléphone", () => {
      // GIVEN
      const établissementTerritorialSansTéléphone = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        téléphone: {
          dateMiseÀJourSource: "2022-05-14",
          value: "",
        },
      });

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansTéléphone} />);

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const téléphoneEtEmail = within(indicateurs[4]).getByText(`${wording.NON_RENSEIGNÉ} | a@example.com`, { selector: "p" });
      expect(téléphoneEtEmail).toBeInTheDocument();
    });

    it("pour l’e-mail", () => {
      // GIVEN
      const établissementTerritorialSansEMail = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        courriel: {
          dateMiseÀJourSource: "2022-05-14",
          value: "",
        },
      });

      // WHEN
      renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansEMail} />);

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const téléphoneEtEmail = within(indicateurs[4]).getByText(`04 74 75 48 00 | ${wording.NON_RENSEIGNÉ}`, { selector: "p" });
      expect(téléphoneEtEmail).toBeInTheDocument();
    });
  });

  it("affiche l’adresse incomplète lorsqu’il manque des champs d’adresse", () => {
    // GIVEN
    const établissementTerritorialSansAdresseVoie = ÉtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
      adresseVoie: {
        dateMiseÀJourSource: "2022-05-14",
        value: "",
      },
    });

    // WHEN
    renderFakeComponent(<PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSansAdresseVoie} />);

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const adresseIncomplète = within(indicateurs[3]).getByText("50 R 01130 NANTUA", { selector: "p" });
    expect(adresseIncomplète).toBeInTheDocument();
  });
});
