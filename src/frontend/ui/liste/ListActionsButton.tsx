import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { ComparaisonViewModel } from "../home/ComparaisonViewModel";
import { RechercheViewModel } from "../home/RechercheViewModel";
import styles from "./ListActionsButton.module.css"

type ListActionsButtonProps = Readonly<{
    selectedRows: RechercheViewModel[] | ComparaisonViewModel[] | (RechercheViewModel | ComparaisonViewModel)[];
}>;

export const ListActionsButton = ({ selectedRows }: ListActionsButtonProps) => {
    const { wording } = useDependencies();

    const [displayActions, setDisplayActions] = useState<boolean>(false);

    return (
        <div className={styles["button-position"]}>
            <button className={displayActions ? "fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary" : "fr-btn fr-btn--icon-right fr-icon-arrow-up-s-line fr-btn--secondary"} onClick={() => setDisplayActions(!displayActions)}> {wording.ACTIONS} </button>
            {displayActions &&
                <ul className={styles["menu"]}>
                    <li className={styles["menu-item"]}>
                        <button className="fr-btn fr-btn--tertiary-no-outline" disabled={selectedRows.length < 2}>
                            {wording.COMPARER}
                        </button>
                    </li>
                    <li className={styles["menu-item"]}>
                        <button className="fr-btn fr-btn--tertiary-no-outline">
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
