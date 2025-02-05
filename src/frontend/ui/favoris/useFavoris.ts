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
      rattachement: "",
    };
    const rechercheViewModel = new RechercheViewModel(result, paths);
    return rechercheViewModel;
  };

  const getFavorisLists = () => {
    fetch("/api/liste",
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      })
      .then((response) => response.json())
      .then((data) => {
        //const favorisList = buildFavorisList(data);
        userContext?.setFavorisLists(data);
      });
  };

  const updateListName = (listId: number, listName: string) => {
     fetch(`/api/liste/${listId}`,
      {
        body: JSON.stringify({ listName }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
      .then((response) => response.json())
      .then((updatedList) => {
        const newList = userContext?.favorisLists.filter(({ id }) => id !== listId) || [];
        userContext?.setFavorisLists([...newList, updatedList])
      });
  };

  const deleteList = (listId: number) => {
    fetch(`/api/liste/${listId}`,
     {
       headers: { "Content-Type": "application/json" },
       method: "DELETE",
     })
     .then(() => {
       const newList = userContext?.favorisLists.filter(({ id }) => id !== listId) || [];
       userContext?.setFavorisLists(newList)
     });
 };

  const removeFromFavorisList = (favorite: any, listId: number) => {
    return fetch(`/api/liste/${listId}/etablissement`,
      {
        body: JSON.stringify({ finessNumber: favorite.numéroFiness }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      })
      .then((data) => {
        if (data.status === 204) {
          userContext?.removeFromFavorisList(favorite, listId);
        }
      });
  };

  const addToFavorisList = (favorite: any, listId: number) => {
    fetch(`/api/liste/${listId}/etablissement`,
      {
        body: JSON.stringify({ finessNumber: favorite.numéroFiness, typeEtablissement: favorite.type }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
      .then((data) => {
        if (data.status === 200) {
          userContext?.addToFavorisList(favorite, listId);
        }
      });
  };

  return {
    getFavorisLists,
    removeFromFavorisList,
    addToFavorisList,
    buildRechecheView,
    updateListName,
    deleteList
  };
}
