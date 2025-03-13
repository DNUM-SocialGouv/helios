import { KeyboardEvent as KeyboardEventReact, useContext, useEffect, useRef, useState } from "react";

import styles from "./StarButtonList.module.css";
import { useFavoris } from "../../favoris/useFavoris";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserListViewModel } from "../../user-list/UserListViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";

type StarButtonProps = Readonly<{
  favorite: RechercheViewModel | undefined;
  parent: string;
}>;

export const StarButtonList = ({ favorite, parent }: StarButtonProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const { addToFavorisList, createFavorisList, getFavorisLists } = useFavoris();
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);
  const [displayNewListInput, setDisplayNewListInput] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const componentRef = useRef<HTMLInputElement>(null);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);
  const [newListError, setNewListError] = useState(false);
  const [newListErrorMessage, setNewListErrorMessage] = useState("");
  const [addToListError, setAddToListError] = useState(false);

  let buttonStyle = "starInEstablishment";
  if (parent === "titre") {
    buttonStyle = "star";
  } else if (parent === "tab") {
    buttonStyle = "star-tab"
  }

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

  const closePopup = () => {
    setDisplayPopup(false);
    setDisplayNewListInput(false);
    setNewListName("");
    setNewListError(false);
    setNewListErrorMessage("");
    setAddToListError(false);

  }
  const handleListCreation = async () => {
    if (newListName.trim()) {
      let status: number;
      createFavorisList(newListName, false)
        .then(response => {
          status = response.status;
          return response.json();
        })
        .then(response => {
          if (status === 201) {
            // On save tout de suite l’etablissement dans la nouvelle liste
            addToFavorisList(favorite, response.id)
              .then(response => {
                getFavorisLists();
                if (response.status !== 200) {
                  setAddToListError(true);
                }
              });

            setNewListError(false);
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
        });
    }
  }

  const handleDisplayPopup = () => {
    getFavorisLists();
    // On recupere la position du bouton etoile pour calculer la position de la popup
    if (buttonRef.current) {
      const popupTop = buttonRef.current.getBoundingClientRect().bottom + document.documentElement.scrollTop;
      const popupLeft = buttonRef.current.getBoundingClientRect().left;
      setPopupX(popupLeft);
      setPopupY(popupTop);
    }
    setDisplayPopup(!displayPopup);
  }

  const isInFavoris = () => {
    const isInFav = userContext?.favorisLists.some((list) => list.userListEtablissements.some((etablissement) => etablissement.finessNumber === favorite?.numéroFiness));
    return isInFav;
  }

  const isInFavorisList = (list: UserListViewModel): boolean => {
    return list.userListEtablissements.some(etablissement => etablissement.finessNumber === favorite?.numéroFiness);
  }

  const sortedList = () => {
    const list = userContext?.favorisLists.slice();
    if (list) {
      const favorisListIndex = list.findIndex((list) => list.nom === "Favoris");
      const favorisList = list.splice(favorisListIndex, 1);
      list.sort((a: UserListViewModel, b: UserListViewModel) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      return favorisList.concat(...list);
    }
    return undefined;
  }

  const handleKeyDown = (event: KeyboardEventReact) => {
    if (event.key === 'Enter') {
      handleListCreation();
    }
  };

  return (
    <>
      <button
        className={(isInFavoris() ? "fr-icon-star-fill .fr-icon--lg " : "fr-icon-star-line .fr-icon--lg	") + styles[buttonStyle]}
        onClick={handleDisplayPopup}
        ref={buttonRef}
        title={isInFavoris() ? wording.ETOILE_ETAB_DANS_LISTE : wording.ETOILE_ETAB_PAS_DANS_LISTE}
      />
      {displayPopup &&
        <div className={"fr-text--regular " + styles["menu"]} ref={componentRef} style={(popupX > 0 && popupY > 0) ? { top: popupY, left: popupX } : {}}>

          <legend className="fr-fieldset__legend--regular fr-fieldset__legend fr-text--lead fr-my-1w fr-p-0 fr-text--bold" id="checkboxes-legend">
            {wording.ETOILE_MES_LISTES}
          </legend>
          <fieldset aria-labelledby="checkboxes-legend checkboxes-error-messages" className={"fr-fieldset fr-m-0 fr-p-0 " + styles['listOverflowContainer'] + (addToListError ? " fr-fieldset--error" : "")} id="checkboxes" role="group">
            {sortedList()?.map(list => (
              <div className="fr-fieldset__element fr-mb-1w" key={list.id}>
                <div className="fr-checkbox-group">
                  <input defaultChecked={isInFavorisList(list)} id={list.id + ""} name={"checkboxe-" + list.nom} type="checkbox" />
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
            <li><button className="fr-btn" onClick={() => closePopup()}>Ok</button></li>
          </ul>
        </div >
      }
    </>
  );
};
