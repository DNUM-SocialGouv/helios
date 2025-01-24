import { createContext } from 'react';

import { UserListViewModel } from '../../user-list/UserListViewModel';

export type InformationListe = {
    nom: string,
    id: number,
}

interface UserContextValue {
    favorisLists: UserListViewModel[];
    passwordCreated: boolean;
    setPasswordCreated: (value: boolean) => void;

    setFavorisLists: (favoris: UserListViewModel[]) => void;
    addToFavorisList: (element: any, listId: number) => void;
    removeFromFavorisList: (element: any, listId: number) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
