import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "next-usequerystate";
import { ReactNode, useState } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

interface SearchParams {
  terme?: string;
  page?: number;
  zoneGeo?: string;
  zoneGeoType?: string;
  zoneGeoLabel?: string;
  typeStructure?: string;
  statutJuridiqueStructure?: string[];
  order?: string;
  orderBy?: string;
  capaciteMedicoSociaux: string[];
  capaciteHandicap: string[];
  capaciteAgees: string[];
}

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const initialPage = 1;


  const [searchParams, setSearchParams] = useQueryStates(
    {
      terme: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      zoneGeo: parseAsString.withDefault(""),
      zoneGeoType: parseAsString.withDefault(""),
      zoneGeoLabel: parseAsString.withDefault(""),
      typeStructure: parseAsString.withDefault(""),
      statutJuridiqueStructure: parseAsArrayOf(parseAsString).withDefault([]),
      order: parseAsString.withDefault(""),
      orderBy: parseAsString.withDefault(""),
      capaciteMedicoSociaux: parseAsArrayOf(parseAsString, ";").withDefault([]),
      capaciteHandicap: parseAsArrayOf(parseAsString, ";").withDefault([]),
      capaciteAgees: parseAsArrayOf(parseAsString, ";").withDefault([]),
    },
    {
      urlKeys: {
        zoneGeo: "zone",
        zoneGeoType: "typeZone",
        zoneGeoLabel: 'zoneLabel',
        typeStructure: "type",
        statutJuridiqueStructure: "statuts",
        orderBy: "order_by",
        capaciteMedicoSociaux: "capacite_medico_sociaux",
        capaciteHandicap: "capacite_handicap",
        capaciteAgees: "capacite_agees",
      },
    }
  );

  const [termeFixe, setTermeFixe] = useState("");

  const updateSearchParams = async (newParams: Partial<SearchParams>) => {
    setSearchParams((prevParams) => ({ ...prevParams, ...newParams }), { shallow: false })
  };



  return (
    <RechercheAvanceeContext.Provider value={{
      ...searchParams,
      termeFixe,
      setZoneGeo: (value) => updateSearchParams({ zoneGeo: value, page: initialPage }),
      setZoneGeoType: (value) => updateSearchParams({ zoneGeoType: value, page: initialPage }),
      setZoneGeoLabel: (value) => updateSearchParams({ zoneGeoLabel: value, page: initialPage }),
      setTypeStructure: (value) => updateSearchParams({ typeStructure: value, page: initialPage }),
      setStatutJuridiqueStructure: (value) => updateSearchParams({ statutJuridiqueStructure: value, page: initialPage }),
      setCapaciteMedicoSociaux: (value) => updateSearchParams({ capaciteMedicoSociaux: value, page: initialPage }),
      setCapaciteHandicap: (value) => updateSearchParams({ capaciteHandicap: value, page: initialPage }),
      setCapaciteAgees: (value) => updateSearchParams({ capaciteAgees: value, page: initialPage }),
      setTerme: (value) => setSearchParams({ ...searchParams, terme: value }),
      setTermeFixe,
      setPage: (value, shallow) => setSearchParams({ ...searchParams, page: value }, { shallow: !!shallow }),
      setOrder: (value) => updateSearchParams({ order: value }),
      setOrderBy: (value) => updateSearchParams({ orderBy: value })
    }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
