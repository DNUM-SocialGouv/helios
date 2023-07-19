import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

import { FavorisModel } from "../../../../database/models/FavorisModel";
import { Résultat } from "../../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { RechercheViewModel } from "../home/RechercheViewModel";

export function useFavoris() {

    const userContext = useContext(UserContext);
    const { paths } = useDependencies();
    const { data } = useSession();

    const [idUser, setIdUser] = useState<string>();

    useEffect(() => {
        if (data?.user?.idUser)
            setIdUser(data.user.idUser);
    }, [data?.user?.idUser]);


    const buildRechecheView = (favori: FavorisModel): RechercheViewModel => {
        const result: Résultat = {
            commune: favori.commune,
            département: favori.departement,
            numéroFiness: favori.finessNumber,
            raisonSocialeCourte: favori.socialReason,
            type: favori.type,
        }
        const rechercheViewModel = new RechercheViewModel(result, paths);
        return rechercheViewModel;
    }

    const addToFavoris = (favorite: any) => {
        fetch("/api/favoris/add-to-favoris", {
            body: JSON.stringify({ finessNumber: favorite.numéroFiness, type: favorite.type, idUser, commune: favorite.commune, departement: favorite.departement, socialReason: favorite.socialReason }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((data) => {
                if (data.status === 200) {
                    userContext?.addToFavoris(favorite);
                }
            })
    }

    const removeFromFavoris = (favorite: any) => {
        fetch("/api/favoris/remove-from-favoris", {
            body: JSON.stringify({ idUser, finessNumber: favorite.numéroFiness }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((data) => {
                if (data.status === 200) {
                    userContext?.removeFromFavoris(favorite);
                }
            })
    }

    const getAllFavoris = (idUser: string) => {
        const params = { idUser: idUser };
        fetch("/api/favoris/get-all-favoris/?" + (new URLSearchParams(params)).toString(), {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                var favorisViewModel: RechercheViewModel[] = [];
                data.forEach((element: any) => {
                    favorisViewModel.push(buildRechecheView(element));
                });
                userContext?.setFavoris(favorisViewModel);
            })
    }

    return {
        addToFavoris,
        removeFromFavoris,
        getAllFavoris,
        buildRechecheView,
    };
}