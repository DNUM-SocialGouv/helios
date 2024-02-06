import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { ChangeEvent, useState } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { useDependencies } from "../commun/contexts/useDependencies";
import { ProfileTable } from "./ParamatrageTable";
import styles from "./ParametrageProfil.module.css";

type ParametrageProfilPageProps = Readonly<{
    value: ProfileValue;
    label: string;
    code: string;
    id: number;
}>;

export const ParametrageProfilPage = ({ value, label, code, id }: ParametrageProfilPageProps) => {

    const [changeTitle, setChangeTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(label);
    const { wording } = useDependencies();

    const changeTitleClick = () => {
        setChangeTitle(true);
    }

    const onChangeNewTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.target.value);
    }

    return (
        <main className="fr-container">
            {changeTitle ?
                <>
                    <label className="fr-label fr-mt-8w" htmlFor="text-input">{wording.PROFILE_TITLE}</label>
                    <input className="fr-input" id="text-input" name="text-input" onChange={(e) => onChangeNewTitle(e)} type="text" value={newTitle} />
                </>
                :
                <div className="fr-grid-row">
                    <h1 className={styles["title"]}>Autorisation : {newTitle}</h1>
                    <button className={"fr-icon-edit-line " + styles["edit-icon"]} onClick={changeTitleClick} />
                </div>
            }

            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                <ProfileTable codeValue={code} creating={false} name={newTitle} profileId={id} profileValue={value} />
            </div>
        </main >
    );
};