import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

interface SearchParams {
  page?: number;
  zoneGeo?: string;
  typeStructure?: string;
  statutJuridiqueStructure?: string[];
  order?: string;
  orderBy?: string;
  capaciteMedicoSociaux: string[];
  capaciteHandicap: string[];
  capaciteAgees: string[];
}

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {

  const router = useRouter()
  const initialPage = 1;

  const { query } = router;

  const commune = query["commune"] ?? '';
  const type = query["type"] ?? '';
  const page = query["page"] ?? '1';
  const terme = query["terme"] ?? '';
  const statuts = query["statuts"] && typeof query["statuts"] === "string" ? query["statuts"].split(",") : []
  const order = query["order"] ?? '';
  const orderBy = query["order_by"] ?? '';

  const capaciteMedicoSociaux =
    query["capacite_medico_sociaux"] && typeof query["capacite_medico_sociaux"] === "string" ? query["capacite_medico_sociaux"].split(";") : [];
  const capaciteHandicap = query["capacite_handicap"] && typeof query["capacite_handicap"] === "string" ? query["capacite_handicap"].split(";") : [];
  const capaciteAgees = query["capacite_agees"] && typeof query["capacite_agees"] === "string" ? query["capacite_agees"].split(";") : [];

  const [searchParams, setSearchParams] = useQueryStates(
    {
      terme: parseAsString.withDefault(String(terme)),
      page: parseAsInteger.withDefault(Number(page)),
      zoneGeo: parseAsString.withDefault(String(commune)),
      typeStructure: parseAsString.withDefault(String(type)),
      statutJuridiqueStructure: parseAsArrayOf(parseAsString).withDefault(statuts),
      order: parseAsString.withDefault(String(order)),
      orderBy: parseAsString.withDefault(String(orderBy)),
      capaciteMedicoSociaux: parseAsArrayOf(parseAsString, ";").withDefault(capaciteMedicoSociaux),
      capaciteHandicap: parseAsArrayOf(parseAsString, ";").withDefault(capaciteHandicap),
      capaciteAgees: parseAsArrayOf(parseAsString, ";").withDefault(capaciteAgees),
    },
    {
      urlKeys: {
        zoneGeo: "commune",
        typeStructure: "type",
        statutJuridiqueStructure: "statuts",
        orderBy: "order_by",
        capaciteMedicoSociaux: "capacite_medico_sociaux",
        capaciteHandicap: "capacite_handicap",
        capaciteAgees: "capacite_agees",
      },
    }
  );

  const updateSearchParams = async (newParams: Partial<SearchParams>) => setSearchParams((prevParams) => ({ ...prevParams, ...newParams }), { shallow: false });

  return (
    <RechercheAvanceeContext.Provider value={{
      ...searchParams,
      setZoneGeo: (value) => updateSearchParams({ zoneGeo: value, page: initialPage }),
      setTypeStructure: (value) => updateSearchParams({ typeStructure: value, page: initialPage }),
      setStatutJuridiqueStructure: (value) => updateSearchParams({ statutJuridiqueStructure: value, page: initialPage }),
      setCapaciteMedicoSociaux: (value) => updateSearchParams({ capaciteMedicoSociaux: value, page: initialPage }),
      setCapaciteHandicap: (value) => updateSearchParams({ capaciteHandicap: value, page: initialPage }),
      setCapaciteAgees: (value) => updateSearchParams({ capaciteAgees: value, page: initialPage }),
      setTerme: (value) => setSearchParams({ ...searchParams, terme: value }),
      setPage: (value, shallow) => setSearchParams({ ...searchParams, page: value }, { shallow: !!shallow }),
      setOrder: (value) => updateSearchParams({ order: value }),
      setOrderBy: (value) => updateSearchParams({ orderBy: value }),
    }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
