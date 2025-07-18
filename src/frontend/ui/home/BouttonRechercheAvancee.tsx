import Link from "next/link";

import styles from "./Recherche.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";



export const BouttonRechercheAvancee = () => {
    const { paths, wording } = useDependencies();

    return (
        <Link className={"fr-link fr-mt-3w fr-icon-arrow-right-line fr-link--icon-right " + styles["rechercheAvancee"]} href={paths.RECHERCHE_AVANCEE} passHref >
            {wording.RECHERCHE_AVANCEE_LABEL}
        </Link>
    );
};