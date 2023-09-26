import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { ProfileValue } from "../../../../database/models/ProfilModel";
import { useDependencies } from "../commun/contexts/useDependencies";
import { ProfileTable } from "./ParamatrageTable";
import styles from "./ParametrageProfil.module.css";


type ParametrageProfilPageProps = Readonly<{
    value: ProfileValue;
    label: string;
}>;

export const ParametrageProfilPage = ({ value, label }: ParametrageProfilPageProps) => {
    const { wording } = useDependencies();
    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.PARAMETRAGE_PROFILE} {label}</h1>
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                <ProfileTable profileValue={value} />
            </div>
            <button className="fr-mt-2v fr-btn">
                Sauvegarder
            </button>
        </main >
    );
};