import { parseAsArrayOf, parseAsString, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const router = useRouter()

  const { query } = router;

  const commune = query["commune"] ?? '';
  const type = query["type"] ?? '';
  const statuts = query["statuts"] && typeof query["statuts"] === "string" ? query["statuts"].split(",") : []

  const [zoneGeo, setZoneGeo] = useQueryState<string>("commune", parseAsString.withDefault(String(commune)));
  const [typeStructure, setTypeStructure] = useQueryState<string>("type", parseAsString.withDefault(String(type)));
  const [statutJuridiqueStructure, setStatutJuridiqueStructure] = useQueryState<string[]>("statuts", parseAsArrayOf(parseAsString).withDefault(statuts));

  return (
    <RechercheAvanceeContext.Provider value={{
      zoneGeo,
      setZoneGeo,
      typeStructure,
      setTypeStructure,
      statutJuridiqueStructure, 
      setStatutJuridiqueStructure,
    }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
