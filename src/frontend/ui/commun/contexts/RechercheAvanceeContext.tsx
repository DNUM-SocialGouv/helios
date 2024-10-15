import { createContext } from "react";

interface RechercheAvanceeContextValue {
  zoneGeo: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  setZoneGeo: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
