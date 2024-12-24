import { ChangeEvent, MouseEvent, useContext, useState } from "react";

import { Résultat, RésultatDeRecherche } from "../../../../backend/métier/entities/RésultatDeRecherche";
import { ComparaisonContext } from "../../commun/contexts/ComparaisonContext";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { AttribuesDefaults } from "../../recherche-avancee/model/Attribues";
import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";

type RechercheAvanceeState = Readonly<{
  estCeEnAttente: boolean;
  estCeQueLeBackendNeRépondPas: boolean;
  estCeQueLesRésultatsSontReçus: boolean;
  estCeQueLaRechercheEstLancee: boolean;
  nombreRésultats: number;
  //lastPage: number;
  résultats: RechercheViewModel[];
}>;

export function useRechercheAvanceeComparaison() {
  const { paths } = useDependencies();
  const comparaisonContext = useContext(ComparaisonContext);
  const pageInitiale = 1;
  const statutsJuridiquesDefaultValue: string[] = [];
  // const lastPage = data.nombreDeRésultats > 0 ? Math.ceil(data.nombreDeRésultats / take) : 1;

  const construisLesRésultatsDeLaRecherche = (data: RésultatDeRecherche): RechercheViewModel[] => {
    return data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths));
  };
  const [state, setState] = useState<RechercheAvanceeState>({
    estCeEnAttente: false,
    estCeQueLeBackendNeRépondPas: false,
    estCeQueLesRésultatsSontReçus: false,
    estCeQueLaRechercheEstLancee: false,
    nombreRésultats: 0,
    // lastPage,
    résultats: construisLesRésultatsDeLaRecherche({ nombreDeRésultats: 0, résultats: [] }),
  });

  const lancerLaRecherche = (event: MouseEvent<HTMLButtonElement>): void => {
    const capacites = [
      { classification: "non_classifie", ranges: comparaisonContext?.capaciteMedicoSociaux || [] },
      { classification: "publics_en_situation_de_handicap", ranges: comparaisonContext?.capaciteHandicap || [] },
      { classification: "personnes_agees", ranges: comparaisonContext?.capaciteAgees || [] },
    ].filter((capacite) => capacite.ranges && capacite.ranges.length > 0);
    if (comparaisonContext?.terme !== "") {
      event.preventDefault();
      setState({
        ...state,
        estCeEnAttente: true,
        estCeQueLesRésultatsSontReçus: false,
        estCeQueLaRechercheEstLancee: true,
      });
      rechercher(
        comparaisonContext?.terme,
        comparaisonContext?.zoneGeo,
        AttribuesDefaults.etablissementMedicoSocial,
        statutsJuridiquesDefaultValue,
        capacites,
        comparaisonContext?.page
      );
    }
  };

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    comparaisonContext?.setTerme(event.target.value);
  };
  const rechercher = async (
    terme: string | undefined,
    commune: string | undefined,
    type: string,
    statutJuridique: string[],
    capaciteSMS: CapaciteEtablissement[] | undefined,
    page: number | undefined
  ) => {
    rechercheParamValidator(terme, commune, capaciteSMS, page);
    comparaisonContext?.setPage(page ?? 1, true);
    fetch("/api/recherche-avancee", {
      body: JSON.stringify({ page, terme, commune, type, statutJuridique, capaciteSMS }),
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
          //lastPage: Math.ceil(data.nombreDeRésultats / take),
          résultats: construisLesRésultatsDeLaRecherche(data),
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

  const rechercheParamValidator = (
    terme: string | undefined,
    commune: string | undefined,
    capaciteSMS: CapaciteEtablissement[] | undefined,
    page: number | undefined
  ) => {
    terme ?? "";
    commune ?? "";
    capaciteSMS ?? [];
    page ?? pageInitiale;
  };

  return {
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLeBackendNeRépondPas: state.estCeQueLeBackendNeRépondPas,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
    estCeQueLaRechercheEstLancee: state.estCeQueLaRechercheEstLancee,
    lancerLaRecherche,
    rechercheOnChange,
    //lastPage: state.lastPage,
    terme: comparaisonContext?.terme,
    setPage: comparaisonContext?.setPage,
    page: comparaisonContext?.page,
    resultats: state.résultats,
    nombreRésultats: state.nombreRésultats,
  };
}
