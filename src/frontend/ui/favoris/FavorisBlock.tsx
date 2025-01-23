import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import Link from "next/link";
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
    isFavoris: boolean;
}>;

export const FavorisBlock = ({
    isFavoris,
    currentListId,
    favorisList,
    title,
}: FavorisBlockProps) => {
    const { wording, paths } = useDependencies();
    const list = favorisList.length > 4 ? favorisList.slice(0, 3) : favorisList;
    const [listEtablissements, setLlistEtablissements] = useState<TuileEtablissementViewModel[]>([]);

    useEffect(() => {
        if (list.length === 0) setLlistEtablissements([]);
        else
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
    }, [favorisList])

    return (
        <div className="fr-mb-3w" >
            <h5 className="fr-mb-1w" >{(isFavoris ? wording.FAVORIS_LIST_TITLE : title) + " (" + favorisList.length + ")"}</h5>
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
                            <Link href={`/liste/${currentListId}`}> + {favorisList.length - 3} </Link>
                        </div>
                    </li>}
                </ul>
            </section>
        </div>
    );
};