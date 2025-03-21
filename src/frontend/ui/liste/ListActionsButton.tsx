import { NextRouter, useRouter } from "next/router";
import { useRef, useState } from "react";

import ExportList from "./ExportList";
import styles from "./ListActionsButton.module.css"
import { Wording } from "../../configuration/wording/Wording";
import { useDependencies } from "../commun/contexts/useDependencies";
import { FavorisPopup } from "../commun/FavorisPopup/FavorisPopup";
import { SelectedRows } from "../commun/Table/Table";
import { useFavoris } from "../favoris/useFavoris";
import { ComparaisonViewModel } from "../home/ComparaisonViewModel";
import { RechercheViewModel } from "../home/RechercheViewModel";

type ExportProps = Readonly<{
  listId?: number;
  listName?: string;
  order?: string;
  orderBy?: string;
  disabledExport?: boolean
  children?: JSX.Element
  router: NextRouter;
  wording: Wording;
}>;

type ListActionsButtonProps = Readonly<{
  selectedRows: RechercheViewModel[] | ComparaisonViewModel[] | (RechercheViewModel | ComparaisonViewModel)[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<SelectedRows>>
  listId?: number;
  listName?: string;
  order?: string;
  orderBy?: string;
  disabledExport?: boolean;
  children?: JSX.Element;
  onAddToFavorisSuccess?: (listName: string) => void;
}>;

// Un export pour la page liste, pour la page comparaison et plus tard pour la page recherche avancée
const Export = ({ listId, listName, order, orderBy, disabledExport, router, children, wording }: ExportProps) => {
  if (listId && listName && order && orderBy) {
    return <ExportList disabled={disabledExport} listId={listId} listName={listName} order={order} orderBy={orderBy} />
  } else if (router.pathname === "/comparaison") {
    return children
  } else
    return <button className="fr-btn fr-btn--tertiary-no-outline" disabled={true}>
      {wording.EXPORTER}
    </button>
}

export const ListActionsButton = ({ selectedRows, setSelectedRows, listId, listName, order, orderBy, disabledExport, children, onAddToFavorisSuccess }: ListActionsButtonProps) => {

  const { wording } = useDependencies();
  const router = useRouter();
  const { getFavorisLists, removeFromFavorisList } = useFavoris()
  const [displayActions, setDisplayActions] = useState<boolean>(false);
  const listFinessNumbers = selectedRows.map((row) => row.numéroFiness);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);
  const [displayFavorisPopup, setDisplayFavorisPopup] = useState<boolean>(false);


  const lancerComparaison = () => {
    const firstType = selectedRows[0].type;
    sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
    sessionStorage.setItem("comparaisonType", firstType);
    document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
    document.cookie = `type=${encodeURIComponent(firstType)}; path=/`;
    router.push("/comparaison");
  }

  const onClickDelete = async () => {
    if (listId && setSelectedRows) {
      await removeFromFavorisList(listFinessNumbers, listId);
      setSelectedRows([]);
      setDisplayActions(false);
      router.replace(router.asPath);
    }
  }

  const handleDisplayFavorisPopup = () => {
    getFavorisLists();
    // On recupere la position du bouton action pour calculer la position de la popup
    if (buttonRef.current) {
      const popupTop = buttonRef.current.getBoundingClientRect().bottom + document.documentElement.scrollTop;
      const popupLeft = buttonRef.current.getBoundingClientRect().left;
      setPopupX(popupLeft);
      setPopupY(popupTop);
    }
    setDisplayActions(false);
    setDisplayFavorisPopup(true);
  }

  return (
    <div className={styles["button-position"]}>
      <button className={displayActions ? "fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary" : "fr-btn fr-btn--icon-right fr-icon-arrow-up-s-line fr-btn--secondary"} onClick={() => setDisplayActions(!displayActions)} ref={buttonRef}> {wording.ACTIONS} </button>
      {displayActions &&
        <ul className={styles["menu"]}>
          {router.pathname !== "/comparaison" ?
            <li className={styles["menu-item"]}>
              <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.length < 2 || selectedRows.some((row) => row.type !== "Médico-social")} onClick={lancerComparaison}>
                {wording.COMPARER}
              </button>
            </li>
            : null}
          <li className={styles["menu-item"]}>
            {listId ? <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.length === 0} onClick={onClickDelete}>
              {wording.SUPPRIMER_DE_LA_LISTE}
            </button>
              : <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.length === 0} onClick={handleDisplayFavorisPopup}>
                Ajouter à mes listes
              </button>
            }
          </li>
          <li className={styles["menu-item"]}>
            <Export
              disabledExport={disabledExport}
              listId={listId}
              listName={listName}
              order={order}
              orderBy={orderBy}
              router={router}
              wording={wording}>
              {children}
            </Export>
          </li>
        </ul>
      }
      {displayFavorisPopup &&
        <FavorisPopup addOnOneListOnly={true} favorite={listFinessNumbers} onClickOkSuccess={onAddToFavorisSuccess} onClosePopup={() => setDisplayFavorisPopup(false)} onNewListCreationSuccess={onAddToFavorisSuccess} positionX={popupX} positionY={popupY} />
      }
    </div>
  );
};
