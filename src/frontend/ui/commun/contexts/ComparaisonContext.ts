import { createContext } from "react";

export interface ComparaisonContextValue {
  terme: string;
  termeFixe: string;
  page: number;
  zoneGeo: string;
  zoneGeoD: string;
  zoneGeoType: string;
  zoneGeoLabel: string;
  typeStructure: string[];
  categories: string[];
  categoriesDomaines: string[];
  categoriesLibellesCourt: string[];
  statutJuridiqueStructure: string[];
  capaciteMedicoSociaux: string[];
  capaciteHandicap: string[];
  capaciteAgees: string[];
  activiteMco: string[];
  activitePsy: string[];
  activiteSsr: string[];
  activiteUsld: string[];
  order: string;
  orderBy: string;
  setTerme: (terme: string) => void;
  setTermeFixe: (terme: string) => void;
  setPage: (page: number, shallow?: boolean) => void;
  setZoneGeo: (zoneGeo: string) => void;
  setZoneGeoD: (zoneGeoD: string) => void;
  setZoneGeoType: (zoneGeo: string) => void;
  setZoneGeoLabel: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string[]) => void;
  setCategories: (categories: string[]) => void;
  setCategoriesDomaines: (domaines: string[]) => void;
  setCategoriesLibellesCourt: (libelle: string[]) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciteMedicoSociaux: (capaciteMedicoSociaux: string[]) => void;
  setCapaciteHandicap: (capaciteHandicap: string[]) => void;
  setCapaciteAgees: (capaciteAgees: string[]) => void;
  setActiviteMco: (activiteMco: string[]) => void;
  setActivitePsy: (activitePsy: string[]) => void;
  setActiviteSsr: (activiteSsr: string[]) => void;
  setActiviteUsld: (activiteUsld: string[]) => void;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
}

export const ComparaisonContext = createContext<ComparaisonContextValue | undefined>(undefined);
