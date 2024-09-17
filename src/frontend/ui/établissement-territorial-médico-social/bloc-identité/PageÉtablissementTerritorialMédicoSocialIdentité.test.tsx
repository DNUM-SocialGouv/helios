import { screen, within } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";

import { RésultatDeRechercheTestBuilder } from "../../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch, trimHtml } from "../../../test-helpers/testHelper";
import { StringFormater } from "../../commun/StringFormater";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { PageÉtablissementTerritorialMédicoSocial } from "../PageÉtablissementTerritorialMédicoSocial";

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
const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths);
const identité = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité;

describe("La page établissement territorial - bloc identité", () => {
  it("affiche le titre dans l’onglet", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
      </SessionProvider>
    );

    // THEN
    expect(document.title).toBe(`ET - ${identité.numéroFinessÉtablissementTerritorial.value} - ${identité.raisonSocialeCourte.value}`);
  });

  it('affiche le titre : "ET - numéro de FINESS - nom court de l’établissement"', () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
      </SessionProvider>
    );

    // THEN
    const titre = screen.getByRole("heading", {
      level: 1,
      name: `ET - ${identité.numéroFinessÉtablissementTerritorial.value} - ${identité.raisonSocialeCourte.value}`,
    });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le bouton pour imprimer", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
      </SessionProvider>
    );

    // THEN
    const imprimer = screen.getByRole("button", { name: wording.TÉLÉCHARGER_EN_PDF });
    expect(imprimer).toHaveAttribute("type", "button");
  });

  it("affiche le nom de l’établissement", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléAdresse = within(indicateurs[4]).getByText(textMatch(`${wording.ADRESSE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
      selector: "p",
    });
    expect(libelléAdresse).toBeInTheDocument();
    const adresse = within(indicateurs[4]).getByText("1 RTE DE VEYZIAT 01117 OYONNAX CEDEX", { selector: "p" });
    expect(adresse).toBeInTheDocument();
  });

  it("affiche le téléphone et e-mail", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    const téléphoneEtEmail = within(indicateurs[5]).getByText("01 23 45 67 89 | a@example.com", { selector: "p" });
    expect(téléphoneEtEmail).toBeInTheDocument();
  });

  it("affiche un lien pour naviguer vers l’entité juridique de rattachement", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    const entitéJuridiqueDeRattachement = within(indicateurs[6]).getByRole("link", { name: "EJ - 010008407 - CH DU HAUT BUGEY" });
    expect(entitéJuridiqueDeRattachement).toHaveAttribute("href", `${paths.ENTITÉ_JURIDIQUE}/010008407`);
  });

  it("affiche la catégorie de l’établissement avec son libellé", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    const catégorieDeLÉtablissement = within(indicateurs[7]).getByText("300 - Ecoles Formant aux Professions Sanitaires", { selector: "p" });
    expect(catégorieDeLÉtablissement).toBeInTheDocument();
  });

  it("affiche le mode de tarification", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    const modeDeTarification = within(indicateurs[8]).getByText("03 - ARS établissements Publics de santé dotation globale", { selector: "p" });
    expect(modeDeTarification).toBeInTheDocument();
  });

  it("affiche le statut juridique de l’établissement", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
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
    const statutÉtablissement = within(indicateurs[9]).getByText(identité.statutJuridique.value);
    expect(statutÉtablissement).toBeInTheDocument();
  });

  it("affiche l’indicateur de mono-établissement à oui quand il est tout seul dans l’entité juridique", () => {
    // GIVEN
    const établissementTerritorialMonoÉtablissement = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: true,
      },
    });

    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMonoÉtablissement}
        />{" "}
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléMonoÉtablissement = within(indicateurs[10]).getByText(
      textMatch(`${wording.MONO_ÉTABLISSEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléMonoÉtablissement).toBeInTheDocument();
    const monoÉtablissement = within(indicateurs[10]).getByText(wording.OUI);
    expect(monoÉtablissement).toBeInTheDocument();
  });

  it("affiche l’indicateur de mono-établissement à non quand il n’est pas tout seul dans l’EJ", () => {
    // GIVEN
    const établissementTerritorialMonoÉtablissement = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
      estMonoÉtablissement: {
        dateMiseÀJourSource: "2021-07-07",
        value: false,
      },
    });

    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMonoÉtablissement}
        />{" "}
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléMonoÉtablissement = within(indicateurs[10]).getByText(
      textMatch(`${wording.MONO_ÉTABLISSEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
      { selector: "p" }
    );
    expect(libelléMonoÉtablissement).toBeInTheDocument();
    const monoÉtablissement = within(indicateurs[10]).getByText(wording.NON);
    expect(monoÉtablissement).toBeInTheDocument();
  });

  describe("l’indicateur d’établissement principal ou secondaire", () => {
    it('affiche "Principal" si l’établissement est un établissement principal', () => {
      // GIVEN
      const établissementTerritorialPrincipal = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        typeÉtablissement: {
          dateMiseÀJourSource: "2022-05-14",
          value: "P",
        },
      });

      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageÉtablissementTerritorialMédicoSocial
            rechercheViewModel={rechercheViewModel}
            établissementTerritorialViewModel={établissementTerritorialPrincipal}
          />{" "}
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const libelléÉtablissementPrincipalOuSecondaire = within(indicateurs[11]).getByText(
        textMatch(`${wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
        { selector: "p" }
      );
      expect(libelléÉtablissementPrincipalOuSecondaire).toBeInTheDocument();
      const établissementPrincipalOuSecondaire = within(indicateurs[11]).getByText(wording.PRINCIPAL);
      expect(établissementPrincipalOuSecondaire).toBeInTheDocument();
    });

    it('affiche "Secondaire" et le numéro Finess de l’établissement principal si l’établissement n’est pas un établissement principal', () => {
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageÉtablissementTerritorialMédicoSocial
            rechercheViewModel={rechercheViewModel}
            établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
          />{" "}
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const libelléÉtablissementPrincipalOuSecondaire = within(indicateurs[11]).getByText(
        textMatch(`${wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
        { selector: "p" }
      );
      expect(libelléÉtablissementPrincipalOuSecondaire).toBeInTheDocument();
      // const établissementPrincipalOuSecondaire = within(indicateurs[11]).getByRole("link", { name: "010005239" });
      // expect(établissementPrincipalOuSecondaire).toHaveAttribute("href", `${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/010005239`);
    });
  });

  it("affiche la date d’entrée en vigueur du CPOM", () => {
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialMédicoSocial}
        />{" "}
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const libelléDateDEntréeEnVigueurDuCpom = within(indicateurs[12]).getByText(
      textMatch(`${trimHtml(wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM)} - ${wording.miseÀJour("08/07/2021")} - Source : TdB Perf`),
      { selector: "p" }
    );
    expect(libelléDateDEntréeEnVigueurDuCpom).toBeInTheDocument();
    const abréviationCpom = within(indicateurs[12]).getByText("CPOM", { selector: "abbr" });
    expect(abréviationCpom).toHaveAttribute("title", "Contrat Pluriannuel d’Objectifs et de Moyens");
    const indicateurÀVenir = within(indicateurs[12]).getByText("01/01/2021");
    expect(indicateurÀVenir).toBeInTheDocument();
  });

  describe('affiche "non renseigné" quand une valeur est vide', () => {
    it("pour le téléphone", () => {
      // GIVEN
      const établissementTerritorialSansTéléphone = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        téléphone: {
          dateMiseÀJourSource: "2022-05-14",
          value: "",
        },
      });

      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageÉtablissementTerritorialMédicoSocial
            rechercheViewModel={rechercheViewModel}
            établissementTerritorialViewModel={établissementTerritorialSansTéléphone}
          />{" "}
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
      const établissementTerritorialSansEMail = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
        courriel: {
          dateMiseÀJourSource: "2022-05-14",
          value: "",
        },
      });

      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageÉtablissementTerritorialMédicoSocial
            rechercheViewModel={rechercheViewModel}
            établissementTerritorialViewModel={établissementTerritorialSansEMail}
          />{" "}
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const téléphoneEtEmail = within(indicateurs[5]).getByText(`01 23 45 67 89 | ${wording.NON_RENSEIGNÉ}`, { selector: "p" });
      expect(téléphoneEtEmail).toBeInTheDocument();
    });
  });

  it("affiche l’adresse incomplète lorsqu’il manque des champs d’adresse", () => {
    // GIVEN
    const établissementTerritorialSansAdresseVoie = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths, {
      adresseVoie: {
        dateMiseÀJourSource: "2022-05-14",
        value: "",
      },
    });

    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialSansAdresseVoie}
        />
      </SessionProvider>
    );

    // THEN
    const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
    const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
    const adresseIncomplète = within(indicateurs[4]).getByText("1 RTE 01117 OYONNAX CEDEX", { selector: "p" });
    expect(adresseIncomplète).toBeInTheDocument();
  });
});
