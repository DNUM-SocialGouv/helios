import { useState } from "react";

import { MessageAccueil } from "../../../../backend/métier/gateways/MessageAccueilLoader";

const renderMessageWithLink = (contenu: string, lienUrl: string | null, lienLibelle: string | null) => {
  if (lienUrl && lienLibelle) {
    return (
    <>
      {contenu} <a href={lienUrl} rel="noopener noreferrer" target="_blank">{lienLibelle}</a>
    </>
  );
  }

  return contenu;

};

export const NewFeaturesNotice = ({ messageAccueil }: { messageAccueil: MessageAccueil }) => {
  const [removeNotice, setRemoveNotice] = useState(false);

  const badgeClass = messageAccueil.badgeType ? `fr-badge--${messageAccueil.badgeType}` : "fr-badge--info";
  return (
    removeNotice ? null :
      <div className="fr-notice fr-notice--info">
        <div className="fr-container">
          <div className="fr-notice__body">
              <span className="fr-notice__title">
                {messageAccueil.badgeType && messageAccueil.badgeLibelle && <span className={`fr-mr-2w fr-badge ${badgeClass} fr-badge--no-icon`}>{messageAccueil.badgeLibelle}</span>}
              </span>
              <p>
                <span className="fr-notice__desc">
                  {renderMessageWithLink(messageAccueil.contenu, messageAccueil.lienUrl, messageAccueil.lienLibelle)}
                </span>
              </p>
            <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
          </div>
        </div>
      </div>
  );
};
