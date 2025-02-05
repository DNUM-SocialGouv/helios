import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./ListActionsButton.module.css"

type ListActionsButtonProps = Readonly<{}>;

export const ListActionsButton = ({ }: ListActionsButtonProps) => {
    const { wording } = useDependencies();

    const [displayActions, setDisplayActions] = useState<boolean>(false);

    return (
        <div className={styles["button-position"]}>
            <button className="fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary" onClick={() => setDisplayActions(!displayActions)}> {wording.ACTIONS} </button>
            {displayActions &&
                <ul className={styles["menu"]}>
                    <li className={styles["menu-item"]}>
                        <button>
                            {wording.COMPARER}
                        </button>
                    </li>
                    <li className={styles["menu-item"]}>
                        <button >
                            {wording.SUPPRIMER_DE_LA_LISTE}
                        </button>
                    </li>
                    <li className={styles["menu-item"]}>
                        <button>
                            {wording.EXPORTER}
                        </button>
                    </li>
                </ul>
            }
        </div>
    );
};
