import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import { TuileEtablissementViewModel } from "../commun/TuileEtablissement/TuileEtablissementViewModel";
import styles from "./Favoris.module.css";
import { FavorisBlock } from "./FavorisBlock";

type FavorisProps = Readonly<{
    listId: number;
    favoris: TuileEtablissementViewModel[];
}>;

export const FavorisPage = ({ listId, favoris }: FavorisProps) => {
    const { wording } = useDependencies();

    const ejFavoris = favoris.filter(elt => elt.type === 'Entité juridique') || [];
    const sanitaireFavoris = favoris.filter(elt => elt.type === 'Sanitaire') || [];
    const socialFavoris = favoris.filter(elt => elt.type === 'Médico-social') || [];

    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.FAVORIS_LIST} ({favoris.length})</h1>
            <FavorisBlock currentListId={listId} favorisList={ejFavoris} title={wording.EJ_SECTION_TITLE} />
            <FavorisBlock currentListId={listId} favorisList={sanitaireFavoris} title={wording.SANITAIRE_SECTION_TITLE} />
            <FavorisBlock currentListId={listId} favorisList={socialFavoris} title={wording.SOCIAL_SECTION_TITLE} />
        </main>
    );
};