import { screen, within } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import { SessionProvider } from "next-auth/react";

import { ActivitesSanitaireMensuel } from "../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { RésultatDeRechercheTestBuilder } from "../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { EntitéJuridiqueViewModelTestBuilder } from "../../test-helpers/test-builder/EntitéJuridiqueViewModelTestBuilder";
import { EtablissementsTerritoriauxRattachésTestBuilder } from "../../test-helpers/test-builder/EtablissementsTerritoriauxRattachésTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../test-helpers/testHelper";
import { StringFormater } from "../commun/StringFormater";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { ActivitesMensuelViewModel } from "./bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { PageEntitéJuridique } from "./PageEntitéJuridique";

const { wording, paths } = fakeFrontDependencies;
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

const entitéJuridiqueViewModel = EntitéJuridiqueViewModelTestBuilder.crée(wording);
const entitéJuridique = EntitéJuridiqueViewModelTestBuilder.entitéJuridique;
const établissementsTerritoriauxRattachésViewModels = new EtablissementsTerritoriauxRattachésTestBuilder(wording).build();
const result = RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" });
const rechercheViewModel = new RechercheViewModel(result, paths);

describe("La page Entité Juridique", () => {

  it("affiche le titre court dans l’onglet", () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);

    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    expect(document.title).toBe(`EJ - ${entitéJuridique.numéroFinessEntitéJuridique.value} - ${entitéJuridique.raisonSocialeCourte.value}`);
  });

  it('affiche le titre : "EJ - numéro de FINESS - nom court de l’entité juridique"', () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    const titre = screen.getByRole("heading", {
      level: 1,
      name: `EJ - ${entitéJuridique.numéroFinessEntitéJuridique.value} - ${entitéJuridique.raisonSocialeCourte.value}`,
    });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le bouton d’action", () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    const actions = screen.getByRole("button", { name: wording.ACTIONS });
    expect(actions).toHaveAttribute("type", "button");
  });

  it("affiche la categorisation", () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    const categorisation = screen.getByText(wording.PRIVÉ_LUCRATIF);
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche le bloc activité", () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    const blocActivité = screen.getByText(wording.TITRE_BLOC_ACTIVITÉ);
    expect(blocActivité).toBeInTheDocument();
  });

  it("affiche le bloc budget et finance", () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    const blocBudgetFinance = screen.getByText(wording.TITRE_BLOC_BUDGET_ET_FINANCES);
    expect(blocBudgetFinance).toBeInTheDocument();
  });

  it("affiche le bloc autorisation et capacité", () => {
    const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }), wording);
    // WHEN
    renderFakeComponent(
      <SessionProvider session={mockSession}>
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
        />
      </SessionProvider>
    );

    // THEN
    const blocAutorisationCapacites = screen.getByText(wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ);
    expect(blocAutorisationCapacites).toBeInTheDocument();
  });

  describe("affiche le bloc identité de l’entité juridique", () => {
    it("affiche le nom de l’établissement", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const labelÉtablissement = within(indicateurs[0]).getByText(
        textMatch(`${wording.NOM_DE_L_ÉTABLISSEMENT} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
        { selector: "p" }
      );
      expect(labelÉtablissement).toBeInTheDocument();
      const abréviationFiness = within(indicateurs[0]).getByText("FINESS", { selector: "abbr" });
      expect(abréviationFiness).toHaveAttribute("title", wording.FINESS_TITLE);
      const nomDeLÉtablissement = within(indicateurs[0]).getByText(entitéJuridique.raisonSociale.value, { selector: "p" });
      expect(nomDeLÉtablissement).toBeInTheDocument();
    });

    it("affiche la date d’ouverture", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
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
      const nomDeLÉtablissement = within(indicateurs[1]).getByText(StringFormater.formatDate(entitéJuridique.dateOuverture.value), { selector: "p" });
      expect(nomDeLÉtablissement).toBeInTheDocument();
    });

    it("affiche le numéro FINESS", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const labelNuméroFiness = within(indicateurs[2]).getByText(textMatch(`${wording.NUMÉRO_FINESS} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
        selector: "p",
      });
      expect(labelNuméroFiness).toBeInTheDocument();
      const numéroFiness = within(indicateurs[2]).getByText(entitéJuridique.numéroFinessEntitéJuridique.value, { selector: "p" });
      expect(numéroFiness).toBeInTheDocument();
    });

    it("affiche le SIREN", () => {
      // WHEN
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const labelNuméroSiren = within(indicateurs[3]).getByText(textMatch(`${wording.SIREN} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
        selector: "p",
      });
      expect(labelNuméroSiren).toBeInTheDocument();
      const siren = within(indicateurs[3]).getByText(entitéJuridique.siren.value, { selector: "p" });
      expect(siren).toBeInTheDocument();
    });

    it("affiche l’adresse", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const labelAdresse = within(indicateurs[4]).getByText(textMatch(`${wording.ADRESSE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
        selector: "p",
      });
      expect(labelAdresse).toBeInTheDocument();
      const adresse = within(indicateurs[4]).getByText("10 Rue Marcel Proust 22023 ST BRIEUC CEDEX 1", { selector: "p" });
      expect(adresse).toBeInTheDocument();
    });

    it("affiche le téléphone", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const labelTéléphone = within(indicateurs[5]).getByText(textMatch(`${wording.TÉLÉPHONE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`), {
        selector: "p",
      });
      expect(labelTéléphone).toBeInTheDocument();
      const téléphone = within(indicateurs[5]).getByText("02 96 01 71 23", { selector: "p" });
      expect(téléphone).toBeInTheDocument();
    });

    it("affiche le statut de l’établissement", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModel}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const labelStatutÉtablissement = within(indicateurs[6]).getByText(
        textMatch(`${wording.STATUT_JURIDIQUE} - ${wording.miseÀJour("07/07/2021")} - Source : FINESS`),
        { selector: "p" }
      );
      expect(labelStatutÉtablissement).toBeInTheDocument();
      const statutÉtablissement = within(indicateurs[6]).getByText(entitéJuridique.libelléStatutJuridique.value, { selector: "p" });
      expect(statutÉtablissement).toBeInTheDocument();
    });

    it('affiche "non renseigné" quand une valeur est vide', () => {
      // GIVEN
      const entitéJuridiqueViewModelAvecUneValeurVide = EntitéJuridiqueViewModelTestBuilder.crée(wording, {
        téléphone: {
          dateMiseÀJourSource: "2021-07-07",
          value: "",
        },
      });
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModelAvecUneValeurVide}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const téléphone = within(indicateurs[5]).getByText(wording.NON_RENSEIGNÉ, { selector: "p" });
      expect(téléphone).toBeInTheDocument();
    });

    it("affiche l’adresse incomplète lorsqu’il manque des champs d’adresse", () => {
      const entitéJuridiqueActivitéMensuelleViewModel = new ActivitesMensuelViewModel(mock<ActivitesSanitaireMensuel>({
        activitesSanitaireMensuelList: [],
        dateDeMiseAJour: "11/12/12"
      }), wording);
      // GIVEN
      const entitéJuridiqueViewModelAvecUneValeurVide = EntitéJuridiqueViewModelTestBuilder.crée(wording, {
        adresseTypeVoie: {
          dateMiseÀJourSource: "2021-07-07",
          value: "",
        },
      });

      // WHEN
      renderFakeComponent(
        <SessionProvider session={mockSession}>
          <PageEntitéJuridique
            entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}

            entitéJuridiqueViewModel={entitéJuridiqueViewModelAvecUneValeurVide}
            rechercheViewModel={rechercheViewModel}
            établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
          />
        </SessionProvider>
      );

      // THEN
      const ficheDIdentité = screen.getByRole("region", { name: wording.TITRE_BLOC_IDENTITÉ });
      const indicateurs = within(ficheDIdentité).getAllByRole("listitem");
      const adresseIncomplète = within(indicateurs[4]).getByText("10 Marcel Proust 22023 ST BRIEUC CEDEX 1", { selector: "p" });
      expect(adresseIncomplète).toBeInTheDocument();
    });
  });
});
