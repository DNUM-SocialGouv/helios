import "@gouvfr/dsfr/dist/component/tab/tab.min.css";

import { ChangePwdPage } from "../change-mot-passe/ChangePwdPage";
import { UserInfoTab } from "./UserInfoTab";

export const ProfilePage = () => {


  return (
    <main >
      <div className="fr-tabs">
        <ul className="fr-tabs__list" role="tablist">
          <li role="presentation">
            <button aria-controls="tabpanel-infos" aria-selected="true" className="fr-tabs__tab" role="tab">
              Mes informations
            </button>
          </li>
          <li role="presentation">
            <button aria-controls="tabpanel-pwd" aria-selected="false" className="fr-tabs__tab" role="tab">
              Mot de passe
            </button>
          </li>
        </ul>
        <div className="fr-tabs__panel fr-tabs__panel--selected" id="tabpanel-infos" role="tabpanel">
          <UserInfoTab />
        </div>
        <div className="fr-tabs__panel" id="tabpanel-pwd" role="tabpanel">
          <ChangePwdPage />
        </div>
      </div>

    </main>
  );
};
