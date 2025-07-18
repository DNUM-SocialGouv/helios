import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { ReactNode, useState } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
  children: ReactNode;
}>;

interface SearchParams {
  terme?: string;
  page?: number;
  zoneGeo?: string;
  zoneGeoD?: string;
  zoneGeoType?: string;
  zoneGeoLabel?: string;
  typeStructure?: string[];
  categories?: string[];
  statutJuridiqueStructure?: string[];
  order?: string;
  orderBy?: string;
  capaciteMedicoSociaux: string[];
  capaciteHandicap: string[];
  capaciteAgees: string[];
  activiteMco: string[];
  activitePsy: string[];
  activiteSsr: string[];
  activiteUsld: string[];
}

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {
  const initialPage = 1;


  const [searchParams, setSearchParams] = useQueryStates(
    {
      terme: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      zoneGeo: parseAsString.withDefault(""),
      zoneGeoD: parseAsString.withDefault(""),
      zoneGeoType: parseAsString.withDefault(""),
      zoneGeoLabel: parseAsString.withDefault(""),
      typeStructure: parseAsArrayOf(parseAsString).withDefault([]),
      statutJuridiqueStructure: parseAsArrayOf(parseAsString).withDefault([]),
      categories: parseAsArrayOf(parseAsString).withDefault([]),
      order: parseAsString.withDefault(""),
      orderBy: parseAsString.withDefault(""),
      capaciteMedicoSociaux: parseAsArrayOf(parseAsString, ";").withDefault([]),
      capaciteHandicap: parseAsArrayOf(parseAsString, ";").withDefault([]),
      capaciteAgees: parseAsArrayOf(parseAsString, ";").withDefault([]),
      activiteMco: parseAsArrayOf(parseAsString, ";").withDefault([]),
      activitePsy: parseAsArrayOf(parseAsString, ";").withDefault([]),
      activiteSsr: parseAsArrayOf(parseAsString, ";").withDefault([]),
      activiteUsld: parseAsArrayOf(parseAsString, ";").withDefault([]),
    },
    {
      urlKeys: {
        zoneGeo: "zone",
        zoneGeoD: "zoneD",
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
  const [categoriesDomaines, setCategoriesDomaines] = useState<string[]>([]);
  const [categoriesLibellesCourt, setCategoriesLibellesCourt] = useState<string[]>([]);

  const updateSearchParams = (newParams: Partial<SearchParams>) => {
    setSearchParams((prevParams) => ({ ...prevParams, ...newParams }), { shallow: false })
  };



  return (
    <RechercheAvanceeContext.Provider value={{
      ...searchParams,
      termeFixe,
      categoriesDomaines,
      setCategoriesDomaines,
      categoriesLibellesCourt,
      setCategoriesLibellesCourt,
      setZoneGeo: (value) => updateSearchParams({ zoneGeo: value, page: initialPage }),
      setZoneGeoD: (value) => updateSearchParams({ zoneGeoD: value, page: initialPage }),
      setZoneGeoType: (value) => updateSearchParams({ zoneGeoType: value, page: initialPage }),
      setZoneGeoLabel: (value) => updateSearchParams({ zoneGeoLabel: value, page: initialPage }),
      setTypeStructure: (value) => updateSearchParams({ typeStructure: value, page: initialPage }),
      setStatutJuridiqueStructure: (value) => updateSearchParams({ statutJuridiqueStructure: value, page: initialPage }),
      setCategories: (value) => updateSearchParams({ categories: value, page: initialPage }),
      setCapaciteMedicoSociaux: (value) => updateSearchParams({ capaciteMedicoSociaux: value, page: initialPage }),
      setCapaciteHandicap: (value) => updateSearchParams({ capaciteHandicap: value, page: initialPage }),
      setCapaciteAgees: (value) => updateSearchParams({ capaciteAgees: value, page: initialPage }),
      setActiviteMco: (value) => updateSearchParams({ activiteMco: value, page: initialPage }),
      setActivitePsy: (value) => updateSearchParams({ activitePsy: value, page: initialPage }),
      setActiviteSsr: (value) => updateSearchParams({ activiteSsr: value, page: initialPage }),
      setActiviteUsld: (value) => updateSearchParams({ activiteUsld: value, page: initialPage }),
      setTerme: (value) => { setSearchParams((prevParams) => ({ ...prevParams, terme: value })) },
      setTermeFixe,
      setPage: (value, shallow) => { setSearchParams({ ...searchParams, page: value }, { shallow: !!shallow }) },
      setOrder: (value) => updateSearchParams({ order: value }),
      setOrderBy: (value) => updateSearchParams({ orderBy: value })
    }}>
      {children}
    </RechercheAvanceeContext.Provider>
  );
};
