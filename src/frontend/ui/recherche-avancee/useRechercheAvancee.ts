import { parseAsInteger, parseAsString, useQueryState } from "next-usequerystate";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";

import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { ExtendedRésultatDeRecherche } from "../../../pages/recherche-avancee";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { RechercheViewModel } from "../home/RechercheViewModel";

type RechercheAvanceeState = Readonly<{
    estCeEnAttente: boolean;
    estCeQueLeBackendNeRépondPas: boolean;
    estCeQueLesRésultatsSontReçus: boolean;
    estCeQueLaRechercheEstLancee: boolean
    nombreRésultats: number;
    lastPage: number
    résultats: RechercheViewModel[];
    termeFixe: string;
}>;

export function useRechercheAvancee(data: ExtendedRésultatDeRecherche) {
    const { paths } = useDependencies();
    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
    const pageInitiale = 1;
    const lastPage = data.nombreDeRésultats > 0 ? Math.ceil(data.nombreDeRésultats / 20) : 1;
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(data.page));
    const [terme, setTerme] = useQueryState<string>("terme", parseAsString.withDefault(""));

    const construisLesRésultatsDeLaRecherche = (data: RésultatDeRecherche): RechercheViewModel[] => {
        return data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths));
    };

    const [state, setState] = useState<RechercheAvanceeState>({
        estCeEnAttente: false,
        estCeQueLeBackendNeRépondPas: false,
        estCeQueLesRésultatsSontReçus: false,
        estCeQueLaRechercheEstLancee: false,
        nombreRésultats: data.nombreDeRésultats || 0,
        lastPage,
        résultats: construisLesRésultatsDeLaRecherche(data),
        termeFixe: "",
    });

    const lancerLaRecherche = (event: MouseEvent<HTMLButtonElement>): void => {
        if (terme !== "") {
        event.preventDefault();
        setState({
            ...state,
            estCeEnAttente: true,
            estCeQueLesRésultatsSontReçus: false,
        });
        rechercher(terme, rechercheAvanceeContext?.zoneGeo, rechercheAvanceeContext?.typeStructure,
            rechercheAvanceeContext?.statutJuridiqueStructure, pageInitiale);
        }

    };

    const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTerme(event.target.value, { shallow: false })
    };

    const rechercher = (terme: string, commune: string = "", type : string = "", statutJuridique : string[] = [], page: number) => {
        fetch("/api/recherche-avancee", {
            body: JSON.stringify({ page, terme, commune, type, statutJuridique }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                setState({
                    ...state,
                    estCeEnAttente: false,
                    estCeQueLesRésultatsSontReçus: true,
                    estCeQueLaRechercheEstLancee: true,
                    nombreRésultats: data.nombreDeRésultats,
                    lastPage: Math.ceil(data.nombreDeRésultats / 20),
                    résultats: construisLesRésultatsDeLaRecherche(data),
                });
            })
            .catch(() => {
                setState({
                    ...state,
                    estCeEnAttente: false,
                    estCeQueLeBackendNeRépondPas: true,
                    // estCeQueLaRechercheEstLancee: true,
                });
            });
    };

    const setPageWithSearch = (page: number) => {
        setState({
            ...state,
            estCeEnAttente: false,
            estCeQueLesRésultatsSontReçus: true,
            estCeQueLaRechercheEstLancee: true,
        })
     
        setPage(page, { shallow: false })
        rechercher(terme, rechercheAvanceeContext?.zoneGeo, rechercheAvanceeContext?.typeStructure,
            rechercheAvanceeContext?.statutJuridiqueStructure, page);
    };


    return {
        estCeEnAttente: state.estCeEnAttente,
        estCeQueLeBackendNeRépondPas: state.estCeQueLeBackendNeRépondPas,
        estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
        estCeQueLaRechercheEstLancee: state.estCeQueLaRechercheEstLancee,
        lancerLaRecherche,
        nombreRésultats: state.nombreRésultats,
        rechercheOnChange,
        résultats: state.résultats,
        pageInitiale,
        lastPage: state.lastPage,
        terme,
        termeFixe: state.termeFixe,
        rechercher,
        setPage: setPageWithSearch,
        page
    };
}
