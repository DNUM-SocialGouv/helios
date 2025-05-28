import { ReactNode, useState } from "react";

import { ComparaisonContext } from "./ComparaisonContext";

type ComparaisonProviderProps = Readonly<{
  children: ReactNode;
}>;

export const ComparaisonContextProvider = ({ children }: ComparaisonProviderProps) => {
  const [terme, setTerme] = useState<string>("");
  const [termeFixe, setTermeFixe] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [zoneGeo, setZoneGeo] = useState<string>("");
  const [zoneGeoD, setZoneGeoD] = useState<string>("");
  const [zoneGeoType, setZoneGeoType] = useState<string>("");
  const [zoneGeoLabel, setZoneGeoLabel] = useState<string>("");
  const [typeStructure, setTypeStructure] = useState<string[]>([]);
  const [statutJuridiqueStructure, setStatutJuridiqueStructure] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesDomaines, setCategoriesDomaines] = useState<string[]>([]);
  const [categoriesLibellesCourt, setCategoriesLibellesCourt] = useState<string[]>([]);
  const [capaciteMedicoSociaux, setCapaciteMedicoSociaux] = useState<string[]>([]);
  const [capaciteHandicap, setCapaciteHandicap] = useState<string[]>([]);
  const [capaciteAgees, setCapaciteAgees] = useState<string[]>([]);
  const [order, setOrder] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");

  return (
    <ComparaisonContext.Provider
      value={{
        terme,
        setTerme,
        termeFixe,
        setTermeFixe,
        page,
        setPage,
        zoneGeo,
        setZoneGeo,
        zoneGeoD,
        setZoneGeoD,
        zoneGeoType,
        setZoneGeoType,
        zoneGeoLabel,
        setZoneGeoLabel,
        typeStructure,
        setTypeStructure,
        categories,
        setCategories,
        categoriesDomaines,
        setCategoriesDomaines,
        categoriesLibellesCourt,
        setCategoriesLibellesCourt,
        statutJuridiqueStructure,
        setStatutJuridiqueStructure,
        capaciteMedicoSociaux,
        setCapaciteMedicoSociaux,
        capaciteHandicap,
        setCapaciteHandicap,
        capaciteAgees,
        setCapaciteAgees,
        order,
        setOrder,
        orderBy,
        setOrderBy,
      }}
    >
      {children}
    </ComparaisonContext.Provider>
  );
};
