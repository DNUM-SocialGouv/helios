import { createContext } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";

export interface RechercheAvanceeContextValue {
  terme: string;
  page: number;
  zoneGeo: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  capaciteSMS: CapaciteEtablissement[];
  setTerme: (terme: string) => void
  setPage: (page: number, shallow?: boolean) => void
  setZoneGeo: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciteSMS: (capaciteSMS: CapaciteEtablissement[]) => void;
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
