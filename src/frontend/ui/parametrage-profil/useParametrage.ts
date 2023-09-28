import { useRouter } from "next/router";
import { useContext } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileContext } from "../commun/contexts/ProfilContext";

export function useParametrage() {
    const profileContext = useContext(ProfileContext);
    const router = useRouter();

    const updateProfile = (code: string, value: ProfileValue) => {
        fetch("/api/profile/update", {
            body: JSON.stringify({ code, value }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then((response) => {
            if (response.status === 200)
                router.push('/settings')
        })
    }

    const saveProfile = (label: string, profile: ProfileValue) => {
        fetch("/api/profile/add", {
            body: JSON.stringify({ label, value: profile }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then((response) => {
            if (response.status === 200)
                router.push('/settings')
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