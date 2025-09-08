import { useContext } from "react";

import { FavorisModel } from "../../../../database/models/FavorisModel";
import { Résultat } from "../../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { UserListViewModel } from "../user-list/UserListViewModel";

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
      categorie: ''
    };
    const rechercheViewModel = new RechercheViewModel(result, paths);
    return rechercheViewModel;
  };

  const createFavorisList = async (listName: string, isFavoris: boolean) => {
    return fetch("/api/liste",
      {
        body: JSON.stringify({ listName: listName, isFavoris: isFavoris }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

  }

  const getFavorisLists = () => {
    fetch("/api/liste",
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      })
      .then((response) => response.json())
      .then((data) => {
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

  const removeFromFavorisList = async (numerosFiness: string[], listId: number) => {
    return fetch(`/api/liste/${listId}/etablissement`,
      {
        body: JSON.stringify({ finessNumbers: numerosFiness }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      })
      .then((data) => {
        if (data.status === 204) {
          const oldList = userContext?.favorisLists.find(({ id }) => id === listId);
          if (oldList) {
            const userListEtablissements = oldList.userListEtablissements.filter(({ finessNumber }) => !numerosFiness.includes(finessNumber))
            const newList: UserListViewModel = { ...oldList, userListEtablissements }
            const newLists = userContext?.favorisLists.filter(({ id }) => id !== listId) || [];
            userContext?.setFavorisLists([...newLists, newList])
          }
        }
        return data;
      });
  };

  const addToFavorisList = async (numeroFiness: string, listId: number) => {
    return fetch(`/api/liste/${listId}/etablissement`,
      {
        body: JSON.stringify({ finessNumber: numeroFiness }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
  };

  return {
    createFavorisList,
    getFavorisLists,
    removeFromFavorisList,
    addToFavorisList,
    buildRechecheView,
    updateListName,
    deleteList
  };
}
