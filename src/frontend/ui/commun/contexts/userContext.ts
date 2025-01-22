import { createContext } from 'react';

import { UserListModel } from '../../../../../database/models/UserListModel';
import { RechercheViewModel } from "../../../ui/home/RechercheViewModel";

export type InformationListe = {
    nom: string,
    id: number,
}

interface UserContextValue {
    favoris: RechercheViewModel[];
    favorisLists: UserListModel[];
    passwordCreated: boolean;
    setPasswordCreated: (value: boolean) => void;
    setFavoris: (favoris: RechercheViewModel[]) => void;
    addToFavoris: (element: any) => void;
    removeFromFavoris: (element: any) => void;
    
    setFavorisLists: (favoris: UserListModel[]) => void;
    addToFavorisList: (element: any, listId: number) => void;
    removeFromFavorisList: (element: any, listId: number) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
