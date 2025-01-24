import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../commun/contexts/useDependencies";
import { TuileEtablissementViewModel } from "../commun/TuileEtablissement/TuileEtablissementViewModel";

type RechercheState = Readonly<{
  estCeEnAttente: boolean;
  estCeQueLeBackendNeRépondPas: boolean;
  estCeQueLesRésultatsSontReçus: boolean;
  nombreRésultats: number;
  page: number;
  résultats: TuileEtablissementViewModel[];
  terme: string;
  termeFixe: string;
}>;

export function useRecherche() {
  const { paths } = useDependencies();
  const router = useRouter();
  const pageInitiale = 1;

  const [state, setState] = useState<RechercheState>({
    estCeEnAttente: false,
    estCeQueLeBackendNeRépondPas: false,
    estCeQueLesRésultatsSontReçus: false,
    nombreRésultats: 0,
    page: pageInitiale,
    résultats: [],
    terme: "",
    termeFixe: "",
  });

  const lancerLaRecherche = (event: MouseEvent) => {
    event.preventDefault();
    setState({
      ...state,
      estCeEnAttente: true,
      estCeQueLesRésultatsSontReçus: false,
    });
    rechercher(state.terme, pageInitiale);
    localStorage.setItem('searchItem', state.terme);
  };

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      terme: event.target.value,
    });
  };

  const rechercher = (terme: string, page: number) => {
    fetch("/api/recherche", {
      body: JSON.stringify({ page, terme }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          estCeEnAttente: false,
          estCeQueLesRésultatsSontReçus: true,
          nombreRésultats: data.nombreDeRésultats,
          page,
          résultats: page === pageInitiale ? construisLesRésultatsDeLaRecherche(data) : state.résultats.concat(construisLesRésultatsDeLaRecherche(data)),
          terme,
          termeFixe: terme,
        });
      })
      .catch(() => {
        setState({
          ...state,
          estCeEnAttente: false,
          estCeQueLeBackendNeRépondPas: true,
        });
      });
  };

  useEffect(() => {
    if (router.query["terme"]) {
      setState({
        ...state,
        estCeEnAttente: true,
        estCeQueLesRésultatsSontReçus: false,
        terme: router.query["terme"] as string,
      });
      rechercher(router.query["terme"] as string, pageInitiale);
    }
  }, []);

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
    rechercher(state.terme, pageSuivante());
  };

  const construisLesRésultatsDeLaRecherche = (data: RésultatDeRecherche): TuileEtablissementViewModel[] => {
    return data.résultats.map((résultat: Résultat) => new TuileEtablissementViewModel(résultat, paths));
  };

  return {
    chargeLesRésultatsSuivants,
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLeBackendNeRépondPas: state.estCeQueLeBackendNeRépondPas,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
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
