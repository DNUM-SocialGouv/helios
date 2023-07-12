import { useContext } from "react";

import { UserContext } from "../commun/contexts/userContext";
import { FavorisViewModel } from "./favorisViewModel";

export function useFavoris() {

    const userContext = useContext(UserContext);

    const addToFavoris = (finessNumber: string, type: string, idUser: string) => {
        fetch("/api/favoris/add-to-favoris", {
            body: JSON.stringify({ finessNumber, type, idUser }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('data from add');
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('error', error);
            });
    }

    const removeFromFavoris = (idUser: string, finessNumber: string) => {
        fetch("/api/favoris/remove-from-favoris", {
            body: JSON.stringify({ idUser, finessNumber }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('data from delete');
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('error', error);
            });
    }

    const getAllFavoris = (idUser: string) => {
        const params = { idUser: idUser };
        fetch("/api/favoris/get-all-favoris/?" + (new URLSearchParams(params)).toString(), {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                var favorisViewModel = [];
                data.forEach((element: any) => {
                    favorisViewModel.push(new FavorisViewModel(element.finessNumber, element.type, '1'));
                });
                userContext?.setFavoris(data);
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('error', error);
            });
    }

    return {
        addToFavoris,
        removeFromFavoris,
        getAllFavoris,
    };
}
