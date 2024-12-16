import { useState } from "react";

import { ApiComparaisonResultat, ComparaisonViewModel, MoyenneResultatComparaison } from "../home/ComparaisonViewModel";

type comparaisonState = Readonly<{
  nombreRésultats: number;
  lastPage: number;
  résultats: ComparaisonViewModel[];
  moyenne: MoyenneResultatComparaison;
  loading: boolean;
}>;

export function useComparaison() {
  const take = 20;
  const [state, setState] = useState<comparaisonState>({
    nombreRésultats: 0,
    lastPage: 1,
    loading: false,
    résultats: [],
    moyenne: {
      capaciteMoyenne: 0,
      realisationAcitiviteMoyenne: 0,
      acceuilDeJourMoyenne: 0,
      hebergementPermanentMoyenne: 0,
      hebergementTemporaireMoyenne: 0,
      fileActivePersonnesAccompagnesMoyenne: 0,
      rotationPersonnelMoyenne: 0,
      absenteismeMoyenne: 0,
      prestationExterneMoyenne: 0,
      etpVacantMoyenne: 0,
      tauxCafMoyenne: 0,
      vetusteConstructionMoyenne: 0,
      roulementNetGlobalMoyenne: 0,
      resultatNetComptableMoyenne: 0
    },
  });

  const lancerLaComparaison = (page: number, annee: string): void => {
    const listFiness = sessionStorage.getItem("listFinessNumbers");
    const typeStored = sessionStorage.getItem("comparaisonType");

    let parsedFiness = null;
    try {
      parsedFiness = listFiness ? JSON.parse(listFiness) : null;
    } catch (e) {
      alert("Error :" + e);
    }

    const type = typeStored || undefined;
    comparer(type, parsedFiness, annee, page);
  };

  const construisLesRésultatsDeLaComparaison = (data: ApiComparaisonResultat): ComparaisonViewModel[] => {
    return data.resultat.map((resultat) => new ComparaisonViewModel(resultat));
  };

  const comparer = async (type: string = "", numerosFiness: string[] = [], annee: string, page: number = 1, order = "", orderBy = "") => {
    setState({ ...state, loading: true });
    fetch("/api/comparaison/compare", {
      body: JSON.stringify({ type, numerosFiness, annee, page, order, orderBy }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          nombreRésultats: data.nombreDeResultats,
          lastPage: Math.ceil(data.resultat.length / take),
          résultats: construisLesRésultatsDeLaComparaison(data),
          moyenne: data.moyennes,
          loading: false
        });
      })
      .catch(() => {
        setState({ ...state, loading: false });
      });
  };

  return {
    lancerLaComparaison,
    nombreRésultats: state.nombreRésultats,
    resultats: state.résultats,
    moyenne: state.moyenne,
    lastPage: state.lastPage,
    loading: state.loading
  };
}
