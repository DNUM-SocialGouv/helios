import { createContext } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";

interface RechercheAvanceeContextValue {
  zoneGeo: string;
  typeStructure: string;
  statutJuridiqueStructure: string[];
  capaciteSMS: CapaciteEtablissement[];
  setZoneGeo: (zoneGeo: string) => void;
  setTypeStructure: (typeStructure: string) => void;
  setStatutJuridiqueStructure: (statutJuridiqueStructure: string[]) => void;
  setCapaciteSMS: (capaciteSMS: CapaciteEtablissement[]) => void;
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
