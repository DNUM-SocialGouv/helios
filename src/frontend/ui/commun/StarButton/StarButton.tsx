import { useContext } from "react";

import { useFavoris } from "../../favoris/useFavoris";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserContext } from "../contexts/userContext";
import styles from "./StarButton.module.css";

type StarButtonProps = Readonly<{
    favorite: RechercheViewModel | undefined;
}>;

export const StarButton = ({ favorite }: StarButtonProps) => {
    const userContext = useContext(UserContext);
    const { addToFavoris, removeFromFavoris } = useFavoris();


    const handleFavoriteStatus = async () => {
        const filtredFavoris = userContext?.favoris.filter((item) => item.numéroFiness === favorite?.numéroFiness);

        if (filtredFavoris?.length !== 0) {
            await removeFromFavoris(favorite);
        } else {
            await addToFavoris(favorite);
        }
    }

    return (
        <button
            className={userContext?.favoris.filter((item) => item.numéroFiness === favorite?.numéroFiness).length !== 0 ? "fr-icon-star-fill .fr-icon--lg " + styles["star"] : "fr-icon-star-line .fr-icon--lg	" + styles["star"]}
            onClick={() => handleFavoriteStatus()}
            title={userContext?.favoris.filter((item) => item.numéroFiness === favorite?.numéroFiness).length !== 0 ? "Enlever cet établissement des favoris" : "Ajouter cet établissement aux favoris"}
        />

    );
};