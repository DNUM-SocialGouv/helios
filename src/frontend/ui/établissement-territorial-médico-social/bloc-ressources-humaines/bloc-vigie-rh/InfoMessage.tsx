import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";


export const InfoMessage = () => {
  const [removeNotice, setRemoveNotice] = useState(false);
  const { wording } = useDependencies();

  return (
    removeNotice ? null :
      <div className="fr-notice fr-notice--info fr-mb-2w" >
        <div className="fr-container">
          <div className="fr-notice__body">
            <p>
              <span className="fr-notice__title"></span>
              <span className="fr-notice__desc">{wording.MESSAGE_INFO_VIGIE_RH}</span>
            </p>
            <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
          </div>
        </div>
      </div>
  );
};
