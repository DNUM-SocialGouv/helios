import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import { RechercheViewModel } from "./RechercheViewModel";
import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../commun/contexts/useDependencies";
import { useFavoris } from "../favoris/useFavoris";

type RechercheState = Readonly<{
  estCeEnAttente: boolean;
  estCeQueLeBackendNeRépondPas: boolean;
  estCeQueLesRésultatsSontReçus: boolean;
  nombreRésultats: number;
  page: number;
  résultats: RechercheViewModel[];
  terme: string;
  termeFixe: string;
}>;

export enum Order {
  ASC = "ASC",
  DESC = "DESC"
}

export enum OrderBy {
  TYPE = "type",
  RAISON_SOCIALE = "raison_sociale_courte",
  COMMUNE = "commune",
  DEPARTEMENT = "departement",
  NUMERO_FINESS = "numero_finess",
  RATTACHEMENT = "rattachement",
}

const defaultOrder = Order.DESC.valueOf();
const defaultOrderBy = OrderBy.RAISON_SOCIALE.valueOf();

export function useRecherche() {
  const { paths } = useDependencies();
  const { getFavorisLists } = useFavoris();
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

  const lancerLaRecherche = (event: MouseEvent | ChangeEvent<HTMLInputElement>, displayTable: boolean) => {
    getFavorisLists();
    if (event) event.preventDefault();
    setState({
      ...state,
      estCeEnAttente: true,
      estCeQueLesRésultatsSontReçus: false,
    });
    localStorage.setItem('searchItem', state.terme);
    localStorage.setItem('displayTable', displayTable ? 'true' : 'false');
    if (!displayTable) {
      rechercher(state.terme, pageInitiale);
    } else {
      rechercher(state.terme, pageInitiale, defaultOrder, defaultOrderBy, true)
    }
  };

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      terme: event.target.value,
    });
  };

  const rechercher = (terme: string, page: number, order?: string, orderBy?: string, displayTable?: boolean) => {
    fetch("/api/recherche", {
      body: JSON.stringify({ page, terme, order, orderBy, displayTable }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        const résultatsVignettes = page === pageInitiale ? construisLesRésultatsDeLaRecherche(data) : state.résultats.concat(construisLesRésultatsDeLaRecherche(data))
        const tableOrVignetteRelults = displayTable ? construisLesRésultatsDeLaRecherche(data) : résultatsVignettes;
        setState({
          ...state,
          estCeEnAttente: false,
          estCeQueLesRésultatsSontReçus: true,
          estCeQueLeBackendNeRépondPas: false,
          nombreRésultats: data.nombreDeRésultats,
          page,
          résultats: tableOrVignetteRelults,
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

  const construisLesRésultatsDeLaRecherche = (data: RésultatDeRecherche): RechercheViewModel[] => {
    return data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths));
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
    pageInitiale,
    defaultOrder,
    defaultOrderBy
  };
}
