import { createContext } from 'react';

import { ProfilModel } from '../../../../../database/models/ProfilModel';

interface ProfileContextValue {
    profiles: ProfilModel[];
    setProfiles: (profiles: ProfilModel[]) => void;
    addToProfiles: (element: any) => void;
    updateProfiles: (element: any) => void;
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);
