import { createContext } from 'react';

import { RechercheViewModel } from "../../../ui/home/RechercheViewModel";

interface UserContextValue {
    favoris: RechercheViewModel[];
    setFavoris: (favoris: RechercheViewModel[]) => void;
    addToFavoris: (element: RechercheViewModel) => void;
    removeFromFavoris: (element: RechercheViewModel) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
