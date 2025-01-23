import { createContext } from 'react';

import { RechercheViewModel } from "../../../ui/home/RechercheViewModel";
import { UserListViewModel } from '../../user-list/UserListViewModel';

export type InformationListe = {
    nom: string,
    id: number,
}

interface UserContextValue {
    favoris: RechercheViewModel[];
    favorisLists: UserListViewModel[];
    passwordCreated: boolean;
    setPasswordCreated: (value: boolean) => void;
    setFavoris: (favoris: RechercheViewModel[]) => void;
    addToFavoris: (element: any) => void;
    removeFromFavoris: (element: any) => void;

    setFavorisLists: (favoris: UserListViewModel[]) => void;
    addToFavorisList: (element: any, listId: number) => void;
    removeFromFavorisList: (element: any, listId: number) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
