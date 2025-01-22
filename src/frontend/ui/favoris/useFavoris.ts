import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

import { FavorisModel } from "../../../../database/models/FavorisModel";
import { UserListModel } from "../../../../database/models/UserListModel";
import { Résultat } from "../../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../commun/contexts/useDependencies";
import { InformationListe, UserContext } from "../commun/contexts/userContext";
import { RechercheViewModel } from "../home/RechercheViewModel";

export function useFavoris() {
  const userContext = useContext(UserContext);
  const { paths } = useDependencies();
  const { data } = useSession();

  const [idUser, setIdUser] = useState<string>();

  useEffect(() => {
    if (data?.user?.idUser) setIdUser(data.user.idUser);
  }, [data?.user?.idUser]);

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

  const buildFavorisList = (userList: UserListModel[]): Map<string, InformationListe[]> => {
    const favorisListe = new Map<string, InformationListe[]>();
    userList.forEach(liste => {
      const informationListe: InformationListe = { id: liste.id, nom: liste.nom };

      liste.userListEtablissements.forEach(etablissement => {
        let etablissementLists = favorisListe.get(etablissement.finessNumber);
        if (etablissementLists) {
          etablissementLists = [...etablissementLists, informationListe];
        } else {
          favorisListe.set(etablissement.finessNumber, [informationListe]);
        }
      })
    });
    return favorisListe;
  }

  const addToFavoris = (favorite: any) => {
    fetch("/api/favoris/add", {
      body: JSON.stringify({
        finessNumber: favorite.numéroFiness,
        type: favorite.type,
        idUser,
        commune: favorite.commune,
        departement: favorite.departement,
        socialReason: favorite.socialReason,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((data) => {
      if (data.status === 200) {
        userContext?.addToFavoris(favorite);
      }
    });
  };

  const removeFromFavoris = (favorite: any) => {
    fetch("/api/favoris/remove", {
      body: JSON.stringify({ idUser, finessNumber: favorite.numéroFiness }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((data) => {
      if (data.status === 200) {
        userContext?.removeFromFavoris(favorite);
      }
    });
  };

  const getAllFavoris = (idUser: string) => {
    const params = { idUser: idUser };
    fetch("/api/favoris/get/?" + new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const favorisViewModel = data.map((element: any) => {
          return buildRechecheView(element);
        });
        userContext?.setFavoris(favorisViewModel);
      });
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

  const removeFromFavorisList = (favorite: any, listId: number) => {
    fetch(`/api/liste/${listId}/etablissement`,
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
    addToFavoris,
    removeFromFavoris,
    getAllFavoris,
    getFavorisLists,
    removeFromFavorisList,
    addToFavorisList,
    buildRechecheView,
  };
}
