import { useDependencies } from "../commun/contexts/useDependencies";
import styles from './RechercheAvanceeFormulaire.module.css'

export const ResultatRechercheBLocText = () => {
    const { wording } = useDependencies();

    return (
        <div className={styles["ResultatRechercheAvanceeText"]}> {wording.RESULTAT_RECHERCHE_AVANCEE_TEXT} </div>
    )
};
