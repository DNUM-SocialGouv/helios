import { useRouter } from "next/router";
import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { ComparaisonViewModel } from "../home/ComparaisonViewModel";
import { RechercheViewModel } from "../home/RechercheViewModel";
import ExportList from "./ExportList";
import styles from "./ListActionsButton.module.css"

type ListActionsButtonProps = Readonly<{
    selectedRows: RechercheViewModel[] | ComparaisonViewModel[] | (RechercheViewModel | ComparaisonViewModel)[];
    listId: number;
    listName: string;
    order: string;
    orderBy: string;
    disabledExport: boolean
}>;

export const ListActionsButton = ({ selectedRows, listId, listName, order, orderBy, disabledExport}: ListActionsButtonProps) => {
    const { wording } = useDependencies();
    const router = useRouter();

    const [displayActions, setDisplayActions] = useState<boolean>(false);

    const lancerComparaison = () => {
        const firstType = selectedRows[0].type;
        const listFinessNumbers = selectedRows.map((row) => row.numéroFiness);
        sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
        sessionStorage.setItem("comparaisonType", firstType);
        document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
        document.cookie = `type=${encodeURIComponent(firstType)}; path=/`;
        router.push("/comparaison");
    }

    return (
        <div className={styles["button-position"]}>
            <button className={displayActions ? "fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary" : "fr-btn fr-btn--icon-right fr-icon-arrow-up-s-line fr-btn--secondary"} onClick={() => setDisplayActions(!displayActions)}> {wording.ACTIONS} </button>
            {displayActions &&
                <ul className={styles["menu"]}>
                    <li className={styles["menu-item"]}>
                        <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.length < 2 || selectedRows.some((row) => row.type !== "Médico-social")} onClick={lancerComparaison}>
                            {wording.COMPARER}
                        </button>
                    </li>
                    <li className={styles["menu-item"]}>
                        <button className="fr-btn fr-btn--tertiary-no-outline">
                            {wording.SUPPRIMER_DE_LA_LISTE}
                        </button>
                    </li>
                    <li className={styles["menu-item"]}>
                        <ExportList disabled={disabledExport} listId={listId} listName={listName} order={order} orderBy={orderBy} />
                    </li>
                </ul>
            }
        </div>
    );
};
