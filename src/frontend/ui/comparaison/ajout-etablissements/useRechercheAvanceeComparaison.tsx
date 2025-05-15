import { ChangeEvent, useContext, useState } from "react";

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
  lastPage: number;
  résultats: RechercheViewModel[];
}>;

export function useRechercheAvanceeComparaison() {
  const { paths } = useDependencies();
  const comparaisonContext = useContext(ComparaisonContext);
  const pageInitiale = 1;
  const statutsJuridiquesDefaultValue: string[] = [];
  const take = 20;

  const construisLesRésultatsDeLaRecherche = (data: RésultatDeRecherche): RechercheViewModel[] => {
    return data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths));
  };
  const [state, setState] = useState<RechercheAvanceeState>({
    estCeEnAttente: false,
    estCeQueLeBackendNeRépondPas: false,
    estCeQueLesRésultatsSontReçus: false,
    estCeQueLaRechercheEstLancee: false,
    nombreRésultats: 0,
    lastPage: pageInitiale,
    résultats: construisLesRésultatsDeLaRecherche({ nombreDeRésultats: 0, résultats: [] }),
  });

  const lancerLaRecherche = (): void => {
    if (lancerRechercheRequisParamValidator()) {
      const capacites = [
        { classification: "non_classifie", ranges: comparaisonContext?.capaciteMedicoSociaux || [] },
        { classification: "publics_en_situation_de_handicap", ranges: comparaisonContext?.capaciteHandicap || [] },
        { classification: "personnes_agees", ranges: comparaisonContext?.capaciteAgees || [] },
      ].filter((capacite) => capacite.ranges && capacite.ranges.length > 0);
      setState({
        ...state,
        estCeEnAttente: true,
        estCeQueLesRésultatsSontReçus: false,
        estCeQueLaRechercheEstLancee: true,
      });
      rechercher(
        comparaisonContext?.terme,
        comparaisonContext?.zoneGeo,
        comparaisonContext?.zoneGeoD,
        comparaisonContext?.zoneGeoType,
        AttribuesDefaults.etablissementMedicoSocial,
        statutsJuridiquesDefaultValue,
        capacites,
        comparaisonContext?.page
      );
    } else {
      setState({
        ...state,
        nombreRésultats: 0,
        résultats: [],
      });
    }
  };

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    comparaisonContext?.setTerme(event.target.value);
  };
  const rechercher = async (
    terme: string | undefined,
    zone: string | undefined,
    zoneD: string | undefined,
    typeZone: string | undefined,
    type: string,
    statutJuridique: string[],
    capaciteSMS: CapaciteEtablissement[] | undefined,
    page: number | undefined
  ) => {
    fetch("/api/recherche-avancee", {
      body: JSON.stringify({ page, terme, zone, zoneD, typeZone, type, statutJuridique, capaciteSMS }),
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
          lastPage: Math.ceil(data.nombreDeRésultats / take),
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

  const lancerRechercheRequisParamValidator = () => {
    if (
      comparaisonContext?.terme === "" &&
      comparaisonContext?.capaciteAgees.length === 0 &&
      comparaisonContext?.capaciteHandicap.length === 0 &&
      comparaisonContext?.capaciteMedicoSociaux.length === 0 &&
      comparaisonContext?.zoneGeo === "" &&
      comparaisonContext?.zoneGeoD === ""
    ) {
      return false;
    }

    return true;
  };

  return {
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLeBackendNeRépondPas: state.estCeQueLeBackendNeRépondPas,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
    estCeQueLaRechercheEstLancee: state.estCeQueLaRechercheEstLancee,
    lancerLaRecherche,
    rechercheOnChange,
    lastPage: state.lastPage,
    terme: comparaisonContext?.terme,
    setPage: comparaisonContext?.setPage,
    page: comparaisonContext?.page,
    resultats: state.résultats,
    nombreRésultats: state.nombreRésultats,
  };
}
