import { useContext, useRef, useState } from "react";

import styles from "./StarButtonList.module.css";
import { useFavoris } from "../../favoris/useFavoris";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";
import { FavorisPopup } from "../FavorisPopup/FavorisPopup";

type StarButtonProps = Readonly<{
  favorite: RechercheViewModel;
  parent: string;
}>;

export const StarButtonList = ({ favorite, parent }: StarButtonProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const { getFavorisLists } = useFavoris();
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);

  let buttonStyle = "starInEstablishment";
  if (parent === "titre") {
    buttonStyle = "star";
  } else if (parent === "tab") {
    buttonStyle = "star-tab"
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

  return (
    <>
      <button
        className={(isInFavoris() ? "fr-icon-star-fill .fr-icon--lg " : "fr-icon-star-line .fr-icon--lg	") + styles[buttonStyle]}
        onClick={handleDisplayPopup}
        ref={buttonRef}
        title={isInFavoris() ? wording.ETOILE_ETAB_DANS_LISTE : wording.ETOILE_ETAB_PAS_DANS_LISTE}
      />
      {displayPopup &&
        <FavorisPopup favorite={favorite.numéroFiness} onClosePopup={() => setDisplayPopup(false)} positionX={popupX} positionY={popupY} />
      }
    </>
  );
};
