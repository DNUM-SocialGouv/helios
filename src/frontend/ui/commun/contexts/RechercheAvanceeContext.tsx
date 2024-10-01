import { createContext } from 'react';


interface RechercheAvanceeContextValue {
    zoneGeo: string;
    setZoneGeo: (zoneGeo: string) => void;
}

export const RechercheAvanceeContext = createContext<RechercheAvanceeContextValue | undefined>(undefined);
