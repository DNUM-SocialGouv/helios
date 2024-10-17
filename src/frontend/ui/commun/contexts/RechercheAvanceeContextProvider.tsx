import { ReactNode, useState } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const [zoneGeo, setZoneGeo] = useState("");
  const [typeStructure, setTypeStructure] = useState("");
  const [statutJuridiqueStructure, setStatutJuridiqueStructure] = useState<string[]>([]);
  const [terme, setTerme] = useState("");

  return (
    <RechercheAvanceeContext.Provider value={{ zoneGeo, setZoneGeo, typeStructure, setTypeStructure, statutJuridiqueStructure, setStatutJuridiqueStructure, terme, setTerme }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
