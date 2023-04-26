import { fireEvent, screen, within } from "@testing-library/react";

import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { BlocRessourcesHumainesMédicoSocial } from "./BlocRessourcesHumainesMédicoSocial";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";

const { wording } = fakeFrontDependencies;

describe("La page établissement territorial - bloc ressources humaines", () => {
  const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
    ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.ressourcesHumaines,
    wording
  );
  const indiceDeLIndicateur: Record<keyof ÉtablissementTerritorialMédicoSocialRessourcesHumaines, number> = {
    année: -1,
    nombreDEtpRéalisés: 0,
    nombreDeCddDeRemplacement: 1,
    tauxDAbsentéisme: 5,
    tauxDEtpVacants: 3,
    tauxDePrestationsExternes: 2,
    tauxDeRotationDuPersonnel: 4,
  };

  describe("L’indicateur du nombre d’ETP réalisé", () => {
    it("affiche l’intitulé de l’indicateur du nombre d’ETP réalisé, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés];
      const titre = within(indicateur).getByText(textMatch(wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION), { selector: "h6" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("06/06/2022")} - Source : CNSA`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("CNSA", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.CNSA_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-nombre-etp-réalisé");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du nombre d’ETP réalisé après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreDEtpRéalisés];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: "Nombre d’ Équivalent Temps Plein Total réalisé" });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("CNSA", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.CNSA_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });
  });

  describe("L’indicateur du nombre de CDD de remplacement", () => {
    it("affiche l’intitulé de l’indicateur du nombre de CDD de remplacement, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreDeCddDeRemplacement];
      const titre = within(indicateur).getByText(textMatch(wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION), { selector: "h6" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("10/10/2022")} - Source : TdB Perf`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-nombre-de-cdd-de-remplacement");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du nombre de CDD de remplacement après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.nombreDeCddDeRemplacement];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: "Nombre de Contrat à Durée Déterminée de remplacement" });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });
  });

  describe("L’indicateur du taux de prestations externes sur les prestations directes", () => {
    it("affiche l’intitulé de l’indicateur du taux de prestations externes sur les prestations directes, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDePrestationsExternes];
      const titre = within(indicateur).getByText(wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, { selector: "h6" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("10/10/2022")} - Source : TdB Perf`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-taux-de-prestations-externes");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du taux de prestations externes sur les prestations directes après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDePrestationsExternes];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });
  });

  describe("L’indicateur du taux d’ETP vacants au 31 décembre", () => {
    it("affiche l’intitulé de l’indicateur du taux d’ETP vacants au 31 décembre, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDEtpVacants];
      const titre = within(indicateur).getByText(wording.TAUX_D_ETP_VACANTS_AU_31_12, { selector: "h6" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("10/10/2022")} - Source : TdB Perf`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-taux-d-etp-vacants");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du taux d’ETP vacants au 31 décembre après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDEtpVacants];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: wording.TAUX_D_ETP_VACANTS_AU_31_12 });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });
  });

  describe("L’indicateur du taux de rotation du personnel", () => {
    it("affiche l’intitulé de l’indicateur du taux de rotation du personnel, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDeRotationDuPersonnel];
      const titre = within(indicateur).getByText(wording.TAUX_DE_ROTATION_DU_PERSONNEL, { selector: "h6" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("10/10/2022")} - Source : TdB Perf`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-taux-de-rotation-du-personnel");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du taux de rotation du personnel après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDeRotationDuPersonnel];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: wording.TAUX_DE_ROTATION_DU_PERSONNEL });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });
  });

  describe("L’indicateur du taux d’absentéisme", () => {
    it("affiche l’intitulé de l’indicateur du taux d’absentéisme, avec sa date de mise à jour, sa source et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      const titre = within(indicateur).getByText(wording.TAUX_D_ABSENTÉISME, { selector: "h6" });
      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("10/10/2022")} - Source : TdB Perf`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-ressources-humaines-taux-d-absentéisme");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du taux d’absentéisme après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: wording.TAUX_D_ABSENTÉISME });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("TdB Perf", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.TDB_PERF_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
      expect(modeDeCalcul).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
      const infosComplémentaires = within(infoBulle).getByRole("region", { name: wording.INFOS_COMPLÉMENTAIRES });
      expect(infosComplémentaires).toBeInTheDocument();
    });

    it("affiche une phrase présentant le taux d’absentéisme hors formation quand il n’est pas nul", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const tauxDAbsentéisme = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      expect(within(tauxDAbsentéisme).getByText(textMatch("Taux hors formation = 27,3 %, dont"))).toBeInTheDocument();
    });

    it("affiche une phrase présentant le taux d’absentéisme hors formation quand il est nul", () => {
      // GIVEN
      const tauxDAbsentéismeNul = {
        dateMiseÀJourSource: "2022-10-10",
        horsFormation: 0,
        pourAccidentMaladieProfessionnelle: 0,
        pourCongésSpéciaux: 0,
        pourMaladieCourteDurée: 0,
        pourMaladieLongueDurée: 0,
        pourMaladieMoyenneDurée: null,
        pourMaternitéPaternité: null,
      };

      const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
        [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({
            année: 2020,
            tauxDAbsentéisme: tauxDAbsentéismeNul,
          }),
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const tauxDAbsentéisme = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      expect(within(tauxDAbsentéisme).getByText(textMatch("Taux hors formation = 0 %"))).toBeInTheDocument();
    });

    it("affiche un tableau descriptif avec tous les motifs d’absentéismes ayant des valeurs non nulles", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const tauxDAbsentéisme = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      const tableau = within(tauxDAbsentéisme).getByRole("table");
      const motifLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.MOTIF_DU_TAUX_D_ABSENTÉISME });
      const tauxLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX });
      expect(motifLigneDEnTête).toBeInTheDocument();
      expect(tauxLigneDEnTête).toBeInTheDocument();

      const motifsEtValeurs = [
        {
          motif: wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE,
          valeur: "0,5 %",
        },
        {
          motif: wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE,
          valeur: "1,8 %",
        },
        {
          motif: wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE,
          valeur: "4,3 %",
        },
        {
          motif: wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ,
          valeur: "9,1 %",
        },
        {
          motif: wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX,
          valeur: "11,6 %",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      motifsEtValeurs.forEach((annéeEtValeur, index) => {
        const motif = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.motif });
        expect(motif).toBeInTheDocument();
        const valeur = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.valeur });
        expect(valeur).toBeInTheDocument();
      });
    });

    it("affiche les années dans une liste déroulante par ordre anté-chronologique quand le taux d’absentéisme de ces années est renseigné", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const tauxDAbsentéisme = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      const année = within(tauxDAbsentéisme).getByRole("combobox");
      expect(année).toBeInTheDocument();
      const années = within(année).getAllByRole("option");
      expect(années[0]).toHaveAttribute("value", "2021");
      expect(années[0].textContent).toBe("2021");
      expect(années[1]).toHaveAttribute("value", "2020");
      expect(années[1].textContent).toBe("2020");
      expect(années[2]).toHaveAttribute("value", "2019");
      expect(années[2].textContent).toBe("2019");
    });

    it("n’affiche pas les années dans une liste déroulante quand aucune donnée n’est renseignée", () => {
      const tauxDAbsentéismeNul = {
        dateMiseÀJourSource: "2022-10-10",
        horsFormation: null,
        pourAccidentMaladieProfessionnelle: null,
        pourCongésSpéciaux: null,
        pourMaladieCourteDurée: null,
        pourMaladieLongueDurée: null,
        pourMaladieMoyenneDurée: null,
        pourMaternitéPaternité: null,
      };
      const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
        [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2019, tauxDAbsentéisme: tauxDAbsentéismeNul }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020, tauxDAbsentéisme: tauxDAbsentéismeNul }),
        ],
        wording
      );

      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
      const tauxDAbsentéisme = indicateurs[indiceDeLIndicateur.tauxDAbsentéisme];
      const année = within(tauxDAbsentéisme).queryByRole("combobox");
      expect(année).not.toBeInTheDocument();
    });
  });

  it.each([
    ["Nombre d’ Équivalent Temps Plein Total réalisé", indiceDeLIndicateur.nombreDEtpRéalisés],
    ["Nombre de Contrat à Durée Déterminée de remplacement", indiceDeLIndicateur.nombreDeCddDeRemplacement],
    [wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, indiceDeLIndicateur.tauxDePrestationsExternes],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel],
    [wording.TAUX_D_ABSENTÉISME, indiceDeLIndicateur.tauxDAbsentéisme],
  ])('ferme l’info bulle du nombre d’ETP réalisé après avoir cliqué sur le bouton "Fermer"', (titreDeLInfoBulle, indiceDeLIndicateur) => {
    // GIVEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);
    const infoBulle = within(indicateur).getByRole("dialog", { name: titreDeLInfoBulle });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

    // WHEN
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it.each([
    [wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDEtpRéalisés, "47,42", "9,71", "10,44"],
    [wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDeCddDeRemplacement, "45", "4", "3"],
    [wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, indiceDeLIndicateur.tauxDePrestationsExternes, "65,9 %", "23,2 %", "9,3 %"],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants, "65,2 %", "16,4 %", "13,3 %"],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel, "66,7 %", "34,4 %", "14,7 %"],
  ])("affiche un tableau descriptif de l’indicateur %s avec les trois années", (enTêteDuTableau, indiceDeLIndicateur, valeur2019, valeur2020, valeur2021) => {
    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const tauxDeCaf = indicateurs[indiceDeLIndicateur];
    const tableau = within(tauxDeCaf).getByRole("table");
    const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
    const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: enTêteDuTableau });
    expect(annéeLigneDEnTête).toBeInTheDocument();
    expect(indicateurLigneDEnTête).toBeInTheDocument();

    const annéesEtValeurs = [
      {
        année: "2019",
        valeur: valeur2019,
      },
      {
        année: "2020",
        valeur: valeur2020,
      },
      {
        année: "2021",
        valeur: valeur2021,
      },
    ];
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    annéesEtValeurs.forEach((annéeEtValeur, index) => {
      const année = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.année });
      expect(année).toBeInTheDocument();
      const valeur = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.valeur });
      expect(valeur).toBeInTheDocument();
    });
  });

  it.each([
    [wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDEtpRéalisés, "9,71"],
    [wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDeCddDeRemplacement, "4"],
    [wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, indiceDeLIndicateur.tauxDePrestationsExternes, "23,2 %"],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants, "16,4 %"],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel, "34,4 %"],
  ])("affiche un tableau descriptif de l’indicateur %s  avec deux années", (enTêteDuTableau, indiceDeLIndicateur, valeur) => {
    // GIVEN
    const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
      [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2019 }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 }),
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const tauxDeCaf = indicateurs[indiceDeLIndicateur];
    const tableau = within(tauxDeCaf).getByRole("table");
    const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
    const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: enTêteDuTableau });
    expect(annéeLigneDEnTête).toBeInTheDocument();
    expect(indicateurLigneDEnTête).toBeInTheDocument();

    const annéesEtValeurs = [
      {
        année: "2019",
        valeur: valeur,
      },
      {
        année: "2020",
        valeur: valeur,
      },
    ];
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    annéesEtValeurs.forEach((annéeEtValeur, index) => {
      const année = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.année });
      expect(année).toBeInTheDocument();
      const valeur = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.valeur });
      expect(valeur).toBeInTheDocument();
    });
  });

  it.each([
    [wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDEtpRéalisés, "9,71"],
    [wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDeCddDeRemplacement, "4"],
    [wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, indiceDeLIndicateur.tauxDePrestationsExternes, "23,2 %"],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants, "16,4 %"],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel, "34,4 %"],
  ])("affiche un tableau descriptif de l’indicateur %s avec une seule année", (enTêteDuTableau, indiceDeLIndicateur, valeur) => {
    // GIVEN
    const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
      [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 })],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const tauxDeCaf = indicateurs[indiceDeLIndicateur];
    const tableau = within(tauxDeCaf).getByRole("table");
    const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
    const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: enTêteDuTableau });
    expect(annéeLigneDEnTête).toBeInTheDocument();
    expect(indicateurLigneDEnTête).toBeInTheDocument();

    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    const annéeDeLaPremièreLigne = within(lignes[0]).getByRole("cell", { name: "2020" });
    expect(annéeDeLaPremièreLigne).toBeInTheDocument();
    const valeurDeLaPremièreLigne = within(lignes[0]).getByRole("cell", { name: valeur });
    expect(valeurDeLaPremièreLigne).toBeInTheDocument();
  });

  it.each([
    [wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDEtpRéalisés],
    [wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDeCddDeRemplacement],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel],
    [wording.TAUX_D_ABSENTÉISME, indiceDeLIndicateur.tauxDAbsentéisme],
  ])("affiche une mise en exergue sur l’indicateur %s si un année est manquante", (_titreDeLIndicateur, indiceDeLIndicateur) => {
    // GIVEN
    const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
      [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: annéeEnCours - 3 }), // 2019
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: annéeEnCours - 2 }), // 2020
      ],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 1}`, { selector: "p" });
    expect(exergue).toBeInTheDocument();
  });

  it.each([
    [wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDEtpRéalisés],
    [wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDeCddDeRemplacement],
    [wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, indiceDeLIndicateur.tauxDePrestationsExternes],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel],
    [wording.TAUX_D_ABSENTÉISME, indiceDeLIndicateur.tauxDAbsentéisme],
  ])("affiche une mise en exergue sur l’indicateur %s si deux années sont manquantes", (_titreDeLIndicateur, indiceDeLIndicateur) => {
    // GIVEN
    const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
      [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeRessourcesHumaines({ année: 2020 })],
      wording
    );

    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 2}, ${annéeEnCours - 1}`, { selector: "p" });
    expect(exergue).toBeInTheDocument();
  });

  it.each([
    [wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDEtpRéalisés, "nombreDEtpRéalisés"],
    [wording.NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION, indiceDeLIndicateur.nombreDeCddDeRemplacement, "nombreDeCddDeRemplacement"],
    [wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES, indiceDeLIndicateur.tauxDePrestationsExternes, "tauxDePrestationsExternes"],
    [wording.TAUX_D_ETP_VACANTS_AU_31_12, indiceDeLIndicateur.tauxDEtpVacants, "tauxDEtpVacants"],
    [wording.TAUX_DE_ROTATION_DU_PERSONNEL, indiceDeLIndicateur.tauxDeRotationDuPersonnel, "tauxDeRotationDuPersonnel"],
  ])("affiche une mise en exergue sur l’indicateur %s si trois années sont manquantes", (_titreDeLIndicateur, indiceDeLIndicateur, cléDeLaDonnée) => {
    // GIVEN
    const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
      ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.ressourcesHumaines.map((blocRessourcesHumaines) => ({
        ...blocRessourcesHumaines,
        [cléDeLaDonnée]: { dateMiseÀJourSource: "2022-06-06", valeur: null },
      })),
      wording
    );

    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    const indicateurs = within(ressourcesHumaines).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 3}, ${annéeEnCours - 2}, ${annéeEnCours - 1}`, {
      selector: "p",
    });
    expect(exergue).toBeInTheDocument();
  });

  it("affiche une phrase à la place des indicateurs lorsqu’aucune donnée n’est renseignée", () => {
    // GIVEN
    const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel([], wording);

    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    expect(within(ressourcesHumaines).getByText(wording.INDICATEURS_VIDES)).toBeInTheDocument();
  });
});
