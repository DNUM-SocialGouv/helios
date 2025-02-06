import { ChangeEvent, useContext, useEffect, useState } from "react";

import { Résultat, RésultatDeRecherche } from "../../../backend/métier/entities/RésultatDeRecherche";
import { ExtendedRésultatDeRecherche } from "../../../pages/recherche-avancee";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { RechercheViewModel } from "../home/RechercheViewModel";

type RechercheAvanceeState = Readonly<{
  estCeEnAttente: boolean;
  estCeQueLeBackendNeRépondPas: boolean;
  estCeQueLesRésultatsSontReçus: boolean;
  estCeQueLaRechercheEstLancee: boolean;
  nombreRésultats: number;
  lastPage: number;
  résultats: RechercheViewModel[];
}>;

export function useRechercheAvancee(data: ExtendedRésultatDeRecherche) {
  const { paths } = useDependencies();
  const take = 20;
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

  //const pageInitiale = 1;
  const lastPage = data.nombreDeRésultats > 0 ? Math.ceil(data.nombreDeRésultats / take) : 1;

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
  });

  useEffect(() => {
    if (data.laRechercheEtendueEstLancee) {
      setState({
        ...state,
        estCeQueLesRésultatsSontReçus: true,
        résultats: construisLesRésultatsDeLaRecherche(data),
        nombreRésultats: data.nombreDeRésultats || 0,
        lastPage: data.nombreDeRésultats > 0 ? Math.ceil(data.nombreDeRésultats / take) : 1,
      });
    }

    if (!data.laRechercheEtendueEstLancee && !state.estCeQueLaRechercheEstLancee) {
      setState({
        ...state,
        estCeQueLesRésultatsSontReçus: false,
        résultats: [],
        nombreRésultats: 0,
      });
    }
  }, [data]);

  const lancerLaRecherche = (): void => {
    rechercheAvanceeContext?.setTermeFixe(rechercheAvanceeContext?.terme);
    rechercheAvanceeContext?.setTypeStructure(rechercheAvanceeContext.typeStructure);
  };

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    rechercheAvanceeContext?.setTerme(event.target.value);
  };

  return {
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLeBackendNeRépondPas: state.estCeQueLeBackendNeRépondPas,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
    estCeQueLaRechercheEstLancee: state.estCeQueLaRechercheEstLancee,
    lancerLaRecherche,
    rechercheOnChange,
    lastPage: state.lastPage,
    terme: rechercheAvanceeContext?.terme,
    setPage: rechercheAvanceeContext?.setPage,
    page: rechercheAvanceeContext?.page,
    resultats: state.résultats,
    nombreRésultats: state.nombreRésultats,
  };
}
