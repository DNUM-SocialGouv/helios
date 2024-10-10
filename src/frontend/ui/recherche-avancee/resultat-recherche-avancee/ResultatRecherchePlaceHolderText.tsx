import { useDependencies } from "../../commun/contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/segmented/segmented.min.css";
import styles from '../RechercheAvanceeFormulaire.module.css'

export const ResultatRecherchePlaceholderText = () => {
    const { wording } = useDependencies();

    return (
        <div className={styles["ResultatRechercheAvanceeText"]}> {wording.RESULTAT_RECHERCHE_AVANCEE_TEXT} </div>
    )
};
