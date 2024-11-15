import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { ApiComparaisonResultat, ComparaisonMoyenneViewModel, ComparaisonViewModel, MoyenneResultatComparaison } from "../home/ComparaisonViewModel";

type comparaisonState = Readonly<{
  nombreRésultats: number;
  lastPage: number;
  résultats: ComparaisonViewModel[];
  moyenne: MoyenneResultatComparaison[];
}>;

export function useComparaison() {
  const { paths } = useDependencies();
  const take = 20;
  const [state, setState] = useState<comparaisonState>({
    nombreRésultats: 0,
    lastPage: 1,
    résultats: [],
    moyenne: [],
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

  const construisLesRésultatsDeLaComparaison = (data: ApiComparaisonResultat): ComparaisonViewModel[] => {
    return data.resultat.map((resultat) => new ComparaisonViewModel(resultat));
  };

  const construisLaMoyenneDesResultat = (data: ApiComparaisonResultat): MoyenneResultatComparaison[] => {
    return data.moyennes.map((resultat) => new ComparaisonMoyenneViewModel(resultat));
  };

  const comparer = async (type: string = "", numerosFiness: string[] = [], page: number = 1, order = "", orderBy = "") => {
    // rechercheAvanceeContext?.setPage(page, true);
    fetch("/api/comparaison", {
      body: JSON.stringify({ type, numerosFiness, page, order, orderBy }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          lastPage: Math.ceil(data.resultat.length / take),
          résultats: construisLesRésultatsDeLaComparaison(data),
          moyenne: construisLaMoyenneDesResultat(data),
        });
      })
      .catch(() => {});
  };

  return {
    lancerLaComparaison,
    resultats: state.résultats,
    moyenne: state.moyenne,
    lastPage: state.lastPage,
  };
}
