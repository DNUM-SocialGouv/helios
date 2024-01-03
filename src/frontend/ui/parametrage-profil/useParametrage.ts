import { useRouter } from "next/router";
import { useContext } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileContext } from "../commun/contexts/ProfilContext";
import { useDependencies } from "../commun/contexts/useDependencies";

export function useParametrage() {
    const profileContext = useContext(ProfileContext);
    const router = useRouter();
    const { paths } = useDependencies();

    const updateProfile = (userId: string, code: string, value: ProfileValue, name: string) => {
        fetch("/api/profile/update", {
            body: JSON.stringify({ userId, code, value, name }),
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
            if (response.status === 200) router.push(paths.PROFILES_LIST);
        });
    };

    const getAllProfiles = (userId: string) => {
        const params = { userId: userId };
        fetch("/api/profile/get/?" + new URLSearchParams(params).toString(), {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                profileContext?.setProfiles(data.response);
            });
    };

    return {
        getAllProfiles,
        saveProfile,
        updateProfile,
    };
}
