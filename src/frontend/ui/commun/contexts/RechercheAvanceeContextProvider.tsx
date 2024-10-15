import { ReactNode, useState } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const [zoneGeo, setZoneGeo] = useState("");
  const [typeStructure, setTypeStructure] = useState("");
  const [statutJuridiqueStructure, setStatutJuridiqueStructure] = useState<string[]>([]);

  return (
    <RechercheAvanceeContext.Provider value={{ zoneGeo, setZoneGeo, typeStructure, setTypeStructure, statutJuridiqueStructure, setStatutJuridiqueStructure }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
