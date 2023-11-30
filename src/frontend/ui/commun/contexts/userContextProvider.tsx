import { ReactNode, useState } from "react";

import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserContext } from "./userContext";

type UserProviderProps = Readonly<{
    children: ReactNode;
}>;

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [favoris, setFavoris] = useState<RechercheViewModel[]>([]);
    const [passwordCreated, setPasswordCreated] = useState(false);


    const addToFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => [...prevFavoris, element]);
    };

    const removeFromFavoris = (element: RechercheViewModel) => {
        setFavoris(prevFavoris => prevFavoris.filter(item => item.numéroFiness !== element.numéroFiness));
    };

    return (
        <UserContext.Provider value={{ favoris, passwordCreated, setPasswordCreated, setFavoris, addToFavoris, removeFromFavoris }}>
            {children}
        </UserContext.Provider>
    );
};