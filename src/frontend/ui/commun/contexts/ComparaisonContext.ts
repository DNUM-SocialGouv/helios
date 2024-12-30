import { createContext } from "react";

export interface ComparaisonContextValue {
  terme: string;
  termeFixe: string;
  page: number;
  zoneGeo: string;
  zoneGeoD: string;
  zoneGeoType: string;
  zoneGeoLabel: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  capaciteMedicoSociaux: string[];
  capaciteHandicap: string[];
  capaciteAgees: string[];
  order: string;
  orderBy: string;
  setTerme: (terme: string) => void;
  setTermeFixe: (terme: string) => void;
  setPage: (page: number, shallow?: boolean) => void;
  setZoneGeo: (zoneGeo: string) => void;
  setZoneGeoD: (zoneGeoD: string) => void;
  setZoneGeoType: (zoneGeo: string) => void;
  setZoneGeoLabel: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciteMedicoSociaux: (capaciteMedicoSociaux: string[]) => void;
  setCapaciteHandicap: (capaciteHandicap: string[]) => void;
  setCapaciteAgees: (capaciteAgees: string[]) => void;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
}

export const ComparaisonContext = createContext<ComparaisonContextValue | undefined>(undefined);
