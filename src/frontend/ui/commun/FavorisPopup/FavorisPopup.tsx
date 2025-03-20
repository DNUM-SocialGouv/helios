import { KeyboardEvent as KeyboardEventReact, useContext, useEffect, useRef, useState } from "react";

import styles from "./FavorisPopup.module.css";
import { useFavoris } from "../../favoris/useFavoris";
import { UserListViewModel } from "../../user-list/UserListViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";

type FavorisPopupProps = Readonly<{
  favorite: string[];
  positionX: number;
  positionY: number;
  onClosePopup: () => void;
  addOnOneListOnly?: boolean;
}>;


export const FavorisPopup = ({
  favorite,
  positionX,
  positionY,
  onClosePopup = () => { },
  addOnOneListOnly = false
}: FavorisPopupProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const { addToFavorisList, removeFromFavorisList, createFavorisList, getFavorisLists } = useFavoris();
  const [displayNewListInput, setDisplayNewListInput] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const componentRef = useRef<HTMLInputElement>(null);
  const [newListError, setNewListError] = useState(false);
  const [newListErrorMessage, setNewListErrorMessage] = useState("");
  const [addToListError, setAddToListError] = useState(false);

  // Etat de selection des listes, une Map pour les ajout/suppression multiples, un id pour les ajout simple
  let checkedLists: Map<number, boolean>;
  let checkedList: number;

  useEffect(() => {
    // Cache la popup si on clic a l’exterieur
    function handleClickOutside(event: MouseEvent) {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        closePopup();
      }
    }

    // Cache la popup si appui sur la touche echap
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePopup();
      }

    }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef]);

  const handleKeyDown = (event: KeyboardEventReact) => {
    if (event.key === 'Enter' && displayNewListInput) {
      handleListCreation();
    }
  };

  const closePopup = () => {
    setDisplayNewListInput(false);
    setNewListName("");
    setNewListError(false);
    setNewListErrorMessage("");
    setAddToListError(false);
    onClosePopup();
  }

  const handleListCreation = async () => {
    setNewListError(false);
    setAddToListError(false);

    if (newListName.trim()) {
      let status = -1;
      let listId = -1;
      await createFavorisList(newListName, false)
        .then(response => {
          status = response.status;
          return response.json();
        })
        .then(response => {
          listId = response.id;
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

  const isInFavorisList = (list: UserListViewModel, finessNumber: string): boolean => {
    return list.userListEtablissements.some(etablissement => etablissement.finessNumber === finessNumber);
  };

  // On choisit l’implementation des fonctions par rapport au cas (ajout/suppression multiples ou ajout simple)
  let onListClick: (id: number) => void;
  if (addOnOneListOnly) {
    onListClick = (id) => checkedList = id;
  } else {
    onListClick = (id: number) => {
      const list = checkedLists.get(id);
      if (typeof list === "boolean") {
        checkedLists.set(id, !list);
      }
    };


  }
  const isAnyFinessInFavorisList = (list: UserListViewModel): boolean => {
    for (const finessNumber of favorite) {
      if (list.userListEtablissements.some(etablissement => etablissement.finessNumber === finessNumber)) {
        return true;
      };
    }
    return false;
  };



  const sortedList = () => {
    const list = userContext?.favorisLists.slice();
    if (list) {
      //On génère la map des listes de favoris uniquement quand ce n’est pas un ajout simple
      if (!addOnOneListOnly) generateFavorisMap();
      const favorisListIndex = list.findIndex((list) => list.nom === "Favoris");
      const favorisList = list.splice(favorisListIndex, 1);
      list.sort((a: UserListViewModel, b: UserListViewModel) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      return favorisList.concat(...list);
    }
    return undefined;
  }

  const generateFavorisMap = () => {
    const checkedMap = new Map<number, boolean>();
    const list = userContext?.favorisLists.slice();
    if (list) {
      list.forEach(userList => {
        checkedMap.set(userList.id, isAnyFinessInFavorisList(userList));
      });
    }
    checkedLists = checkedMap;
  }

  const onClickOk = async () => {
    let isOnError = false;
    setAddToListError(false);
    if (addOnOneListOnly) {
      isOnError = await addOnNewFinessNumberOnList();
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

  async function addOnNewFinessNumberOnList(): Promise<boolean> {
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

  return (
    <div className={"fr-text--regular " + styles["menu"]} ref={componentRef} style={(positionX > 0 && positionY > 0) ? { top: positionY, left: positionX } : {}}>

      <legend className="fr-fieldset__legend--regular fr-fieldset__legend fr-text--lead fr-my-1w fr-p-0 fr-text--bold" id="checkboxes-legend">
        {wording.ETOILE_MES_LISTES}
      </legend>
      <fieldset aria-labelledby="checkboxes-legend checkboxes-error-messages" className={"fr-fieldset fr-m-0 fr-p-0 " + styles['listOverflowContainer'] + (addToListError ? " fr-fieldset--error" : "")} id="checkboxes" role="group">
        {sortedList()?.map(list => (
          <div className="fr-fieldset__element fr-mb-1w" key={list.id}>
            <div className="fr-checkbox-group">
              <input defaultChecked={addOnOneListOnly ? false : isAnyFinessInFavorisList(list)} id={list.id + ""} name={"checkboxe-" + list.nom} onClick={() => onListClick(list.id)} type="checkbox" />
              <label className="fr-label" htmlFor={list.id + ""}>
                {list.nom}
              </label>
            </div>
          </div>
        ))}
      </fieldset>
      <div aria-live="assertive" className="fr-messages-group" id="checkboxes-error-messages">
        {addToListError && <p className={"fr-message fr-message--error " + styles['error-message']} id="checkboxes-error-message-error">{wording.ETOILE_ERREUR_MODIF_ETAB}</p>}
      </div>


      <ul className="fr-btns-group fr-btns-group--sm">
        <li className="fr-mt-2w">
          {!displayNewListInput
            ? <button className="fr-btn fr-btn--secondary" disabled={userContext && userContext.favorisLists.length >= 11} onClick={() => setDisplayNewListInput(true)}>{wording.ETOILE_NOUVELLE_LISTE}</button>
            :
            <div className={"fr-input-group " + (newListError ? "fr-input-group--error " : " ") + styles['new-list-button-group']} >
              <label className="fr-label fr-ml-1w" htmlFor="new-list-form">Nouvelle liste</label>
              <div className={styles['new-list-form']}>
                <input aria-describedby={newListError ? "new-list-error-message" : undefined} className={"fr-input " + (newListError ? "fr-input--error" : "")} id="newListForm" name="new-list-input" onChange={(e) => setNewListName(e.target.value)} onKeyDown={handleKeyDown} type="text" value={newListName} />
                <button className="fr-btn fr-icon-check-line fr-m-0" onClick={handleListCreation}></button>
              </div>
              <div className="fr-messages-group">
                {newListError && <p className={"fr-message fr-message--error " + styles['error-message']} id="new-list-error-message">{newListErrorMessage}</p>}
              </div>
            </div>
          }
        </li>
        <li><button className="fr-btn" onClick={() => onClickOk()}>Ok</button></li>
      </ul>
    </div >
  );
} 
