import { useState } from "react";

import styles from "./NewFeaturesNotice.module.css";
import { useDependencies } from "../contexts/useDependencies";


export const NewFeaturesNotice = () => {
    const { wording } = useDependencies();
    const [removeNotice, setRemoveNotice] = useState(false);
    return (
        removeNotice ? null :
            <div className="fr-notice fr-notice--info">
                <div className="fr-container">
                    <div className="fr-notice__body">
                        <p>
                            <span className="fr-notice__title">
                                <span className={styles["notice-badge"] + " fr-badge fr-badge--new fr-badge--no-icon"}>{wording.NOUVEAU}</span>
                            </span>
                            <span className="fr-notice__desc">{wording.NOUVELLES_FONCTIONNALITÉS_TEXT}</span>
                            <a
                                href="https://msociauxfr.sharepoint.com/:f:/r/teams/Helios-Communautdutilisateurs/Documents%20partages/General/Documentation?csf=1&web=1&e=sekz8x"
                                rel="external noopener noreferrer"
                                target="_blank"
                                title='En savoir plus'
                            >
                                En savoir plus
                            </a>
                        </p>
                        <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
                    </div>
                </div>
            </div>
    );
};
