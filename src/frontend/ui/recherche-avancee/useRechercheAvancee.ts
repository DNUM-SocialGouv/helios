import { ChangeEvent, MouseEvent, useContext, useState } from "react";

import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { RechercheViewModel } from "../home/RechercheViewModel";

type RechercheAvanceeState = Readonly<{
    estCeEnAttente: boolean;
    estCeQueLeBackendNeRépondPas: boolean;
    estCeQueLesRésultatsSontReçus: boolean;
    estCeQueLaRechercheEstLancee: boolean
    nombreRésultats: number;
    page: number;
    résultats: RechercheViewModel[];
    terme: string;
    termeFixe: string;
}>;

export function useRechercheAvancee() {
    const { paths } = useDependencies();
    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
    const pageInitiale = 1;
    const [state, setState] = useState<RechercheAvanceeState>({
        estCeEnAttente: false,
        estCeQueLeBackendNeRépondPas: false,
        estCeQueLesRésultatsSontReçus: false,
        estCeQueLaRechercheEstLancee: false,
        nombreRésultats: 0,
        page: pageInitiale,
        résultats: [],
        terme: "",
        termeFixe: "",
    });

    const lancerLaRecherche = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        setState({
            ...state,
            estCeEnAttente: true,
            estCeQueLesRésultatsSontReçus: false,
        });
        rechercher(state.terme, rechercheAvanceeContext?.zoneGeo, rechercheAvanceeContext?.typeStructure,
            rechercheAvanceeContext?.statutJuridiqueStructure, pageInitiale);
    };

    const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            terme: event.target.value,
        });
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
                    page,
                    résultats: page === pageInitiale ? construisLesRésultatsDeLaRecherche(data) : state.résultats.concat(construisLesRésultatsDeLaRecherche(data)),
                    terme,
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

    const estCeQueLesRésultatsSontTousAffichés = () => {
        return state.nombreRésultats === state.résultats.length;
    };

    const pageSuivante = () => {
        return state.page + 1;
    };

    const chargeLesRésultatsSuivants = () => {
        setState({
            ...state,
            estCeEnAttente: true,
        });
        rechercher(state.terme, rechercheAvanceeContext?.zoneGeo, rechercheAvanceeContext?.typeStructure,
            rechercheAvanceeContext?.statutJuridiqueStructure, pageSuivante());
    };

    const construisLesRésultatsDeLaRecherche = (data: RésultatDeRecherche): RechercheViewModel[] => {
        return data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths));
    };

    return {
        chargeLesRésultatsSuivants,
        estCeEnAttente: state.estCeEnAttente,
        estCeQueLeBackendNeRépondPas: state.estCeQueLeBackendNeRépondPas,
        estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
        estCeQueLaRechercheEstLancee: state.estCeQueLaRechercheEstLancee,
        estCeQueLesRésultatsSontTousAffichés,
        lancerLaRecherche,
        nombreRésultats: state.nombreRésultats,
        rechercheOnChange,
        résultats: state.résultats,
        terme: state.terme,
        termeFixe: state.termeFixe,
        rechercher,
    };
}
