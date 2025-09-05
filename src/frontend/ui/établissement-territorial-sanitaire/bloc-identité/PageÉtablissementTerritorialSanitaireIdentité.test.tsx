import { screen, within } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import { SessionProvider } from "next-auth/react";

import { ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { RésultatDeRechercheTestBuilder } from "../../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { EtablissementTerritorialSanitaireViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialSanitaireViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { StringFormater } from "../../commun/StringFormater";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { CatégorisationViewModel } from "../../entité-juridique/catégorisation/CatégorisationViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { PageÉtablissementTerritorialSanitaire } from "../PageÉtablissementTerritorialSanitaire";

const { paths, wording } = fakeFrontDependencies;
const mockSession = {
  name: "john",
  email: "test@test.fr",
  user: {
    idUser: "1",
    firstname: "Doe",
    role: 1,
    institution: {},
    institutionId: 1,
    codeRegion: 84,
    codeProfiles: [""],
  },
  expires: "1235",
};
const result = RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" });
const rechercheViewModel = new RechercheViewModel(result, paths);
const établissementTerritorialSanitaireViewModel = EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths);
const identité = EtablissementTerritorialSanitaireViewModelTestBuilder.identité;

describe("La page établissement territorial sanitaire - bloc identité", () => {
  it("affiche le titre dans l’onglet", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    expect(document.title).toBe(`ET - ${identité.numéroFinessÉtablissementTerritorial.value} - ${identité.raisonSocialeCourte.value}`);
  });

  it('affiche le titre : "ET - numéro de FINESS - nom court de l’établissement"', () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const titre = screen.getByRole("heading", {
      level: 1,
      name: `ET - ${identité.numéroFinessÉtablissementTerritorial.value} - ${identité.raisonSocialeCourte.value}`,
    });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le bouton d’action", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const actions = screen.getByRole("button", { name: wording.ACTIONS });
    expect(actions).toHaveAttribute("type", "button");
  });

  it("affiche le nom de l’établissement", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

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



  it("affiche la date d’ouverture", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THENs
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");

    const labelÉtablissement = within(indicateurs[1]).getByText(
      textMatch(`${wording.DATE_D_OUVERTURE} - ${wording.miseÀJour("02/02/2022")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(labelÉtablissement).toBeInTheDocument();
    const abréviationFiness = within(indicateurs[1]).getByText("FINESS", { selector: "abbr" });
    expect(abréviationFiness).toHaveAttribute("title", wording.FINESS_TITLE);
    const nomDeLÉtablissement = within(indicateurs[1]).getByText(StringFormater.formatDate(identité.dateOuverture.value), { selector: "p" });
    expect(nomDeLÉtablissement).toBeInTheDocument();
  });

  it("affiche le numéro FINESS", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléNuméroFiness = within(indicateurs[2]).getByText(textMatch(`${wording.NUMÉRO_FINESS} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléNuméroFiness).toBeInTheDocument();
    const numéroFiness = within(indicateurs[2]).getByText(identité.numéroFinessÉtablissementTerritorial.value, { selector: "p" });
    expect(numéroFiness).toBeInTheDocument();
  });

  it("affiche le SIRET", () => {
    // WHEN
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléSiret = within(indicateurs[3]).getByText(textMatch(`${wording.SIRET} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléSiret).toBeInTheDocument();
    const siret = within(indicateurs[3]).getByText(identité.siret.value, { selector: "p" });
    expect(siret).toBeInTheDocument();
  });

  it("affiche l’adresse", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléAdresse = within(indicateurs[4]).getByText(textMatch(`${wording.ADRESSE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléAdresse).toBeInTheDocument();
    const adresse = within(indicateurs[4]).getByText("50 R PAUL PAINLEVE 01130 NANTUA", { selector: "p" });
    expect(adresse).toBeInTheDocument();
  });

  it("affiche le téléphone et e-mail", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléTéléphoneEtEmail = within(indicateurs[5]).getByText(
      textMatch(`${wording.TÉLÉPHONE_ET_EMAIL} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléTéléphoneEtEmail).toBeInTheDocument();
    const téléphoneEtEmail = within(indicateurs[5]).getByText("04 74 75 48 00 | a@example.com", { selector: "p" });
    expect(téléphoneEtEmail).toBeInTheDocument();
  });

  it("affiche un lien pour naviguer vers l’entité juridique de rattachement", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléEntitéJuridiqueDeRattachement = within(indicateurs[6]).getByText(
      textMatch(`${wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléEntitéJuridiqueDeRattachement).toBeInTheDocument();
    const entitéJuridiqueDeRattachement = within(indicateurs[6]).getByRole("link", { name: "EJ - 010008407 - HP VILLENEUVE DASCQ" });
    expect(entitéJuridiqueDeRattachement).toHaveAttribute("href", `${paths.ENTITÉ_JURIDIQUE}/010008407`);
  });

  it("affiche la catégorie de l’établissement avec son libellé", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléCatégorieDeLÉtablissement = within(indicateurs[7]).getByText(
      textMatch(`${wording.CATÉGORIE_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléCatégorieDeLÉtablissement).toBeInTheDocument();
    const catégorieDeLÉtablissement = within(indicateurs[7]).getByText("355 - Centre Hospitalier (C.H.)", { selector: "p" });
    expect(catégorieDeLÉtablissement).toBeInTheDocument();
  });

  it("affiche le mode de tarification", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléModeDeTarification = within(indicateurs[8]).getByText(
      textMatch(`${wording.MODE_DE_TARIFICATION} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléModeDeTarification).toBeInTheDocument();
    const modeDeTarification = within(indicateurs[8]).getByText("99 - Indéterminé", { selector: "p" });
    expect(modeDeTarification).toBeInTheDocument();
  });

  it("affiche le statut juridique de l’établissement", () => {
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléStatutÉtablissement = within(indicateurs[9]).getByText(
      textMatch(`${wording.STATUT_JURIDIQUE_EJ} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléStatutÉtablissement).toBeInTheDocument();
    const labelCategorisation = new CatégorisationViewModel(identité.categorisationDeLEntitéDeRattachement.value, wording).catégorisationWording;
    const statutMatcher = new RegExp(`${identité.statutJuridique.value}.*${labelCategorisation}`, "s");
    const statutÉtablissement = within(indicateurs[9]).getByText(statutMatcher);
    expect(statutÉtablissement).toBeInTheDocument();
  });

  describe('affiche "non renseigné" quand une valeur est vide', () => {
    it("pour le téléphone", () => {
      // GIVEN
      const établissementTerritorialSansTéléphone = EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        téléphone: {
          dateMiseÀJourSource: "2022-05-14",
          value: "",
        },
      });
      const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageÉtablissementTerritorialSanitaire
            activitéMensuelleViewModel={activitéMensuelleViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementTerritorialSanitaireViewModel={établissementTerritorialSansTéléphone}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const téléphoneEtEmail = within(indicateurs[5]).getByText(`${wording.NON_RENSEIGNÉ} | a@example.com`, { selector: "p" });
      expect(téléphoneEtEmail).toBeInTheDocument();
    });

    it("pour l’e-mail", () => {
      // GIVEN
      const établissementTerritorialSansEMail = EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
        courriel: {
          dateMiseÀJourSource: "2022-05-14",
          value: "",
        },
      });
      const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageÉtablissementTerritorialSanitaire
            activitéMensuelleViewModel={activitéMensuelleViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementTerritorialSanitaireViewModel={établissementTerritorialSansEMail}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const téléphoneEtEmail = within(indicateurs[5]).getByText(`04 74 75 48 00 | ${wording.NON_RENSEIGNÉ}`, { selector: "p" });
      expect(téléphoneEtEmail).toBeInTheDocument();
    });
  });

  it("affiche l’adresse incomplète lorsqu’il manque des champs d’adresse", () => {
    // GIVEN
    const établissementTerritorialSansAdresseVoie = EtablissementTerritorialSanitaireViewModelTestBuilder.crée(wording, paths, {
      adresseVoie: {
        dateMiseÀJourSource: "2022-05-14",
        value: "",
      },
    });
    const activitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSansAdresseVoie}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const adresseIncomplète = within(indicateurs[4]).getByText("50 R 01130 NANTUA", { selector: "p" });
    expect(adresseIncomplète).toBeInTheDocument();
  });
});
