import { fireEvent, screen, within } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";

import { RésultatDeRechercheTestBuilder } from "../../../../backend/test-builder/RésultatDeRechercheTestBuilder";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../test-helpers/testHelper";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { PageÉtablissementTerritorialMédicoSocial } from "../PageÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../ÉtablissementTerritorialMédicoSocialViewModel";

const { paths, wording } = fakeFrontDependencies;
const mockSession = {
  name: "john",
  email: "test@test.fr",
  user: {
    idUser: '1',
    firstname: 'Doe',
    role: 1,
    institution: {},
    institutionId: 1,
    codeRegion: 84,
    codeProfiles: [""]
  },
  expires: "1235"
}

const autorisationsMockData = {
  budgetEtFinance: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    résultatNetComptable: "ok",
    ratioDépendanceFinancière: "ok",
    allocationDeRessources: "ok",
  },
  budgetEtFinances: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    fondsDeRoulement: "ok",
    résultatNetComptable: "ok",
    tauxDeVétustéConstruction: "ok",
    contributionAuxFraisDeSiège: "ok",
  },
};

const result = RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité({ numéroFiness: "000000000" });
const rechercheViewModel = new RechercheViewModel(result, paths);

describe("La page établissement territorial médico-social - bloc activité", () => {
  const établissementTerritorialMédicoSocial = ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.crée(wording, paths);

  it.each([
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0, "CNSA", wording.CNSA_TITLE],
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, "CNSA", wording.CNSA_TITLE],
    [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2, "CNSA", wording.CNSA_TITLE],
    [wording.TAUX_RÉALISATION_ACTIVITÉ, 3, "TdB Perf", wording.TDB_PERF_TITLE],
    [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4, "TdB Perf", wording.TDB_PERF_TITLE],
    [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5, "TdB Perf", wording.TDB_PERF_TITLE],
    [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6, "TdB Perf", wording.TDB_PERF_TITLE],
  ])("affiche les informations l’indicateur %s", (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
    // WHEN
    renderFakeComponent(<SessionProvider session={mockSession}><PageÉtablissementTerritorialMédicoSocial rechercheViewModel={rechercheViewModel} établissementTerritorialViewModel={établissementTerritorialMédicoSocial} /></SessionProvider>);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    expect(indicateurs).toHaveLength(7);
    const titre = within(indicateurs[identifiant]).getByText(titreSection, { selector: "h3" });
    expect(titre).toBeInTheDocument();
    const dateMiseAJour = within(indicateurs[identifiant]).getAllByText(textMatch(`${wording.miseÀJour("07/07/2021")} - Source : ${sourceOrigineAttendue}`), {
      selector: "p",
    });
    expect(dateMiseAJour[0]).toBeInTheDocument();
    const transcription = within(indicateurs[identifiant]).getByText(wording.AFFICHER_LA_TRANSCRIPTION);
    expect(transcription).toHaveAttribute("aria-expanded", "false");
    expect(transcription).not.toBeDisabled();
    const abréviationSourceOrigine = within(indicateurs[identifiant]).getAllByText(sourceOrigineAttendue, { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", abréviationSourceOrigineAttendue);
    const détails = within(indicateurs[identifiant]).getByRole("button", { name: wording.DÉTAILS });
    expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-activite-${identifiant}`);
    expect(détails).toHaveAttribute("data-fr-opened", "false");
    const exergue = within(indicateurs[identifiant]).queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, { selector: "p" });
    expect(exergue).not.toBeInTheDocument();
  });

  it.each([
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0, "94,4 %", "97,5 %", "101,6 %"],
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, "70,4 %", "121,5 %", "67,6 %"],
    [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2, "0,4 %", "15,5 %", "20,6 %"],
    [wording.TAUX_RÉALISATION_ACTIVITÉ, 3, "100,4 %", "94,5 %", "96,6 %"],
    [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4, "340", "280", "300"],
    [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5, "87", "90", "22"],
    [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6, (1013).toLocaleString("fr"), "994", "990"],
  ])("affiche un tableau descriptif avec les trois années (%s)", (titreSection, identifiant, valeurIndicateur1, valeurIndicateur2, valeurIndicateur3) => {
    // WHEN
    renderFakeComponent(<SessionProvider session={mockSession}><PageÉtablissementTerritorialMédicoSocial rechercheViewModel={rechercheViewModel} établissementTerritorialViewModel={établissementTerritorialMédicoSocial} /> </SessionProvider>);

    // THEN
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    const tableau = within(indicateurs[identifiant]).getByRole("table");
    const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
    const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: titreSection });
    expect(annéeLigneDEnTête).toBeInTheDocument();
    expect(indicateurLigneDEnTête).toBeInTheDocument();

    const annéesEtValeurs = [
      {
        année: "2020",
        valeurIndicateur: valeurIndicateur1,
      },
      {
        année: "2021",
        valeurIndicateur: valeurIndicateur2,
      },
      {
        année: "2022",
        valeurIndicateur: valeurIndicateur3,
      },
    ];
    const tbody = within(tableau).getAllByRole("rowgroup")[1];
    const lignes = within(tbody).getAllByRole("row");
    annéesEtValeurs.forEach((annéeEtValeur, index) => {
      const annéeDeLaPremièreLigne = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.année });
      expect(annéeDeLaPremièreLigne).toBeInTheDocument();
      const valeurDeLaPremièreLigne = within(lignes[index]).getByRole("cell", { name: annéeEtValeur.valeurIndicateur });
      expect(valeurDeLaPremièreLigne).toBeInTheDocument();
    });
  });

  it.each([
    [0, null, 0.97, 1.016],
    [1, 0.7, null, 0.67],
    [2, 0.04, 0.155, null],
    [3, null, 0.94, 0.96],
    [4, 340, null, 300],
    [5, 87, 90, null],
    [6, null, 994, 990],
  ])(
    'affiche un tableau descriptif avec deux années après un clic sur "Afficher la transcription"',
    (identifiant, valeurIndicateur1, valeurIndicateur2, valeurIndicateur3) => {
      const établissementTerritorialMédicoSocial = new ÉtablissementTerritorialMédicoSocialViewModel(
        {
          activités: [
            {
              année: 2020,
              duréeMoyenneSéjourAccompagnementPersonnesSorties: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              fileActivePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              nombreMoyenJournéesAbsencePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
              tauxOccupationAccueilDeJour: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              tauxOccupationHébergementPermanent: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              tauxOccupationHébergementTemporaire: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              tauxRéalisationActivité: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
            },
            {
              année: 2021,
              duréeMoyenneSéjourAccompagnementPersonnesSorties: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              fileActivePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              nombreMoyenJournéesAbsencePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
              tauxOccupationAccueilDeJour: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              tauxOccupationHébergementPermanent: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              tauxOccupationHébergementTemporaire: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              tauxRéalisationActivité: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
            },
            {
              année: 2022,
              duréeMoyenneSéjourAccompagnementPersonnesSorties: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              fileActivePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              nombreMoyenJournéesAbsencePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
              tauxOccupationAccueilDeJour: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              tauxOccupationHébergementPermanent: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              tauxOccupationHébergementTemporaire: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              tauxRéalisationActivité: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
            },
          ],
          autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
          budgetEtFinances: [],
          identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
          ressourcesHumaines: [],
          qualite: { reclamations: [], evenementsIndesirables: [], inspectionsEtControles: { dateMiseAJourSource: '202-02-02', inspectionsEtControles: [] } },
          autorisations: autorisationsMockData,
        },
        wording,
        paths,
        autorisationsMockData
      );
      renderFakeComponent(<SessionProvider session={mockSession}><PageÉtablissementTerritorialMédicoSocial rechercheViewModel={rechercheViewModel} établissementTerritorialViewModel={établissementTerritorialMédicoSocial} /></SessionProvider>);
      const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
      const indicateurs = within(activité).getAllByRole("listitem");
      const transcription = within(indicateurs[identifiant]).getByRole("button", { name: wording.AFFICHER_LA_TRANSCRIPTION });

      // WHEN
      fireEvent.click(transcription);

      // THEN
      const tableau = within(indicateurs[identifiant]).getByRole("table");
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(2);
    }
  );

  it.each([
    [0, null, null, 1.016],
    [1, 0.7, null, null],
    [2, null, 0.155, null],
    [3, null, null, 0.96],
    [4, 340, null, null],
    [5, null, 90, null],
    [6, null, null, 990],
  ])(
    'affiche un tableau descriptif avec une seule année après un clic sur "Afficher la transcription"',
    (identifiant, valeurIndicateur1, valeurIndicateur2, valeurIndicateur3) => {
      const établissementTerritorialMédicoSocial = new ÉtablissementTerritorialMédicoSocialViewModel(
        {
          activités: [
            {
              année: 2020,
              duréeMoyenneSéjourAccompagnementPersonnesSorties: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              fileActivePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              nombreMoyenJournéesAbsencePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
              tauxOccupationAccueilDeJour: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              tauxOccupationHébergementPermanent: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              tauxOccupationHébergementTemporaire: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
              tauxRéalisationActivité: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur1,
              },
            },
            {
              année: 2021,
              duréeMoyenneSéjourAccompagnementPersonnesSorties: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              fileActivePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              nombreMoyenJournéesAbsencePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
              tauxOccupationAccueilDeJour: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              tauxOccupationHébergementPermanent: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              tauxOccupationHébergementTemporaire: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
              tauxRéalisationActivité: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur2,
              },
            },
            {
              année: 2022,
              duréeMoyenneSéjourAccompagnementPersonnesSorties: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              fileActivePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              nombreMoyenJournéesAbsencePersonnesAccompagnées: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              numéroFinessÉtablissementTerritorial: "010000040",
              tauxOccupationAccueilDeJour: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              tauxOccupationHébergementPermanent: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              tauxOccupationHébergementTemporaire: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
              tauxRéalisationActivité: {
                dateMiseÀJourSource: "2021-07-07",
                value: valeurIndicateur3,
              },
            },
          ],
          autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
          budgetEtFinances: [],
          identité: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
          ressourcesHumaines: [],
          qualite: { reclamations: [], evenementsIndesirables: [], inspectionsEtControles: { dateMiseAJourSource: '202-02-02', inspectionsEtControles: [] } },
          autorisations: autorisationsMockData,
        },
        wording,
        paths,
        autorisationsMockData
      );
      renderFakeComponent(<SessionProvider session={mockSession}><PageÉtablissementTerritorialMédicoSocial rechercheViewModel={rechercheViewModel} établissementTerritorialViewModel={établissementTerritorialMédicoSocial} /></SessionProvider>);
      const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
      const indicateurs = within(activité).getAllByRole("listitem");
      const transcription = within(indicateurs[identifiant]).getByRole("button", { name: wording.AFFICHER_LA_TRANSCRIPTION });

      // WHEN
      fireEvent.click(transcription);

      // THEN
      const tableau = within(indicateurs[identifiant]).getByRole("table");
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(1);
    }
  );

  it.each([
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0, "CNSA", wording.CNSA_TITLE],
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1, "CNSA", wording.CNSA_TITLE],
    [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2, "CNSA", wording.CNSA_TITLE],
    [wording.TAUX_RÉALISATION_ACTIVITÉ, 3, "TdB Perf", wording.TDB_PERF_TITLE],
    [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4, "TdB Perf", wording.TDB_PERF_TITLE],
    [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5, "TdB Perf", wording.TDB_PERF_TITLE],
    [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6, "TdB Perf", wording.TDB_PERF_TITLE],
  ])(
    'affiche le contenu de l’info bulle après avoir cliqué sur le bouton "détails" (%s)',
    (titreSection, identifiant, sourceOrigineAttendue, abréviationSourceOrigineAttendue) => {
      // GIVEN
      renderFakeComponent(<SessionProvider session={mockSession}><PageÉtablissementTerritorialMédicoSocial rechercheViewModel={rechercheViewModel} établissementTerritorialViewModel={établissementTerritorialMédicoSocial} /> </SessionProvider>);
      const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
      const indicateurs = within(activité).getAllByRole("listitem");
      const détails = within(indicateurs[identifiant]).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: titreSection });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText(sourceOrigineAttendue, { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", abréviationSourceOrigineAttendue);
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
    }
  );

  it.each([
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT, 0],
    [wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE, 1],
    [wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR, 2],
    [wording.TAUX_RÉALISATION_ACTIVITÉ, 3],
    [wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES, 4],
    [wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES, 5],
    [wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES, 6],
  ])('ferme l’info bulle après avoir cliqué sur le bouton "Fermer" (%s)', (titreSection, identifiant) => {
    // GIVEN
    renderFakeComponent(<SessionProvider session={mockSession}><PageÉtablissementTerritorialMédicoSocial rechercheViewModel={rechercheViewModel} établissementTerritorialViewModel={établissementTerritorialMédicoSocial} /> </SessionProvider>);
    const activité = screen.getByRole("region", { name: wording.TITRE_BLOC_ACTIVITÉ });
    const indicateurs = within(activité).getAllByRole("listitem");
    const détails = within(indicateurs[identifiant]).getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);
    const infoBulle = screen.getByRole("dialog", { name: titreSection });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

    // WHEN
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });
});