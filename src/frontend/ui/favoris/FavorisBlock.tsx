import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { Establishment } from "../home/Establishment";
import { RechercheViewModel } from "../home/RechercheViewModel";
import styles from "./Favoris.module.css";


type FavorisBlockProps = Readonly<{
    favorisList: RechercheViewModel[];
    title: string;
}>;

export const FavorisBlock = ({
    favorisList,
    title,
}: FavorisBlockProps) => {
    const list = favorisList.length > 4 ? favorisList.slice(0, 3) : favorisList;
    return (
        <div className="fr-mb-3w" >
            <h5 className="fr-mb-1w" >{title + " (" + favorisList.length + ")"}</h5>
            <br />
            <section>
                <ul className={"fr-grid-row fr-grid-row--gutters " + styles["tuiles"]}>
                    {list.map((résultatViewModel, index) => (
                        <li className="fr-col-3" key={résultatViewModel.numéroFiness + index}>
                            <Establishment résultatViewModel={résultatViewModel} />
                        </li>
                    ))}
                    {favorisList.length > 4 && <li className="fr-col-3">
                        <div className={styles["reste-liste"]}>
                            <h5> + {favorisList.length - 3} </h5>
                        </div>
                    </li>}
                </ul>
            </section>
        </div>
    );
};