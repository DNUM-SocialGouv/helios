import { useRouter } from "next/router";
import { KeyboardEvent, useState } from "react";

import ConfirmDeleteListModal from "./DeleteListModal";
import styles from "./ListNameButton.module.css"
import { useDependencies } from "../commun/contexts/useDependencies";
import { useOutsideClick } from "../commun/hooks/useOutsideClick";
import { useFavoris } from "../favoris/useFavoris";

const ListNameButton = ({ id, name }: { id: number, name: string }) => {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [updateListName, setUpdateListName] = useState(false);
    const { breadcrumbHandler, wording, paths } = useDependencies();
    const [listName, setListName] = useState(name);
    const [newName, setNewName] = useState(listName);
    const router = useRouter();
    const { updateListName: updateName, deleteList } = useFavoris();
    const ref = useOutsideClick(() => setDisplayMenu(false));

    const onClickUpdateTitle = () => {
        setUpdateListName(true);
        setDisplayMenu(false);
    }
    const onClickDeleteList = () => {
        deleteList(id);
        router.push(paths.MES_LISTES)
    }

    const onClickConfirmUpdate = () => {
        setUpdateListName(false);
        breadcrumbHandler.updateBreadcrum([
            {
                label: wording.FAVORIS_LIST,
                path: paths.MES_LISTES,
            },
            {
                label: newName,
                path: "",
            },
        ])
        updateName(id, newName);
        setListName(newName);
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onClickConfirmUpdate();
        }
    };

    return <div className={styles["title"]}>
        {updateListName ?
            <>
                <input
                    className="fr-input"
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                    value={newName}
                />
                <button className="fr-btn" onClick={onClickConfirmUpdate}>Valider</button>
                <button className="fr-btn fr-btn--secondary" onClick={() => { setUpdateListName(false); setNewName(listName) }}>Annuler</button>
            </> :
            <h1 className={styles["list-title"]}>
                {listName}
            </h1>
        }
        <div className={styles["dropdown"]}>
            {!updateListName ?
                <button
                    className={"fr-icon-edit-line " + styles["menu-button"]}
                    onClick={() => {
                        setDisplayMenu(!displayMenu);
                    }}
                    ref={ref}
                    title="Modifier la liste"
                /> : null}
            {displayMenu ? (
                <ul className={styles["menu"]}>
                    <li>
                        <button onClick={onClickUpdateTitle}>Modifier le titre</button>
                    </li>
                    <hr className={styles["menu-sperator"]} />
                    <li>
                        <button
                            aria-controls="fr-modal-2" className="fr-btn" data-fr-opened="false" title="Supprimer"
                            type="button"
                        >
                            Supprimer la liste
                        </button>
                    </li>
                </ul>
            ) : null}
        </div>
        <ConfirmDeleteListModal deleteList={() => onClickDeleteList()} />
    </div>
}

export default ListNameButton;