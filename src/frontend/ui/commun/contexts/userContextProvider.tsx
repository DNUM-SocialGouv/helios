import { ReactNode, useState } from "react";

import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserContext } from "./userContext";

type UserProviderProps = Readonly<{
    children: ReactNode;
}>;

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [favoris, setFavoris] = useState<RechercheViewModel[]>([]);

    const addToFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => [...prevFavoris, element]);
    };

    const removeFromFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => prevFavoris.filter(item => item !== element));
    };

    return (
        <UserContext.Provider value={{ favoris, addToFavoris, removeFromFavoris }}>
            {children}
        </UserContext.Provider>
    );
};