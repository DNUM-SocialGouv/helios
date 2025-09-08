import { KeyboardEvent as KeyboardEventReact, useContext, useEffect, useRef } from "react";

import styles from "./FavorisPopup.module.css";
import { useFavorisPopup } from "./useFavorisPopup";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";

type FavorisPopupProps = Readonly<{
  favorite: string[];
  positionX: number;
  positionY: number;
  onClosePopup: () => void;
  onNewListCreationSuccess?: (listName: string) => void;
  onClickOkSuccess?: (listName: string) => void;
  addOnOneListOnly?: boolean;
}>;

export const POPUP_WIDTH = 250;

export const FavorisPopup = ({
  favorite,
  positionX,
  positionY,
  onClosePopup,
  onNewListCreationSuccess = (_listName: string) => { },
  onClickOkSuccess = (_listName: string) => { },
  addOnOneListOnly = false
}: FavorisPopupProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const componentRef = useRef<HTMLInputElement>(null);

  const { newListError, newListErrorMessage, newListName,
    displayNewListInput, setDisplayNewListInput,
    addToListError, sortedList, setNewListName,
    handleListCreation, closePopup, onListClick,
    isChecked, onClickOk } = useFavorisPopup(addOnOneListOnly, favorite, onClosePopup, onClickOkSuccess, onNewListCreationSuccess);

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

  return (
    <div className={"fr-text--regular " + styles["menu"]} ref={componentRef} style={(positionX > 0 && positionY > 0) ? { top: positionY, left: positionX } : {}}>
      <div className={displayNewListInput ? "fr-hidden" : ""}>
        <legend className="fr-fieldset__legend--regular fr-fieldset__legend fr-text--lead fr-my-1w fr-ml-1v fr-p-0 fr-text--bold" id="checkboxes-legend">
          {wording.ETOILE_MES_LISTES}
        </legend>
        <fieldset aria-labelledby="checkboxes-legend checkboxes-error-messages" className={"fr-fieldset fr-m-0 fr-p-0 " + styles['listOverflowContainer'] + (addToListError ? " fr-fieldset--error" : "")} hidden={displayNewListInput} id="checkboxes" role="group">
          {sortedList()?.map(list => (
            <div className="fr-fieldset__element fr-mb-1w" key={list.id}>
              <div className="fr-checkbox-group">
                <input checked={addOnOneListOnly ? isChecked(list.id) : undefined} defaultChecked={addOnOneListOnly ? undefined : isChecked(list.id)} id={list.id + ""} name={"checkboxe-" + list.nom} onClick={() => onListClick(list.id)} type="checkbox" value={list.id} />
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
      </div>


      <div>
        {!displayNewListInput
          ? <button className={"fr-btn fr-btn--sm fr-btn--secondary fr-mt-2w fr-mb-2w " + styles['full-width-button']} disabled={userContext && userContext.favorisLists.length >= 11} onClick={() => setDisplayNewListInput(true)}>{wording.ETOILE_NOUVELLE_LISTE_BOUTON}</button>
          :
          <div className={"fr-input-group " + (newListError ? "fr-input-group--error " : " ") + styles['new-list-button-group']} >
            <label className="fr-label fr-text--lead fr-text--bold fr-my-1w fr-p-0" htmlFor="new-list-form">Nouvelle liste</label>
            {/* Autofocus dans un formulaire a un seul champs et dans une popup. Ne casse pas le flux de la page */}
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input aria-describedby={newListError ? "new-list-error-message" : undefined} autoFocus className={"fr-input " + (newListError ? "fr-input--error" : "")} id="newListForm" name="new-list-input" onChange={(e) => setNewListName(e.target.value)} onKeyDown={handleKeyDown} type="text" value={newListName} />
            <div className="fr-messages-group">
              {newListError && <p className={"fr-message fr-message--error " + styles['error-message']} id="new-list-error-message">{newListErrorMessage}</p>}
            </div>
          </div>
        }
      </div>

      {displayNewListInput
        ? <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--center fr-btns-group--equisized fr-p-0">
          <li className={displayNewListInput ? "" : "fr-hidden"}><button className="fr-btn fr-btn--secondary" onClick={() => { setDisplayNewListInput(false); setNewListName("") }}>Annuler</button></li>
          <li><button className="fr-btn" onClick={() => handleListCreation()}>Ok</button></li>
        </ul>
        : <button className={"fr-btn fr-mb-2w " + styles['full-width-button']} onClick={() => onClickOk()}>Ok</button>
      }
    </div >
  );
}
