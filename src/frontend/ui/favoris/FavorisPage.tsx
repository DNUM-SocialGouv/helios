import { useContext } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import styles from "./Favoris.module.css";
import { FavorisBlock } from "./FavorisBlock";

export const FavorisPage = () => {
    const { wording } = useDependencies();
    const userContext = useContext(UserContext);

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.FAVORIS_LIST} ({userContext?.favorisLists?.length})</h1>
            {userContext?.favorisLists?.map((etablissement: any, index: number) => (
                <div key={index}>
                    <FavorisBlock currentListId={etablissement.id} favorisList={etablissement.userListEtablissements} title={etablissement.nom} />
                </div>
            ))}
        </main>
    );
};