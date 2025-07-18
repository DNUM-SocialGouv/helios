import { fireEvent, screen, within } from "@testing-library/react";

import BlocQualite from "./BlocQualite";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./ÉtablissementTerritorialQualiteMédicoSocialViewModel";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { textMatch, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;

describe("La page établissement territorial - bloc qualité", () => {
    const qualiteViewModel = new ÉtablissementTerritorialQualiteMédicoSocialViewModel(
        wording,
        {
            reclamations: [], evenementsIndesirables: [{
                libelle: 'Evènements indésirables/graves associés aux soins',
                evenementsEncours: [],
                evenementsClotures: [],
                dateMiseAJourSource: '2024-03-15'
            }, {
                libelle: 'Evénements/incidents dans un établissement ou organisme',
                evenementsEncours: [],
                evenementsClotures: [],
                dateMiseAJourSource: '2024-03-15'
            }],
            inspectionsEtControles: { dateMiseAJourSource: '202-02-02', inspectionsEtControles: [] }
        },
    );

    const qualiteEIViewModel = new ÉtablissementTerritorialQualiteMédicoSocialViewModel(
        wording,
        { reclamations: [], evenementsIndesirables: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.qualite.evenementsIndesirables, inspectionsEtControles: { dateMiseAJourSource: '202-02-02', inspectionsEtControles: [] } },
    );

    const qualiteRecViewModel = new ÉtablissementTerritorialQualiteMédicoSocialViewModel(
        wording,
        { reclamations: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.qualite.reclamations, evenementsIndesirables: [], inspectionsEtControles: { dateMiseAJourSource: '202-02-02', inspectionsEtControles: [] } },
    );

    it("affiche aucune donnée pour cet établissement", () => {
        renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteViewModel} />);
        const qualite = screen.getByRole("region", { name: wording.TITRE_BLOC_QUALITE });
        const message = within(qualite).getByText(wording.INDICATEURS_VIDES);
        expect(message).toBeInTheDocument();
    })

    describe("L’indicateur réclamations", () => {
        it("affiche l’intitulé de l’indicateur, avec sa date de mise à jour, ses sources et un bouton pour accéder aux détails", () => {
            // WHEN
            renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteRecViewModel} />);

            // THEN
            const qualite = screen.getByRole("region", { name: wording.TITRE_BLOC_QUALITE });
            const indicateurs = within(qualite).getAllByRole("listitem");
            const indicateur = indicateurs[2];
            const titre = within(indicateur).getByText(wording.RECLAMATIONS, { selector: "h3" });
            expect(titre).toBeInTheDocument();
            const abréviationSourceOrigine = within(indicateur).getAllByText("SIREC", { selector: "abbr" });
            expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.SIREC_TITLE);
            const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("15/03/2024")} - Source : SIREC`), { selector: "p" });
            expect(dateMiseAJour).toHaveLength(2);
            const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
            expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-${wording.RECLAMATIONS}`);
            expect(détails).toHaveAttribute("data-fr-opened", "false");
        })

        it('affiche le contenu de l’info bulle %s après avoir cliqué sur le bouton "détails"', () => {
            // GIVEN
            renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteRecViewModel} />);
            const evenementsIndesirables = screen.getAllByRole("listitem")[2];
            const détails = within(evenementsIndesirables).getByRole("button", { name: wording.DÉTAILS });

            // WHEN
            fireEvent.click(détails);

            // THEN
            expect(détails).toHaveAttribute("data-fr-opened", "true");
            const infoBulle = screen.getByRole("dialog", { name: wording.RECLAMATIONS });
            const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
            expect(fermer).toBeInTheDocument();
            const abréviationSourceOrigine = within(infoBulle).getAllByText("SIREC", { selector: "abbr" });
            expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.SIREC_TITLE);
            const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
            expect(fréquence).toBeInTheDocument();
            const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
            expect(sources).toBeInTheDocument();
        });

        it('ferme l’info bulle %s après avoir cliqué sur le bouton "Fermer"', () => {
            // GIVEN
            renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteRecViewModel} />);
            const evenementsIndesirables = screen.getAllByRole("listitem")[2];
            const détails = within(evenementsIndesirables).getByRole("button", { name: wording.DÉTAILS });
            fireEvent.click(détails);
            const infoBulle = screen.getByRole("dialog", { name: wording.RECLAMATIONS });
            const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

            // WHEN
            fireEvent.click(fermer);

            // THEN
            expect(détails).toHaveAttribute("data-fr-opened", "false");
        });
    });

    describe("L’indicateur évènements indésirables", () => {
        it("affiche l’intitulé de l’indicateur, avec sa date de mise à jour, ses sources et un bouton pour accéder aux détails", () => {
            // WHEN
            renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteEIViewModel} />);

            // THEN
            const qualite = screen.getByRole("region", { name: wording.TITRE_BLOC_QUALITE });
            const indicateurs = within(qualite).getAllByRole("listitem");
            const indicateur = indicateurs[2];
            const titre = within(indicateur).getByText(wording.EVENEMENTS_INDESIRABLES, { selector: "h3" });
            expect(titre).toBeInTheDocument();
            const abréviationSourceOrigine = within(indicateur).getAllByText("SIVSS", { selector: "abbr" });
            expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.SIVSS_TITLE);
            const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("15/03/2024")} - Source : SIVSS`), { selector: "p" });
            expect(dateMiseAJour).toHaveLength(2);
            const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
            expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-qualite-evenements-indesirables`);
            expect(détails).toHaveAttribute("data-fr-opened", "false");
        })

        it('affiche le contenu de l’info bulle %s après avoir cliqué sur le bouton "détails"', () => {
            // GIVEN
            renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteEIViewModel} />);
            const evenementsIndesirables = screen.getAllByRole("listitem")[2];
            const détails = within(evenementsIndesirables).getByRole("button", { name: wording.DÉTAILS });

            // WHEN
            fireEvent.click(détails);

            // THEN
            expect(détails).toHaveAttribute("data-fr-opened", "true");
            const infoBulle = screen.getByRole("dialog", { name: wording.EVENEMENTS_INDESIRABLES });
            const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
            expect(fermer).toBeInTheDocument();
            const abréviationSourceOrigine = within(infoBulle).getAllByText("SIVSS", { selector: "abbr" });
            expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.SIVSS_TITLE);
            const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
            expect(fréquence).toBeInTheDocument();
            const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
            expect(sources).toBeInTheDocument();
        });

        it('ferme l’info bulle %s après avoir cliqué sur le bouton "Fermer"', () => {
            // GIVEN
            renderFakeComponent(<BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={qualiteEIViewModel} />);
            const evenementsIndesirables = screen.getAllByRole("listitem")[2];
            const détails = within(evenementsIndesirables).getByRole("button", { name: wording.DÉTAILS });
            fireEvent.click(détails);
            const infoBulle = screen.getByRole("dialog", { name: wording.EVENEMENTS_INDESIRABLES });
            const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

            // WHEN
            fireEvent.click(fermer);

            // THEN
            expect(détails).toHaveAttribute("data-fr-opened", "false");
        });
    });
});

