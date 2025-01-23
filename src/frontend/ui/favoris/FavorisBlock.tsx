import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { Badge } from "../commun/Badge/Badge";
import { useDependencies } from "../commun/contexts/useDependencies";
import { TuileEtablissement } from "../commun/TuileEtablissement/TuileEtablissement";
import { TuileEtablissementViewModel } from "../commun/TuileEtablissement/TuileEtablissementViewModel";
import styles from "./Favoris.module.css";


type FavorisBlockProps = Readonly<{
    favorisList: TuileEtablissementViewModel[];
    title: string;
    currentListId: number;
}>;

export const FavorisBlock = ({
    favorisList,
    title,
    currentListId
}: FavorisBlockProps) => {
    const { wording } = useDependencies();

    const getTitleColor = (title: string) => {
        if (title === wording.EJ_SECTION_TITLE) return "default";
        else if (title === wording.SANITAIRE_SECTION_TITLE) return "pink-tuile";
        else return "green-emeraude"
    }

    return (
        <div className="fr-mb-3w" >
            <Badge className="fr-mb-1w" colour={getTitleColor(title)} label={title + " (" + favorisList.length + ")"} />
            <br />
            <section>
                <ul className={"fr-grid-row fr-grid-row--gutters " + styles["tuiles"]}>
                    {favorisList.map((résultatViewModel, index) => (
                        <li className="fr-col-3" key={résultatViewModel.numéroFiness + index}>
                            <TuileEtablissement currentListId={currentListId} rafraichitAuRetraitFavoris={true} tuileEtablissementViewModel={résultatViewModel} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};