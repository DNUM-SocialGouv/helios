import { ChangeEvent, MouseEvent, useContext } from "react";

import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";

/*type RechercheAvanceeState = Readonly<{
  estCeEnAttente: boolean;
  estCeQueLeBackendNeRépondPas: boolean;
  estCeQueLesRésultatsSontReçus: boolean;
  estCeQueLaRechercheEstLancee: boolean;
  nombreRésultats: number;
  lastPage: number;
  résultats: RechercheViewModel[];
}>;*/

export function useComparaison() {
  const { paths } = useDependencies();
  // const take = 20;
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

  const pageInitiale = 1;
  // const lastPage = data.nombreDeRésultats > 0 ? Math.ceil(data.nombreDeRésultats / take) : 1;

  const lancerLaRecherche = (event: MouseEvent<HTMLButtonElement>): void => {
    if (rechercheAvanceeContext?.terme !== "") {
      event.preventDefault();
      rechercher(
        rechercheAvanceeContext?.terme,
        rechercheAvanceeContext?.zoneGeo,
        rechercheAvanceeContext?.typeStructure,
        rechercheAvanceeContext?.statutJuridiqueStructure,
        pageInitiale
      );
    }
  };

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    rechercheAvanceeContext?.setTerme(event.target.value);
  };

  function construisLeLien(type: string): string {
    if (type === "Médico-social") {
      return paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + "/";
    } else if (type === "Sanitaire") {
      return paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/";
    }
    return paths.ENTITÉ_JURIDIQUE + "/";
  }

  const rechercher = async (terme: string = "", commune: string = "", type: string = "", statutJuridique: string[] = [], page: number = 1) => {
    rechercheAvanceeContext?.setPage(page, true);
    fetch("/api/recherche-avancee", {
      body: JSON.stringify({ page, terme, commune, type, statutJuridique }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {})
      .catch(() => {});
  };

  return {
    lancerLaRecherche,
    rechercheOnChange,
    construisLeLien,
  };
}
