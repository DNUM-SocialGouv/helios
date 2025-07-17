import { useRouter } from "next/router";
import React, { ReactNode, useRef, useState } from "react";

import styles from "./ListActionsButton.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import { FavorisPopup, POPUP_WIDTH } from "../commun/FavorisPopup/FavorisPopup";
import { useFavoris } from "../favoris/useFavoris";

type ListActionsButtonProps = Readonly<{
  selectedRows: Map<string, string>;
  setSelectedRows?: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  listId?: number;
  listName?: string;
  order?: string;
  orderBy?: string;
  disabledExport?: boolean;
  children?: JSX.Element;
  onAddToFavorisSuccess?: (listName: string) => void;
  exportButton: ReactNode;
  fullSelectButton?: ReactNode;
}>;

export const ListActionsButton = ({ selectedRows, setSelectedRows, listId, onAddToFavorisSuccess, exportButton, fullSelectButton }: ListActionsButtonProps) => {

  const { wording } = useDependencies();
  const router = useRouter();
  const { getFavorisLists, removeFromFavorisList } = useFavoris()
  const [displayActions, setDisplayActions] = useState<boolean>(false);
  const listFinessNumbers = selectedRows.keys().toArray();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);
  const [displayFavorisPopup, setDisplayFavorisPopup] = useState<boolean>(false);


  const lancerComparaison = () => {
    const firstType = selectedRows.values().next().value;
    sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
    sessionStorage.setItem("comparaisonType", firstType);
    document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
    document.cookie = `type=${encodeURIComponent(firstType)}; path=/`;
    router.push("/comparaison");
  }

  const onClickDelete = async () => {
    if (listId && setSelectedRows) {
      await removeFromFavorisList(listFinessNumbers, listId);
      setSelectedRows(new Map());
      setDisplayActions(false);
      router.replace(router.asPath);
    }
  }

  const handleDisplayFavorisPopup = () => {
    getFavorisLists();
    // On recupere la position du bouton action pour calculer la position de la popup
    if (buttonRef.current) {
      const popupTop = buttonRef.current.getBoundingClientRect().bottom + document.documentElement.scrollTop;
      const popupLeft = buttonRef.current.getBoundingClientRect().right - POPUP_WIDTH;
      setPopupX(popupLeft);
      setPopupY(popupTop);
    }
    setDisplayActions(false);
    setDisplayFavorisPopup(true);
  }

  return (
    <div className={styles["button-position"]}>
      <button className={displayActions ? "fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary fr-mt-1w" : "fr-btn fr-btn--icon-right fr-icon-arrow-up-s-line fr-btn--secondary fr-mt-1w"} onClick={() => setDisplayActions(!displayActions)} ref={buttonRef}> {wording.ACTIONS} </button>
      {displayActions &&
        <ul className={styles["menu"]}>
          {router.pathname !== "/comparaison" ?
            <li className={styles["menu-item"]}>
              <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.size < 2 || selectedRows.values().some((type) => type !== "Médico-social")} onClick={lancerComparaison}>
                {wording.COMPARER}
              </button>
            </li>
            : null}
          <li className={styles["menu-item"]}>
            {listId ? <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.size === 0} onClick={onClickDelete}>
              {wording.SUPPRIMER_DE_LA_LISTE}
            </button>
              : <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.size < 2} onClick={handleDisplayFavorisPopup}>
                Ajouter à mes listes
              </button>
            }
          </li>
          <li className={styles["menu-item"]}>
            {exportButton}
          </li>
          {fullSelectButton
            ? <li className={styles["menu-item"]}>
              {fullSelectButton}
            </li>
            : <></>
          }
        </ul>
      }
      {
        displayFavorisPopup &&
        <FavorisPopup addOnOneListOnly={true} favorite={listFinessNumbers} onClickOkSuccess={onAddToFavorisSuccess} onClosePopup={() => setDisplayFavorisPopup(false)} onNewListCreationSuccess={onAddToFavorisSuccess} positionX={popupX} positionY={popupY} />
      }
    </div >
  );
};
