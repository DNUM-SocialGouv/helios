import { useContext, useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { UserContext } from "../commun/contexts/userContext";
import { RechercheViewModel } from "../home/RechercheViewModel";
import styles from "./Favoris.module.css";
import { FavorisBlock } from "./FavorisBlock";

export const FavorisPage = () => {
    const { wording } = useDependencies();
    const userContext = useContext(UserContext);

    const [ejFavoris, setEjFavoris] = useState<RechercheViewModel[]>([]);
    const [sanitaireFavoris, setSanitaireFavoris] = useState<RechercheViewModel[]>([]);
    const [socialFavoris, setSocialFavoris] = useState<RechercheViewModel[]>([]);

    useEffect(() => {
        setEjFavoris(userContext?.favoris.filter(elt => elt.type === 'Entité juridique') || []);
        setSanitaireFavoris(userContext?.favoris.filter(elt => elt.type === 'Sanitaire') || []);
        setSocialFavoris(userContext?.favoris.filter(elt => elt.type === 'Médico-social') || []);
    }, [userContext?.favoris])

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.FAVORIS_LIST} ({userContext?.favoris.length})</h1>
            <FavorisBlock favorisList={ejFavoris} title={wording.EJ_SECTION_TITLE} />
            <FavorisBlock favorisList={sanitaireFavoris} title={wording.SANITAIRE_SECTION_TITLE} />
            <FavorisBlock favorisList={socialFavoris} title={wording.SOCIAL_SECTION_TITLE} />
        </main>
    );
};