import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

import { CapaciteEtablissement } from "../../recherche-avancee/model/CapaciteEtablissement";
import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

interface SearchParams {
  page?: number;
  zoneGeo?: string;
  typeStructure?: string;
  statutJuridiqueStructure?: string[];
}

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const router = useRouter()

  const { query } = router;

  const commune = query["commune"] ?? '';
  const type = query["type"] ?? '';
  const page = query["page"] ?? '1';
  const terme = query["terme"] ?? '';
  const statuts = query["statuts"] && typeof query["statuts"] === "string" ? query["statuts"].split(",") : []

const [capaciteSMS, setCapaciteSMS] = useState<CapaciteEtablissement[]>([]);

  const [searchParams, setSearchParams] = useQueryStates(
    {
      terme: parseAsString.withDefault(String(terme)),
      page: parseAsInteger.withDefault(Number(page)),
      zoneGeo: parseAsString.withDefault(String(commune)),
      typeStructure: parseAsString.withDefault(String(type)),
      statutJuridiqueStructure: parseAsArrayOf(parseAsString).withDefault(statuts)
    },
    {
      urlKeys: {
        zoneGeo: "commune",
        typeStructure: "type",
        statutJuridiqueStructure: "statuts"
      },
    }
  )

  const updateSearchParams = async (newParams: Partial<SearchParams>) => 
    setSearchParams((prevParams) => ({ ...prevParams, ...newParams }), {shallow: false})
  

  return (
    <RechercheAvanceeContext.Provider value={{
      ...searchParams,
      setZoneGeo: (value) => updateSearchParams({ zoneGeo: value }),
      setTypeStructure: (value) => updateSearchParams({ typeStructure: value }),
      setStatutJuridiqueStructure: (value) => updateSearchParams({ statutJuridiqueStructure: value }),
      setTerme: (value) => setSearchParams({...searchParams, terme: value}),
      setPage: (value) => updateSearchParams({ page: value }),
      capaciteSMS,
      setCapaciteSMS,
    }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
