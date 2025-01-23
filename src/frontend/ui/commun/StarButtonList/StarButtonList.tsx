import { useRouter } from "next/router";
import { useContext } from "react";

import { useFavoris } from "../../favoris/useFavoris";
import { UserContext } from "../contexts/userContext";
import { TuileEtablissementViewModel } from "../TuileEtablissement/TuileEtablissementViewModel";
import styles from "./StarButtonList.module.css";

type StarButtonProps = Readonly<{
    favorite: TuileEtablissementViewModel | undefined;
    parent: string;
    currentListId: number;
    rafraichitAuRetraitFavoris?: boolean;
}>;

export const StarButtonList = ({ favorite, parent, currentListId, rafraichitAuRetraitFavoris = false }: StarButtonProps) => {
    const userContext = useContext(UserContext);
    const router = useRouter();

    const { addToFavorisList, removeFromFavorisList } = useFavoris();

    const handleFavoriteStatus = () => {

        if (isInFavoris()) {
            removeFromFavorisList(favorite, currentListId).finally(() => {
                if (rafraichitAuRetraitFavoris) {
                    router.replace(router.asPath);
                }    
            })
        } else {
            addToFavorisList(favorite, currentListId);
        }
    }

    const isInFavoris = () => {
        // Pour le moment il n’y a pas les modal de choix de liste.
        // La liste courante est donc obligatoire et doit être la liste « Favoris »
        // Quand il y aura la modale, currentListId sera optionnel et devra être géré

        // On regarde si l’etablissement est dans une liste de favoris
        const listForElement = favorite ? userContext?.favorisLists.flatMap(list => list.userListEtablissements).filter(etablissement => etablissement.finessNumber === favorite.numéroFiness) : undefined;

        // Si ou on regarde si il est dans la « currentListId »
        if (listForElement) {
            return listForElement.some(etablissement => etablissement.listId === currentListId);
        }

        return false;
    }

    return (
        <button
            className={(isInFavoris() ? "fr-icon-star-fill .fr-icon--lg " : "fr-icon-star-line .fr-icon--lg	") + styles[parent === "tab" ? "star-tab" : parent === "titre" ? "star" : "starInEstablishment"]}
            onClick={() => handleFavoriteStatus()}
            title={isInFavoris() ? "Enlever cet établissement des favoris" : "Ajouter cet établissement aux favoris"}
        />

    );
};