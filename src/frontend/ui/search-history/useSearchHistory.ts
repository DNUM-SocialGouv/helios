import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSearchHistory() {
    const { data } = useSession();

    const [searchHistory, setSearchHistory] = useState<any[]>([]);

    const [idUser, setIdUser] = useState<string>();

    useEffect(() => {
        if (data?.user?.idUser)
            setIdUser(data.user.idUser);
    }, [data?.user?.idUser]);

    const getTitleType = (type: string) => {
        if (type === "Entité juridique") {
            return "EJ";
        } else {
            return "ET";
        }
    }

    const saveSearchHistory = (title: string, finessNumber: string, type: string) => {
        fetch("/api/history/add", {
            body: JSON.stringify({ title, idUser, finessNumber, type }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    const getAllSearchHistory = (idUser: string) => {
        // eslint-disable-next-line no-console
        console.log('called !!');
        const params = { idUser: idUser };
        fetch("/api/history/get/?" + (new URLSearchParams(params)).toString(), {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                const formattedHistory = data.map((elt: any) => {
                    return {
                        title: getTitleType(elt.type) + ' - ' + elt.finessNumber + ' - ' + elt.title,
                        date: elt.date,
                        finessNumber: elt.finessNumber,
                        type: elt.type,
                    };
                });
                setSearchHistory(formattedHistory);
            })
    }

    return {
        searchHistory,
        saveSearchHistory,
        getAllSearchHistory,
    };
}