import { useState } from "react";
import Emoji from "react-emojis"

import styles from "./NewFeaturesNotice.module.css";


export const NewFeaturesNotice = () => {
  const [removeNotice, setRemoveNotice] = useState(false);
  return (
    removeNotice ? null :
      <div className="fr-notice fr-notice--info">
        <div className="fr-container">
          <div className="fr-notice__body">
            <p>
              <span className="fr-notice__title">
                <span className={styles["notice-badge"] + " fr-badge fr-badge--new fr-badge--no-icon"}>Nouveau</span>
              </span>
              <p>
                <span className="fr-notice__desc">
                  Les blocs Qualité et Budget et Finances évoluent :  accédez aux fiches Qualiscope de la HAS et à de nouveaux indicateurs.
                  <br />
                  Sécurité <Emoji emoji="locked" />: Mot de passe à renouveler régulièrement.
                </span>
              </p>
            </p>
            <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
          </div>
        </div>
      </div>
  );
};
