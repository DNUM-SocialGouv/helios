import { useContext, useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { UserListViewModel } from "../user-list/UserListViewModel";
import styles from "./Favoris.module.css";
import { FavorisBlock } from "./FavorisBlock";

export const FavorisPage = () => {
    const { wording } = useDependencies();
    const userContext = useContext(UserContext);

    const [sortedFavorisList, setSortedFavorisList] = useState(userContext?.favorisLists);

    useEffect(() => {
        setSortedFavorisList(userContext?.favorisLists?.sort((a, b) =>
            (b.isFavoris === a.isFavoris ? 0 : b.isFavoris ? 1 : -1)
        ))
    }, [userContext?.favorisLists])

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.FAVORIS_LIST} ({userContext?.favorisLists?.length})</h1>
            {sortedFavorisList?.map((etablissement: UserListViewModel, index: number) => (
                <div key={index}>
                    <FavorisBlock currentListId={etablissement.id} favorisList={etablissement.userListEtablissements} isFavoris={etablissement.isFavoris} title={etablissement.nom} />
                </div>
            ))}
        </main>
    );
};