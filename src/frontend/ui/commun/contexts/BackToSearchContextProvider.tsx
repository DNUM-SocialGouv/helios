import { ReactNode, useState } from "react";

import { BackToSearchContext } from "./BackToSearchContext";

type BackToSearchContextProviderProps = Readonly<{
    children: ReactNode;
}>;

export const BackToSearchContextProvider = ({ children }: BackToSearchContextProviderProps) => {
    const [isInfoPage, setIsInfoPage] = useState(false);
    return (
        <BackToSearchContext.Provider value={{ isInfoPage, setIsInfoPage }}>
            {children}
        </BackToSearchContext.Provider>
    );
};