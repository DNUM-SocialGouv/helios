import { parseAsArrayOf, parseAsString, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";
import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const router = useRouter();

  const { query } = router;

  const commune = query["commune"] ?? "";
  const type = query["type"] ?? "";
  const statuts = query["statuts"] && typeof query["statuts"] === "string" ? query["statuts"].split(",") : [];

  const [zoneGeo, setZoneGeo] = useQueryState<string>("commune", parseAsString.withDefault(String(commune)));
  const [typeStructure, setTypeStructure] = useQueryState<string>("type", parseAsString.withDefault(String(type)));
  const [statutJuridiqueStructure, setStatutJuridiqueStructure] = useQueryState<string[]>("statuts", parseAsArrayOf(parseAsString).withDefault(statuts));
  const [capaciteSMS, setCapaciteSMS] = useState<CapaciteEtablissement[]>([]);

  return (
    <RechercheAvanceeContext.Provider
      value={{
        zoneGeo,
        setZoneGeo,
        typeStructure,
        setTypeStructure,
        statutJuridiqueStructure,
        setStatutJuridiqueStructure,
        capaciteSMS,
        setCapaciteSMS,
      }}
    >
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
