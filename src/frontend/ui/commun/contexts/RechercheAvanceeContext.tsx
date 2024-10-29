import { createContext } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";

export interface RechercheAvanceeContextValue {
  terme: string;
  page: number;
  zoneGeo: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  capaciteSMS: CapaciteEtablissement[];
  order: string;
  orderBy: string;
  setTerme: (terme: string) => void
  setPage: (page: number) => void
  setZoneGeo: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciteSMS: (capaciteSMS: CapaciteEtablissement[]) => void;
  setOrder: (order: string) => void
  setOrderBy: (orderBy: string) => void
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
