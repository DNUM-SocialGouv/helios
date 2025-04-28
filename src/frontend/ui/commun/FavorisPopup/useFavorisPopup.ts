import { useContext, useState } from "react";

import { useFavoris } from "../../favoris/useFavoris";
import { UserListViewModel } from "../../user-list/UserListViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";


export function useFavorisPopup(
  addOnOneListOnly: boolean,
  favorite: string[],
  onClosePopup: () => void,
  onClickOkSuccess = (_listName: string) => { },
  onNewListCreationSuccess: (listName: string) => void = (_listName) => { },
) {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const { addToFavorisList, removeFromFavorisList, createFavorisList, getFavorisLists } = useFavoris();
  const [displayNewListInput, setDisplayNewListInput] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const [newListError, setNewListError] = useState(false);
  const [newListErrorMessage, setNewListErrorMessage] = useState("");
  const [addToListError, setAddToListError] = useState(false);

  // Etat de selection des listes, une Map pour les ajout/suppression multiples, un id pour les ajout simple
  const [checkedLists, setCheckedLists] = useState<Map<number, boolean>>(new Map());
  const [checkedList, setCheckedList] = useState<number>(-1);

  function getCheckedListName(): string {
    const lists = userContext?.favorisLists;
    if (lists && checkedList) {
      const list = lists.find((list) => list.id === checkedList);
      if (list) return list.nom;
    }
    return "";
  }

  const handleListCreation = async () => {
    setNewListError(false);
    setAddToListError(false);

    const newListTrimmedName = newListName.trim();

    if (newListTrimmedName) {
      let status = -1;
      let listId = -1;
      await createFavorisList(newListTrimmedName, false)
        .then(response => {
          status = response.status;
          if (status === 201) {
            return response.json();
          }
          return null;
        })
        .then(response => {
          if (response) {
            listId = response.id;
          }
        });

      if (status === 201) {
        // On save tout de suite les etablissements dans la nouvelle liste
        let isOnError = false;
        for (const finessNumber of favorite) {
          await addToFavorisList(finessNumber, listId)
            .then(response => {
              if (response.status !== 200) {
                isOnError = true;
              }
            });
        }
        if (isOnError) setAddToListError(true);
        getFavorisLists();

        setDisplayNewListInput(false);
        setNewListName("");
        onNewListCreationSuccess(newListTrimmedName);
        // Dans l’ajout simple on ferme la popup à la création d’une liste car c’est un seul ajout
        if (addOnOneListOnly) {
          closePopup();
        } else {
          setCheckedLists(checkedLists.set(listId, true));
        }
      } else if (status === 403) {
        setNewListError(true);
        setNewListErrorMessage(wording.ETOILE_MAX_LISTE_ATTEINT);
        getFavorisLists();
      } else {
        setNewListError(true);
        setNewListErrorMessage(wording.SOMETHING_WENT_WRONG);
      }
    }
  }

  const closePopup = () => {
    setDisplayNewListInput(false);
    setNewListName("");
    setNewListError(false);
    setNewListErrorMessage("");
    setAddToListError(false);
    onClosePopup();
  }

  // On choisit l’implementation des fonctions par rapport au cas (ajout/suppression multiples ou ajout simple)
  let onListClick: (id: number) => void;
  let isChecked: (id: number) => boolean;
  if (addOnOneListOnly) {
    onListClick = (id: number) => setCheckedList(id);
    isChecked = (id: number) => {
      return checkedList === id;
    }
  } else {
    onListClick = (id: number) => {
      const list = checkedLists.get(id);
      if (typeof list === "boolean") {
        checkedLists.set(id, !list);
      }
    };
    isChecked = (id: number) => {
      const listcheckedStatus = checkedLists.get(id);
      return typeof listcheckedStatus === "boolean" && listcheckedStatus;
    }
  }

  const sortedList = () => {
    const list = userContext?.favorisLists.slice();
    if (list) {
      //On génère la map des listes de favoris uniquement quand ce n’est pas un ajout simple
      if (!addOnOneListOnly) generateFavorisMap();
      const favorisListIndex = list.findIndex((list) => list.isFavoris);
      const favorisList = list.splice(favorisListIndex, 1);
      list.sort((a: UserListViewModel, b: UserListViewModel) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      return favorisList.concat(...list);
    }
    return undefined;
  }

  const generateFavorisMap = () => {
    if (checkedLists.size === 0) {
      const checkedMap = new Map<number, boolean>();
      const list = userContext?.favorisLists.slice();
      if (list) {
        list.forEach(userList => {
          checkedMap.set(userList.id, isAnyFinessInFavorisList(userList));
        });
      }
      setCheckedLists(checkedMap);
    }
  }

  const isAnyFinessInFavorisList = (list: UserListViewModel): boolean => {
    for (const finessNumber of favorite) {
      if (list.userListEtablissements.some(etablissement => etablissement.finessNumber === finessNumber)) {
        return true;
      };
    }
    return false;
  };

  const onClickOk = async () => {
    let isOnError = false;
    setAddToListError(false);
    if (addOnOneListOnly) {
      isOnError = await addNewFinessNumbersOnList();
    } else {
      const currentLists = userContext?.favorisLists;
      if (currentLists) {
        for (const list of currentLists) {
          const ListIsOnError = await diffAndSaveFavorisState(list);
          if (!isOnError) isOnError = ListIsOnError;
        }
      }
    }

    if (isOnError) {
      setAddToListError(true);
    } else {
      closePopup();
      onClickOkSuccess(getCheckedListName());
    }
    getFavorisLists();
  }

  async function diffAndSaveFavorisState(list: UserListViewModel): Promise<boolean> {
    let isOnError = false;
    for (const finessNumber of favorite) {
      if (isInFavorisList(list, finessNumber) && typeof checkedLists.get(list.id) === "boolean" && !checkedLists.get(list.id)) { // Etablissement en favoris actuellement mais décoché -> On retire
        const response = await removeFromFavorisList(favorite, list.id);
        if (response.status !== 204) isOnError = true;
      } else if (!isInFavorisList(list, finessNumber) && typeof checkedLists.get(list.id) === "boolean" && checkedLists.get(list.id)) { // Etablissement pas en favoris mais coché -> On ajoute
        const response = await addToFavorisList(finessNumber, list.id);
        if (response.status !== 200) isOnError = true;
      }
    }
    return isOnError;
  }

  async function addNewFinessNumbersOnList(): Promise<boolean> {
    let isOnError = false;
    let selectedList;
    const currentLists = userContext?.favorisLists;
    if (currentLists) {
      selectedList = currentLists.find((list) => list.id === checkedList);
    }

    if (selectedList) {
      for (const finessNumber of favorite) {
        if (!isInFavorisList(selectedList, finessNumber)) {
          const response = await addToFavorisList(finessNumber, checkedList);
          if (response.status !== 200) isOnError = true;
        }
      }
    }
    return isOnError;
  }

  const isInFavorisList = (list: UserListViewModel, finessNumber: string): boolean => {
    return list.userListEtablissements.some(etablissement => etablissement.finessNumber === finessNumber);
  };


  return {
    newListName,
    setNewListName,
    displayNewListInput,
    setDisplayNewListInput,
    addToListError,
    newListError,
    newListErrorMessage,
    onClickOk,

    sortedList,
    getCheckedListName,
    handleListCreation,
    closePopup,
    onListClick,
    isChecked,
  }
}
