import { createContext } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";

interface RechercheAvanceeContextValue {
  zoneGeo: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  capaciter: CapaciteEtablissement[];
  setZoneGeo: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciter: (capaciter: CapaciteEtablissement[]) => void;
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
