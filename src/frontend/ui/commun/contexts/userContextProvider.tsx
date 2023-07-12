import { ReactNode, useState } from "react";

import { FavorisViewModel } from "../../favoris/favorisViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserContext } from "./userContext";

type UserProviderProps = Readonly<{
    children: ReactNode;
}>;

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [favoris, setFavoris] = useState<FavorisViewModel[]>([]);

    const addToFavoris = (element: RechercheViewModel) => {
        const newFavori = new FavorisViewModel(
            element.numéroFiness,
            element.type,
            '1'
        );
        setFavoris(prevFavoris => [...prevFavoris, newFavori]);
    };

    const removeFromFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => prevFavoris.filter(item => item.finessNumber !== element.numéroFiness));
    };



    return (
        <UserContext.Provider value={{ favoris, setFavoris, addToFavoris, removeFromFavoris }}>
            {children}
        </UserContext.Provider>
    );
};