import { ReactNode, useState } from "react";

import { UserContext } from "./userContext";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserListEtablissementViewModel, UserListViewModel } from "../../user-list/UserListViewModel";

type UserProviderProps = Readonly<{
    children: ReactNode;
}>;

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [favorisLists, setFavorisLists] = useState<UserListViewModel[]>([]);
    const [passwordCreated, setPasswordCreated] = useState(false);

    const addToFavorisList = (element: RechercheViewModel, listId: number) => {
        setFavorisLists(prevFavorisList => {
            const newFavorisList = prevFavorisList.slice();
            let index = -1;
            const listToUpdate = newFavorisList.find((list, idx) => {
                index = idx;
                return list.id === listId;
            });

            if (listToUpdate) {
                const userListEtablissements: UserListEtablissementViewModel = {
                    finessNumber: element.numéroFiness,
                    dateCreation: new Date(),
                }
                listToUpdate?.userListEtablissements.push(userListEtablissements);
                newFavorisList[index] = listToUpdate;
            }

            return newFavorisList;
        });
    };

    const removeFromFavorisList = (element: RechercheViewModel, listId: number) => {
        const finess = element.numéroFiness;

        setFavorisLists(prevFavorisList => {
            const newFavorisList = prevFavorisList.slice();
            let index = -1;
            const listToUpdate = newFavorisList.find((list, idx) => {
                index = idx;
                return list.id === listId;
            });

            if (listToUpdate) {
                const newListEtablissement = listToUpdate?.userListEtablissements.filter(etablissement => etablissement.finessNumber !== finess);
                listToUpdate.userListEtablissements = newListEtablissement;
                newFavorisList[index] = listToUpdate;
            }

            return newFavorisList;
        });
    };

    return (
        <UserContext.Provider value={{ favorisLists, passwordCreated, setPasswordCreated, setFavorisLists, addToFavorisList, removeFromFavorisList }}>
            {children}
        </UserContext.Provider>
    );
};