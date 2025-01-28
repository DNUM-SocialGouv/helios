import { Résultat } from '../../../backend/métier/entities/RésultatDeRecherche';
import { Paths } from '../../configuration/Paths';
import { RechercheViewModel } from '../home/RechercheViewModel';
import { TableauListEtalblissementViewModel } from './TableauListEtablissementViewModel';
import { Order, OrderBy, useTableauListEtablissement } from './useTableauListEtablissement';

describe("La récuperation de la fonction de tri", () => {
    const { getSortFunction, sortByDefault } = useTableauListEtablissement();

    function getResultatViewModel(commune: string, département: string, numéroFiness: string, raisonSocialeCourte: string, type: string, rattachement: string, dateCreation: Date) {
        const resultat: Résultat = { commune, département, numéroFiness, raisonSocialeCourte, type, rattachement };
        const recherche = new RechercheViewModel(resultat, new Paths);
        return new TableauListEtalblissementViewModel(recherche, dateCreation);
    }

    it("recupère la bonne fonction pour la commune en ordre ascendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("a1", "c", "c", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("a2", "b", "b", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a11", "a", "a", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.ASC, OrderBy.COMMUNE);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r1, r2, r3]);
    });

    it("recupère la bonne fonction pour la commune en ordre descendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("a1", "c", "c", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("a2", "b", "b", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a11", "a", "a", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.DESC, OrderBy.COMMUNE);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });

    it("recupère la bonne fonction pour le département en ordre ascendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "a1", "c", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "a2", "b", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a11", "a", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.ASC, OrderBy.DEPARTEMENT);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r1, r2, r3]);
    });

    it("recupère la bonne fonction pour le département en ordre descendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "a1", "c", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "a2", "b", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a11", "a", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.DESC, OrderBy.DEPARTEMENT);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });

    it("recupère la bonne fonction pour le numéro finess en ordre ascendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "a1", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "a2", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a11", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.ASC, OrderBy.NUMERO_FINESS);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r1, r2, r3]);
    });

    it("recupère la bonne fonction pour le numéro finess en ordre descendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "a1", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "a2", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a11", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.DESC, OrderBy.NUMERO_FINESS);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });

    it("recupère la bonne fonction pour la raison sociale en ordre ascendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "a1", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "a2", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a11", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.ASC, OrderBy.RAISON_SOCIALE);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r1, r2, r3]);
    });

    it("recupère la bonne fonction pour la raison sociale en ordre descendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "a1", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "a2", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a11", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.DESC, OrderBy.RAISON_SOCIALE);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });

    it("recupère la bonne fonction pour le type en ordre ascendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "c", "a1", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "b", "a2", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a", "a11", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.ASC, OrderBy.TYPE);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r1, r2, r3]);
    });

    it("recupère la bonne fonction pour le type en ordre descendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "c", "a1", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "b", "a2", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a", "a11", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.DESC, OrderBy.TYPE);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });

    it("recupère la bonne fonction pour le rattachement en ordre ascendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "c", "c", "a1", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "b", "b", "a2", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a", "a", "a11", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.ASC, OrderBy.RATTACHEMENT);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r1, r2, r3]);
    });

    it("recupère la bonne fonction pour le rattachement en ordre descendant", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "c", "c", "a1", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "b", "b", "a2", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a", "a", "a11", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        const sortFunction = getSortFunction(Order.DESC, OrderBy.RATTACHEMENT,);
        resultats.sort(sortFunction);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });

    it("récupére la fonction de tri par date de creation décroissante par defaut", () => {
        // GIVEN
        const r1 = getResultatViewModel("c", "c", "c", "c", "c", "c", new Date(2023, 11));
        const r2 = getResultatViewModel("b", "b", "b", "b", "b", "b", new Date(2024, 11));
        const r3 = getResultatViewModel("a", "a", "a", "a", "a", "a", new Date(2025, 11));
        const resultats = [r2, r3, r1];

        // WHEN
        resultats.sort(sortByDefault);

        // THEN
        expect(resultats).toEqual([r3, r2, r1]);
    });
});
