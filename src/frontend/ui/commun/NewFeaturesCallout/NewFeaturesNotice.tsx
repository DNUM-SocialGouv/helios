import "@gouvfr/dsfr/dist/component/callout/callout.min.css";

import { useState } from "react";

import { useDependencies } from "../contexts/useDependencies";
import styles from "./NewFeaturesNotice.module.css";


export const NewFeaturesCallout = () => {
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
                            {wording.NOUVELLES_FONCTIONNALITÉS}
                        </span>
                        <span className="fr-notice__desc">{wording.NOUVELLES_FONCTIONNALITÉS_TEXT}</span>
                    </p>
                    <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
                </div>
            </div>
        </div>
    );
};
