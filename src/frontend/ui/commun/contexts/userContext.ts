import { createContext } from 'react';

import { RechercheViewModel } from "../../../ui/home/RechercheViewModel";

interface UserContextValue {
    favoris: RechercheViewModel[];
    passwordCreated: boolean;
    setPasswordCreated: (value: boolean) => void;
    setFavoris: (favoris: RechercheViewModel[]) => void;
    addToFavoris: (element: any) => void;
    removeFromFavoris: (element: any) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
