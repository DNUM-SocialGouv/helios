import { useState } from "react";

import { MessageAccueil } from "../../../../backend/métier/gateways/MessageAccueilLoader";

export const NewFeaturesNotice = ({ messageAccueil }: { messageAccueil: MessageAccueil }) => {
  const [removeNotice, setRemoveNotice] = useState(false);

  const badgeClass = messageAccueil.badgeType ? `fr-badge--${messageAccueil.badgeType}` : "fr-badge--info";
  return (
    removeNotice ? null :
      <div className="fr-notice fr-notice--info">
        <div className="fr-container">
          <div className="fr-notice__body">
              <span className="fr-notice__title">
                <span className={`fr-mr-2w fr-badge ${badgeClass} fr-badge--no-icon`}>Nouveau</span>
              </span>
              <p>
                <span className="fr-notice__desc">
                  {messageAccueil.contenu}
                </span>
              </p>
            <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
          </div>
        </div>
      </div>
  );
};
