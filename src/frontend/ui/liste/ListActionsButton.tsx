import { useRouter } from "next/router";
import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { SelectedRows } from "../commun/Table/Table";
import { useFavoris } from "../favoris/useFavoris";
import { ComparaisonViewModel } from "../home/ComparaisonViewModel";
import { RechercheViewModel } from "../home/RechercheViewModel";
import styles from "./ListActionsButton.module.css"

type ListActionsButtonProps = Readonly<{
    selectedRows: RechercheViewModel[] | ComparaisonViewModel[] | (RechercheViewModel | ComparaisonViewModel)[];
    setSelectedRows: React.Dispatch<React.SetStateAction<SelectedRows>>
    listId: number;
}>;

export const ListActionsButton = ({ selectedRows, setSelectedRows, listId }: ListActionsButtonProps) => {
    const { wording } = useDependencies();
    const router = useRouter();
    const { removeFromFavorisList } = useFavoris()
    const [displayActions, setDisplayActions] = useState<boolean>(false);
    const listFinessNumbers = selectedRows.map((row) => row.numéroFiness);

    const lancerComparaison = () => {
        const firstType = selectedRows[0].type;
        sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
        sessionStorage.setItem("comparaisonType", firstType);
        document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
        document.cookie = `type=${encodeURIComponent(firstType)}; path=/`;
        router.push("/comparaison");
    }

    const onClickDelete = async () => {
        await removeFromFavorisList(listFinessNumbers, listId);
        setSelectedRows([]);
        setDisplayActions(false);
        router.replace(router.asPath);
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
                        <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.length === 0} onClick={onClickDelete}>
                            {wording.SUPPRIMER_DE_LA_LISTE}
                        </button>
                    </li>
                    <li className={styles["menu-item"]}>
                        <button className="fr-btn fr-btn--tertiary-no-outline">
                            {wording.EXPORTER}
                        </button>
                    </li>
                </ul>
            }
        </div>
    );
};
