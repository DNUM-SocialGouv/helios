import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { ApiComparaisonResultat, ComparaisonViewModel } from "../home/ComparaisonViewModel";

type comparaisonState = Readonly<{
  nombreRésultats: number;
  lastPage: number;
  résultats: ComparaisonViewModel[];
}>;

export function useComparaison() {
  const { paths } = useDependencies();
  // const take = 20;
  const [state, setState] = useState<comparaisonState>({
    nombreRésultats: 0,
    lastPage: 1,
    résultats: [],
  });

  const pageInitiale = 1;
  // const lastPage = data.nombreDeRésultats > 0 ? Math.ceil(data.nombreDeRésultats / take) : 1;

  const lancerLaComparaison = (): void => {
    const listFiness = sessionStorage.getItem("listFinessNumbers");
    const typeStored = sessionStorage.getItem("comparaisonType");

    let parsedFiness = null;
    try {
      parsedFiness = listFiness ? JSON.parse(listFiness) : null;
    } catch (e) {
      alert("Error :" + e);
    }

    const type = typeStored || undefined;
    comparer(type, parsedFiness, pageInitiale);
  };

  function construisLeLien(type: string): string {
    if (type === "Médico-social") {
      return paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + "/";
    } else if (type === "Sanitaire") {
      return paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/";
    }
    return paths.ENTITÉ_JURIDIQUE + "/";
  }

  const construisLesRésultatsDeLaComparaison = (data: ApiComparaisonResultat): ComparaisonViewModel[] => {
    return data.resultat.map((resultat) => new ComparaisonViewModel(resultat));
  };

  const comparer = async (type: string = "", numerosFiness: string[] = [], page: number = 1) => {
    // rechercheAvanceeContext?.setPage(page, true);
    fetch("/api/comparaison", {
      body: JSON.stringify({ type, numerosFiness, page }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          // nombreRésultats: data.nombreDeRésultats,
          // lastPage: Math.ceil(data.nombreDeRésultats / take),
          résultats: construisLesRésultatsDeLaComparaison(data),
        });
      })
      .catch(() => {});
  };

  console.log("matttt", state);

  return {
    lancerLaComparaison,
    construisLeLien,
    resultats: state.résultats,
  };
}
