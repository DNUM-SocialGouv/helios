import { KeyboardEvent as KeyboardEventReact, useContext, useEffect, useRef, useState } from "react";

import { useFavoris } from "../../favoris/useFavoris";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserListViewModel } from "../../user-list/UserListViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";
import styles from "./StarButtonList.module.css";

type StarButtonProps = Readonly<{
  favorite: RechercheViewModel | undefined;
  parent: string;
}>;

export const StarButtonList = ({ favorite, parent }: StarButtonProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const { createFavorisList } = useFavoris();
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);
  const [displayNewListInput, setDisplayNewListInput] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const componentRef = useRef<HTMLInputElement>(null);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);

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
        setDisplayPopup(false);
        setDisplayNewListInput(false);
        setNewListName("");
      }
    }

    // Cache la popup si appui sur la touche echap
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDisplayPopup(false);
        setDisplayNewListInput(false);
        setNewListName("");
      }

    }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef]);

  const handleListCreation = () => {
    if (newListName.trim()) {
      createFavorisList(newListName, false);
    }
    setDisplayNewListInput(false);
    setNewListName("");
  }

  const handleDisplayPopup = () => {
    // On recupere la position du bouton etoile pour calculer la position de la popup
    if (buttonRef.current) {
      const popupTop = buttonRef.current.getBoundingClientRect().bottom;
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
      list.sort((a: UserListViewModel, b: UserListViewModel) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
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
        <div className={"fr-text--regular " + styles["menu"]} ref={componentRef} style={(popupX > 0 && popupY > 0) ? { position: "fixed", top: popupY, left: popupX } : {}}>

          <fieldset aria-labelledby="checkboxes-legend checkboxes-messages" className={"fr-fieldset fr-m-0 fr-p-0 " + styles['listOverflowContainer']} id="checkboxes">
            <legend className="fr-fieldset__legend--regular fr-fieldset__legend fr-text--lead fr-my-1w fr-p-0 fr-text--bold" id="checkboxes-legend">
              {wording.ETOILE_MES_LISTES}
            </legend>
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

          <ul className="fr-btns-group fr-btns-group--sm">
            <li className="fr-mt-2w">
              {!displayNewListInput
                ? <button className="fr-btn fr-btn--secondary" disabled={userContext && userContext.favorisLists.length >= 11} onClick={() => setDisplayNewListInput(true)}>{wording.ETOILE_NOUVELLE_LISTE}</button>
                :
                <>
                  <label className="fr-label fr-ml-1w" htmlFor="newListForm">Nouvelle liste</label>
                  <div className={styles['newListForm']}>
                    <input className="fr-input" id="newListForm" name="new-list-input" onChange={(e) => setNewListName(e.target.value)} onKeyDown={handleKeyDown} type="text" value={newListName} />
                    <button className="fr-btn fr-icon-check-line fr-m-0" onClick={handleListCreation}></button>
                  </div>
                </>
              }
            </li>
            <li><button className="fr-btn" onClick={() => setDisplayPopup(false)}>Ok</button></li>
          </ul>
        </div >
      }
    </>
  );
};
