import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useParametrage() {
    const { data } = useSession();

    const [profiles, setProfiles] = useState<any[]>([]);

    const [idUser, setIdUser] = useState<string>();

    useEffect(() => {
        if (data?.user?.idUser)
            setIdUser(data.user.idUser);
    }, [data?.user?.idUser]);


    const saveProfile = (title: string, finessNumber: string, type: string) => {
        fetch("/api/profile", {
            body: JSON.stringify({ title, idUser, finessNumber, type }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    const getAllProfiles = () => {
        fetch("/api/profile", {
            body: JSON.stringify({ }),
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            setProfiles(data);
        })
    }


    return {
        getAllProfiles,
        saveProfile,
        profiles,
    };
}