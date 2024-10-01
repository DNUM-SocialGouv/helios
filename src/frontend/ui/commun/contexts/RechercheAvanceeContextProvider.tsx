import { ReactNode, useState } from "react";

import { RechercheAvanceeContext } from "./RechercheAvanceeContext";

type RechercheAvanceeProviderProps = Readonly<{
    children: ReactNode;
}>;

export const RechecheAvanceeContextProvider = ({ children }: RechercheAvanceeProviderProps) => {

    const [zoneGeo, setZoneGeo] = useState("");

    return (
        <RechercheAvanceeContext.Provider value={{ zoneGeo, setZoneGeo }}>
            {children}
        </RechercheAvanceeContext.Provider>
    );
};