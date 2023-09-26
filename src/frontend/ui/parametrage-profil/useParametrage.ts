import { useContext } from "react";

import { ProfileContext } from "../commun/contexts/ProfilContext";

export function useParametrage() {
    const profileContext = useContext(ProfileContext);



    const saveProfile = (title: string, finessNumber: string, type: string) => {
        fetch("/api/profile", {
            body: JSON.stringify({ title, finessNumber, type }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    const getAllProfiles = () => {
        fetch("/api/profiles/get", {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                profileContext?.setProfiles(data);
            })
    }

    return {
        getAllProfiles,
        saveProfile,
    };
}