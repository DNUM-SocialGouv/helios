import { createContext } from 'react';

export type BackToSearchContextValue = {
    isInfoPage: boolean;
    setIsInfoPage: (isInfoPage: boolean) => void;
}

export const BackToSearchContext = createContext<BackToSearchContextValue | undefined>(undefined);
