import { createContext } from "react";

export interface RechercheAvanceeContextValue {
  terme: string;
  page: number;
  zoneGeo: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  capaciteMedicoSociaux: string[];
  capaciteHandicap: string[];
  capaciteAgees: string[];
  setTerme: (terme: string) => void
  setPage: (page: number, shallow?: boolean) => void
  setZoneGeo: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciteMedicoSociaux: (capaciteMedicoSociaux: string[]) => void;
  setCapaciteHandicap: (capaciteHandicap: string[]) => void;
  setCapaciteAgees: (capaciteAgees: string[]) => void;
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
