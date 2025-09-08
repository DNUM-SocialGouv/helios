import styles from "./AlerteComparaison.module.css";
import { useDependencies } from "../../commun/contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";

export const AlerteComparaison = () => {

    const { wording } = useDependencies();

    return (
        <div className={"fr-alert fr-alert--error fr-mt-2w fr-mb-1w " + styles['multiline']}>
            <h3 className="fr-alert__title">{wording.ALERTE_TYPE_DIFFERENT_TITRE}</h3>
            <p>{wording.ALERTE_TYPE_DIFFERENT_CORPS}</p>
        </div>
    )

}