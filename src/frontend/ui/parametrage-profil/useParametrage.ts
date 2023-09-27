import { useContext } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileContext } from "../commun/contexts/ProfilContext";

export function useParametrage() {
    const profileContext = useContext(ProfileContext);

    const updateProfile = (code: string, value: ProfileValue) => {
        fetch("/api/profile/update", {
            body: JSON.stringify({ code, value }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    const saveProfile = (title: string, finessNumber: string, type: string) => {
        fetch("/api/profile", {
            body: JSON.stringify({ title, finessNumber, type }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    const getAllProfiles = () => {
        fetch("/api/profile/get", {
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
        updateProfile
    };
}