import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSearchHistory() {
    const { data } = useSession();

    const [idUser, setIdUser] = useState<string>();

    useEffect(() => {
        if (data?.user?.idUser)
            setIdUser(data.user.idUser);
    }, [data?.user?.idUser]);

    const saveSearchHistory = (title: string, finessNumber: string, type: string) => {
        fetch("/api/history/add", {
            body: JSON.stringify({ title, idUser, finessNumber, type }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }


    return {
        saveSearchHistory
    };
}