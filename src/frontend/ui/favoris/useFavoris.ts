import { useContext } from "react";

import { FavorisModel } from "../../../../database/models/FavorisModel";
import { Résultat } from "../../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { RechercheViewModel } from "../home/RechercheViewModel";

export function useFavoris() {

    const userContext = useContext(UserContext);
    const { paths } = useDependencies();

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

    const addToFavoris = (finessNumber: string, type: string, idUser: string, commune: string, departement: string, socialReason: string) => {
        fetch("/api/favoris/add-to-favoris", {
            body: JSON.stringify({ finessNumber, type, idUser, commune, departement, socialReason }),
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
                var favorisViewModel: RechercheViewModel[] = [];
                data.forEach((element: any) => {
                    favorisViewModel.push(buildRechecheView(element));
                });
                userContext?.setFavoris(favorisViewModel);
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
        buildRechecheView,
    };
}
