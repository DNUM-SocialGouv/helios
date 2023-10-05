import { useRouter } from "next/router";
import { useContext } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileContext } from "../commun/contexts/ProfilContext";

export function useParametrage() {
    const profileContext = useContext(ProfileContext);
    const router = useRouter();

    const updateProfile = (userId: string, code: string, value: ProfileValue) => {
        fetch("/api/profile/update", {
            body: JSON.stringify({ userId, code, value }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then((response) => {
            if (response.status === 200)
                router.push('/settings')
        })
    }

    const saveProfile = (userId: string, label: string, profile: ProfileValue) => {
        fetch("/api/profile/add", {
            body: JSON.stringify({ userId, label, value: profile }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then((response) => {
            if (response.status === 200)
                router.push('/settings')
        })
    }

    const getAllProfiles = (userId: string) => {
        const params = { userId: userId };
        fetch("/api/profile/get/?" + (new URLSearchParams(params)).toString(), {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                profileContext?.setProfiles(data.response);
            })
    }

    return {
        getAllProfiles,
        saveProfile,
        updateProfile
    };
}