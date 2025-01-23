import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { TuileEtablissement } from "../commun/TuileEtablissement/TuileEtablissement";
import { TuileEtablissementViewModel } from "../commun/TuileEtablissement/TuileEtablissementViewModel";
import { RechercheViewModel } from "../home/RechercheViewModel";
import styles from "./Favoris.module.css";


type FavorisBlockProps = Readonly<{
    currentListId: number;
    favorisList: any[];
    title: string;
}>;

export const FavorisBlock = ({
    currentListId,
    favorisList,
    title,
}: FavorisBlockProps) => {
    const { paths } = useDependencies();
    const list = favorisList.length > 4 ? favorisList.slice(0, 3) : favorisList;
    const [listEtablissements, setLlistEtablissements] = useState<TuileEtablissementViewModel[]>([]);

    useEffect(() => {
        fetch("/api/recherche-par-finess", {
            body: JSON.stringify({
                finessNumber: list.map((etb) => { return etb.finessNumber })
            }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then((response) => response.json())
            .then((data) => {
                setLlistEtablissements(data.map((résultat: any) => new RechercheViewModel(résultat, paths)));
            });
    }, [])

    return (
        <div className="fr-mb-3w" >
            <h5 className="fr-mb-1w" >{title + " (" + favorisList.length + ")"}</h5>
            <br />
            <section>
                <ul className={"fr-grid-row fr-grid-row--gutters " + styles["tuiles"]}>
                    {listEtablissements.map((résultatViewModel, index) => (
                        <li className="fr-col-3" key={résultatViewModel.numéroFiness + index}>
                            <TuileEtablissement currentListId={currentListId} tuileEtablissementViewModel={résultatViewModel} />
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