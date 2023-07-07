import { useContext } from "react";

import { UserContext } from "../commun/contexts/userContext";
import { Establishment } from "../home/establishment";
import styles from "../home/Recherche.module.css";

export const FavorisPage = () => {
    const userContext = useContext(UserContext)
    return (
        <main className="fr-container">
            <section>
                <ul className={"fr-grid-row fr-grid-row--gutters " + styles["tuiles"]}>
                    {userContext?.favoris.map((résultatViewModel, index) => (
                        <li className="fr-col-3" key={résultatViewModel.numéroFiness + index}>
                            <Establishment résultatViewModel={résultatViewModel} />
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
};