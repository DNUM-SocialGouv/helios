import { ReactNode, useState } from "react";

import { ProfileContext } from "./ProfilContext";
import { ProfilModel } from "../../../../../database/models/ProfilModel";

type ProfileProviderProps = Readonly<{
    children: ReactNode;
}>;

export const ProfileContextProvider = ({ children }: ProfileProviderProps) => {
    const [profiles, setProfiles] = useState<ProfilModel[]>([]);
    const [editedProfile, setEditedProfile] = useState<ProfilModel>();

    const addToProfiles = (element: ProfilModel) => {
        setProfiles(prevFavoris => [...prevFavoris, element]);
    };

    const updateProfiles = (elements: ProfilModel[]) => {
        setProfiles(elements);
    };

    return (
        <ProfileContext.Provider value={{ profiles, setProfiles, editedProfile, setEditedProfile, addToProfiles, updateProfiles }}>
            {children}
        </ProfileContext.Provider>
    );
};