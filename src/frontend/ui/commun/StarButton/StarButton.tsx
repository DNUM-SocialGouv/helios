import { useContext } from "react";

import { useFavoris } from "../../favoris/useFavoris";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { UserContext } from "../contexts/userContext";
import { TuileEtablissementViewModel } from "../TuileEtablissement/TuileEtablissementViewModel";
import styles from "./StarButton.module.css";

type StarButtonProps = Readonly<{
    favorite: RechercheViewModel | TuileEtablissementViewModel | undefined;
    parent: string;
}>;

export const StarButton = ({ favorite, parent }: StarButtonProps) => {
    const userContext = useContext(UserContext);
    const { addToFavoris, removeFromFavoris } = useFavoris();
    const filtredFavoris = userContext?.favoris?.filter((item) => item.numéroFiness === favorite?.numéroFiness);

    const handleFavoriteStatus = async () => {

        if (filtredFavoris?.length !== 0) {
            await removeFromFavoris(favorite);
        } else {
            await addToFavoris(favorite);
        }
    }

    return (
        <button
            className={(filtredFavoris?.length !== 0 ? "fr-icon-star-fill .fr-icon--lg " : "fr-icon-star-line .fr-icon--lg	") + styles[parent === "tab" ? "star-tab" : parent === "titre" ? "star" : "starInEstablishment"]}
            onClick={() => handleFavoriteStatus()}
            title={filtredFavoris?.length !== 0 ? "Enlever cet établissement des favoris" : "Ajouter cet établissement aux favoris"}
        />

    );
};
