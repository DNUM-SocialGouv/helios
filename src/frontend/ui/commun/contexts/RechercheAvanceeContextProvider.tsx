import { ReactNode, useState } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";
import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const [zoneGeo, setZoneGeo] = useState("");
  const [typeStructure, setTypeStructure] = useState("");
  const [statutJuridiqueStructure, setStatutJuridiqueStructure] = useState<string[]>([]);
  const [capaciter, setCapaciter] = useState<CapaciteEtablissement[]>([]);

  return (
    <RechercheAvanceeContext.Provider
      value={{ zoneGeo, setZoneGeo, typeStructure, setTypeStructure, statutJuridiqueStructure, setStatutJuridiqueStructure, capaciter, setCapaciter }}
    >
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
