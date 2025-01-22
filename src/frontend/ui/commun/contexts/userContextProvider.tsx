import { ReactNode, useState } from "react";

import { UserListEtablissementModel } from "../../../../../database/models/UserListEtablissementModel";
import { UserListModel } from "../../../../../database/models/UserListModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserContext } from "./userContext";

type UserProviderProps = Readonly<{
    children: ReactNode;
}>;

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [favoris, setFavoris] = useState<RechercheViewModel[]>([]);
    const [favorisLists, setFavorisLists] = useState<UserListModel[]>([]);
    const [passwordCreated, setPasswordCreated] = useState(false);


    const addToFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => [...prevFavoris, element]);
    };

    const removeFromFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => prevFavoris.filter(item => item.numéroFiness !== element.numéroFiness));
    };

    const addToFavorisList = (element: RechercheViewModel, listId: number) => {
        setFavorisLists(prevFavorisList => {
            const newFavorisList = prevFavorisList.slice();
            let index = -1;
            const listToUpdate = newFavorisList.find((list, idx) => {
                index = idx;
                return list.id === listId;
            });

            if (listToUpdate) {
                const userListEtablissements : UserListEtablissementModel = {
                    listId: listId,
                    finessNumber: element.numéroFiness,
                    typeEtablissement: element.type,
                    dateCreation: new Date(),
                    userList: new UserListModel()
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
        <UserContext.Provider value={{ favoris, favorisLists, passwordCreated, setPasswordCreated, setFavoris, addToFavoris, removeFromFavoris, setFavorisLists, addToFavorisList, removeFromFavorisList }}>
            {children}
        </UserContext.Provider>
    );
};